/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {Button, SafeAreaView, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import * as actions from '../../store/action';
import {useNavigation} from '@react-navigation/native';
import {CometChat} from '@cometchat-pro/react-native-chat';
import {FlashList} from '@shopify/flash-list';
import UserCard from './userCard';

const Home = () => {
  const dispatch: any = useDispatch();
  const navigation = useNavigation<any>();
  const data: any = useSelector<any>(state => state.reducer);
  const [users, setUsers] = useState<any>([]);

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

    usersRequest.fetchNext().then(
      (userList: CometChat.User[]) => {
        setUsers(userList);
        console.log(userList);
      },
      (error: CometChat.CometChatException) => {
        return error;
      },
    );
  }, [data]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          marginTop: 5,
        }}>
        <Text style={{fontSize: 15}}>
          Hi{' '}
          <Text style={{color: 'red', fontSize: 24}}>{data?.user?.name}</Text>
        </Text>
        <Button title="Log Out" onPress={() => LogoutUser()} />
      </View>
      <View style={{padding: 10}}>
        <Text style={{fontSize: 25}}>All Users</Text>
      </View>
      <View style={{flex: 1, padding: 10}}>
        <FlashList
          data={users}
          renderItem={({item}: any) => (
            <UserCard
              name={item.name}
              avatar={item.avatar}
              onPressed={() =>
                navigation.navigate('ChatScreen', {
                  userId: item.uid,
                  username: item.name,
                  loggedInUserId: data.user.uid,
                })
              }
            />
          )}
          estimatedItemSize={10}
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;
