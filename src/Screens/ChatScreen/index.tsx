/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {View, Text, Platform, LogBox, StyleSheet} from 'react-native';
import ChatHeader from './components/chatHeader';
import ChatInput from './components/ChatInput';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CometChat} from '@cometchat-pro/react-native-chat';
import {FlashList} from '@shopify/flash-list';
import ChatCard from './components/chatCard';
import {useNavigation} from '@react-navigation/native';
import {onBackPress} from '../../utils/backPressHandler';
import {useConversationList} from '../../cometChat/hooks/useConversationList';
import MediaModal from './components/mediaModal';
import DocumentPicker from 'react-native-document-picker';
import ChatMediaCard from './components/chatMediaCard';

const ChatScreen = ({route}: any) => {
  const {userId, username, loggedInUserId} = route.params;
  const navigation = useNavigation<any>();
  const flatlistRef = useRef<any>();
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const {attachChatListeners, removeChatListeners, newMessage} =
    useConversationList();
  let conversationListenerId = `chatlist_${new Date().getTime()}`;
  const [fileModalVisible, setFileModalVisible] = useState(false);

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
    setSending(true);
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
          setSending(false);
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

  /* send media message */
  const sendMediaMessage = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      const file = {
        name: res[0].name,
        type: res[0].type,
        uri: res[0].uri,
      };

      let receiverId = userId;
      let receiverType = 'user';
      const mediaMessage = new CometChat.MediaMessage(
        receiverId,
        file,
        CometChat.MESSAGE_TYPE.IMAGE,
        receiverType,
      );
      setSending(true);
      setFileModalVisible(false);
      mediaMessage.setReceiver(receiverId);
      mediaMessage.setType(CometChat.MESSAGE_TYPE.IMAGE);
      mediaMessage.setData({
        type: receiverType,
        category: CometChat.MESSAGE_TYPE.IMAGE,
        name: file.name,
        file: file,
        url: file.uri,
        sender: loggedInUserId,
      });

      CometChat.sendMessage(mediaMessage)
        .then(message => {
          console.log('Message sent successfully:', message);
          setMessages((oldArray: any) => [
            ...oldArray,
            message,
          ]); /* add new message to message list */
          setSending(false);
        })
        .catch(error => {
          console.log('Message sending failed with error: ', error);
        });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        setFileModalVisible(false);
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
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
    if (messageInfo.type === 'image') {
      console.log(messageInfo);
    }
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
        {messageInfo.type === 'image' && !messageInfo.deletedAt && (
          <ChatMediaCard message={messageInfo.data.url} />
        )}
        {messageInfo.type === 'text' && (
          <ChatCard message={messageInfo.data.text} />
        )}
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

  return (
    <SafeAreaView edges={['right', 'left', 'top']} style={{flex: 1}}>
      <ChatHeader username={username} onBackPress={() => onBackPressed()} />
      {isLoading && (
        <View style={styles.loadingView}>
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
              renderItem={({item}: any) => renderMessageCard(item)}
              estimatedItemSize={10}
              ListFooterComponent={() => (
                <View style={{height: Platform.OS === 'ios' ? 100 : 65}} />
              )}
              onContentSizeChange={() =>
                messages.length > 0
                  ? flatlistRef.current.scrollToEnd({animated: false})
                  : undefined
              }
              ListEmptyComponent={() => (
                <View style={styles.noMessageView}>
                  <Text>No messages</Text>
                </View>
              )}
              ItemSeparatorComponent={() => <View style={{height: 10}} />}
            />
          </View>
          <View style={styles.chatInputView}>
            {sending && (
              <Text style={{textAlign: 'center', backgroundColor: 'white'}}>
                sending....
              </Text>
            )}
            <ChatInput
              value={inputValue}
              setValue={setInputValue}
              onSendPressed={() => sendTextMessage()}
              onAttachmentPressed={() => setFileModalVisible(true)}
            />
          </View>
        </>
      )}
      <MediaModal
        modalVisible={fileModalVisible}
        setModalVisible={() => setFileModalVisible(false)}
        onImageUploadPress={() => sendMediaMessage()}
        onVideoUploadPress={() => {}}
      />
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  loadingView: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  noMessageView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatInputView: {
    height: 'auto',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});
