/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {View, Text, Platform, LogBox} from 'react-native';
import ChatHeader from './components/chatHeader';
import ChatInput from './components/ChatInput';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CometChat} from '@cometchat-pro/react-native-chat';
import {FlashList} from '@shopify/flash-list';
import ChatCard from './components/chatCard';
import {useNavigation} from '@react-navigation/native';
import {onBackPress} from '../../utils/backPressHandler';
import {useConversationList} from '../../cometChat/hooks/useConversationList';

const ChatScreen = ({route}: any) => {
  const {userId, username, loggedInUserId} = route.params;
  const navigation = useNavigation<any>();
  const flatlistRef = useRef<any>();
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const {attachChatListeners, removeChatListeners, newMessage} =
    useConversationList();
  let conversationListenerId = `chatlist_${new Date().getTime()}`;

  /* flashList bug */
  LogBox.ignoreLogs([
    'scrollTo was called before RecyclerListView was measured, please wait for the mount to finish',
  ]);

  /* new incomming realtime message handler */
  function attachListeners() {
    attachChatListeners(conversationListenerId);
  }

  /* new incomming realtime message */
  useEffect(() => {
    if (newMessage) {
      setMessages((oldArray: any) => [...oldArray, newMessage]);
    }
  }, [newMessage]);

  /* revoke any incomming realtime message handler enabled before chat screen exit */
  function removeListeners() {
    removeChatListeners(conversationListenerId);
  }

  /* send text message */
  const sendTextMessage = () => {
    setInputValue('');
    let receiverID = userId;
    let messageText = inputValue;
    let receiverType = CometChat.RECEIVER_TYPE.USER;
    let textMessage = new CometChat.TextMessage(
      receiverID,
      messageText,
      receiverType,
    );

    if (inputValue.length > 0) {
      CometChat.sendMessage(textMessage).then(
        message => {
          // console.log('Message sent successfully:', message);
          setMessages((oldArray: any) => [
            ...oldArray,
            message,
          ]); /* add new message to message list */
        },
        error => {
          console.log('Message sending failed with error:', error);
        },
      );
    }
  };

  /* handle back press and clear all active message listener */
  const onBackPressed: any = () => {
    removeListeners();
    navigation.navigate('Home');
  };

  useEffect(() => {
    onBackPress(onBackPressed);
  }, []);

  /* render message cards according to user and reciever */
  const renderMessageCard = (messageInfo: any) => {
    return (
      <View
        style={{
          flex: 1,
          alignItems:
            messageInfo.sender.uid ===
            loggedInUserId /* check if message is sent by logged in user or not */
              ? 'flex-end'
              : 'flex-start',
        }}>
        <ChatCard message={messageInfo.data.text} />
      </View>
    );
  };

  /* initial messages call */
  useEffect(() => {
    setIsLoading(true);
    removeListeners(); /* remove any old listeners if active */
    let UID = userId;
    let limit = 30;
    let messagesRequest = new CometChat.MessagesRequestBuilder()
      .setUID(UID)
      .setLimit(limit)
      .build();

    messagesRequest.fetchPrevious().then(
      messages => {
        setMessages(messages);
        attachListeners(); /* activate new message listener for the opened chat */
        setIsLoading(false);
      },
      error => {
        console.log('Message fetching failed with error:', error);
        setIsLoading(false);
      },
    );
  }, [userId]);

  // useEffect(() => {
  //   if (flatlistRef.current.renderItem) flatlistRef.current.scrollToEnd();
  // }, [flatlistRef]);

  return (
    <SafeAreaView edges={['right', 'left', 'top']} style={{flex: 1}}>
      <ChatHeader username={username} onBackPress={() => onBackPressed()} />
      {isLoading && (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>loading....</Text>
        </View>
      )}
      {!isLoading && (
        <>
          <View style={{flex: 1}}>
            <FlashList
              ref={flatlistRef}
              data={messages}
              bounces={false}
              initialScrollIndex={messages.length - 1}
              renderItem={({item}: any) => renderMessageCard(item)}
              estimatedItemSize={10}
              ListFooterComponent={() => (
                <View style={{height: Platform.OS === 'ios' ? 100 : 65}} />
              )}
              onContentSizeChange={() => flatlistRef.current.scrollToEnd()}
              ListEmptyComponent={() => (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text>No messages</Text>
                </View>
              )}
              ItemSeparatorComponent={() => <View style={{height: 10}} />}
            />
          </View>
          <View
            style={{
              height: 'auto',
              position: 'absolute',
              bottom: 0,
              width: '100%',
            }}>
            <ChatInput
              value={inputValue}
              setValue={setInputValue}
              onSendPressed={() => sendTextMessage()}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default ChatScreen;
