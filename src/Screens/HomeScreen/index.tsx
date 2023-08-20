/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  Button,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import * as actions from '../../store/action';
import {useNavigation} from '@react-navigation/native';
import {CometChat} from '@cometchat-pro/react-native-chat';
import {FlashList} from '@shopify/flash-list';
import UserCard from './userCard';
import CreateGroup from './Modals/createGroup';

const Home = () => {
  const dispatch: any = useDispatch();
  const navigation = useNavigation<any>();
  const [selectedCard, setSelectedCard] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const data: any = useSelector<any>(state => state.reducer);
  const [usersData, setUsersData] = useState<any>([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!data.isLoggedIn) {
      navigation.navigate('Login');
    }
  }, [data]);

  const LogoutUser = () => {
    dispatch(actions.logout());
  };

  useEffect(() => {
    // let tags = ['partner'];
    let limit: number = 30;
    let usersRequest: CometChat.UsersRequest =
      new CometChat.UsersRequestBuilder()
        .setLimit(limit)
        // .setTags(tags)
        .build();

    let conversationsRequest = new CometChat.ConversationsRequestBuilder()
      .setLimit(limit)
      .build();

    if (selectedCard === 1) {
      setDisabled(true);
      usersRequest.fetchNext().then(
        (userList: CometChat.User[]) => {
          setUsersData(userList);
          setDisabled(false);
        },
        (error: CometChat.CometChatException) => {
          return error;
        },
      );
    } else {
      setDisabled(true);
      conversationsRequest.fetchNext().then(
        conversationList => {
          // console.log(conversationList);
          setUsersData(conversationList);
          setDisabled(false);
          console.log(conversationList);
        },
        error => {
          console.log('Conversations list fetching failed with error:', error);
        },
      );
    }
  }, [data, selectedCard]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.homeMainView}>
        <Text style={{fontSize: 15}}>
          Hi{' '}
          <Text style={{color: 'red', fontSize: 24}}>{data?.user?.name}</Text>
        </Text>
        <Button title="Log Out" onPress={() => LogoutUser()} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 5,
          justifyContent: 'space-between',
          marginBottom: 10,
        }}>
        <Pressable
          disabled={disabled}
          onPress={() => setSelectedCard(0)}
          style={{
            padding: 10,
            alignItems: 'center',
            width: '50%',
            backgroundColor: selectedCard === 0 ? '#ADD8E6' : 'white',
          }}>
          <Text style={{fontSize: 20, color: 'black'}}>Conversations</Text>
        </Pressable>
        <Pressable
          disabled={disabled}
          onPress={() => setSelectedCard(1)}
          style={{
            padding: 10,
            alignItems: 'center',
            width: '50%',
            backgroundColor: selectedCard === 1 ? '#ADD8E6' : 'white',
          }}>
          <Text style={{fontSize: 20, color: 'black'}}>All Users</Text>
        </Pressable>
      </View>
      <View style={{paddingHorizontal: 10}}>
        <Text style={{fontSize: 25}}>
          {selectedCard
            ? disabled
              ? 'Loading all users...'
              : 'All Users'
            : disabled
            ? 'Loading all conversations...'
            : 'Conversations'}
        </Text>
      </View>
      <View style={{flex: 1, padding: 10}}>
        {!disabled && (
          <FlashList
            data={usersData}
            renderItem={({item}: any) => (
              <UserCard
                name={selectedCard ? item.name : item.conversationWith.name}
                avatar={
                  selectedCard ? item.avatar : item.conversationWith.avatar
                }
                unreadMessageCount={
                  item.unreadMessageCount ? item.unreadMessageCount : undefined
                }
                onPressed={() =>
                  navigation.navigate('ChatScreen', {
                    userId: selectedCard ? item.uid : item.conversationWith.uid,
                    username: selectedCard
                      ? item.name
                      : item.conversationWith.name,
                    type: selectedCard ? 'user' : item.conversationType,
                    conversationId: selectedCard
                      ? item.uid
                      : item.conversationType === 'user'
                      ? item.conversationWith.uid
                      : item.conversationWith.guid,
                    loggedInUserId: data.user.uid,
                  })
                }
              />
            )}
            estimatedItemSize={10}
          />
        )}
      </View>
      <Pressable
        onPress={() => setModalVisible(true)}
        style={{
          position: 'absolute',
          bottom: 30,
          right: 30,
          padding: 15,
          borderRadius: 10,
          borderWidth: 2,
          backgroundColor: 'white',
          borderColor: 'red',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 15, fontWeight: '800', color: '#FF5733'}}>
          NEW GROUP
        </Text>
      </Pressable>
      <CreateGroup
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        loggedInUserId={data.user ? data.user.uid : '0'}
      />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  homeMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 5,
  },
});
