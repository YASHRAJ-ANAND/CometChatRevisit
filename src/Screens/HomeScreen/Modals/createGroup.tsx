import React, {useEffect, useState} from 'react';
import {CometChat} from '@cometchat-pro/react-native-chat';
import {FlashList} from '@shopify/flash-list';
import {
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import UserCard from '../userCard';
import {CreateChatGroup} from '../../../cometChat/commonFunctions';
import {useNavigation} from '@react-navigation/native';

const CreateGroup = (props: any) => {
  const navigation = useNavigation();
  const {modalVisible, setModalVisible, loggedInUserId} = props;
  const [groupName, setGroupName] = useState('');
  const [allUsers, setAllUsers] = useState<any>([]);
  const [selectedUsersId, setSelectedUserId] = useState<string[]>([]);

  let limit: number = 30;
  let usersRequest: CometChat.UsersRequest = new CometChat.UsersRequestBuilder()
    .setLimit(limit)
    .build();

  useEffect(() => {
    if (modalVisible) {
      usersRequest.fetchNext().then(
        (userList: CometChat.User[]) => {
          setAllUsers(userList);
        },
        (error: CometChat.CometChatException) => {
          return error;
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalVisible]);

  const modifySelection = (id: any) => {
    const isAdded =
      selectedUsersId.filter((item: string) => item.includes(id)).length === 0;
    if (isAdded) {
      setSelectedUserId((oldVal: any) => [...oldVal, id]);
      console.log('added');
    }
  };

  const closeModal = () => {
    setSelectedUserId([]);
    setModalVisible(!modalVisible);
  };

  const createGroup = () => {
    if (selectedUsersId.length > 0 && groupName !== '') {
      console.log(loggedInUserId);
      setGroupName('');
      CreateChatGroup(selectedUsersId, loggedInUserId, groupName, navigation);
      closeModal();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        closeModal();
      }}>
      <SafeAreaView
        style={{
          flex: 1,
          marginTop: 50,
          backgroundColor: 'white',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: 5,
          }}>
          <Text style={{fontSize: 20}}>Group Name</Text>
          <Pressable style={{marginRight: 10}} onPress={() => closeModal()}>
            <Text>close</Text>
          </Pressable>
        </View>
        <TextInput
          style={{
            height: 50,
            margin: 10,
            borderRadius: 10,
            paddingHorizontal: 10,
            fontSize: 25,
            backgroundColor: '#D8D8D8',
            color: 'black',
          }}
          value={groupName}
          onChangeText={value => setGroupName(value)}
          placeholder="Enter Group Name...."
        />
        <Text style={{fontSize: 20, margin: 5}}>Users List</Text>
        <View style={{flex: 1, paddingHorizontal: 20}}>
          <FlashList
            showsVerticalScrollIndicator={false}
            data={allUsers}
            extraData={selectedUsersId.length}
            renderItem={({item}: any) => (
              <UserCard
                name={item.name}
                avatar={item.avatar}
                selected={
                  selectedUsersId.filter((i: string) => i === item.uid)
                    .length !== 0
                }
                onPressed={() => modifySelection(item.uid)}
              />
            )}
            estimatedItemSize={10}
          />
        </View>
        <TouchableOpacity onPress={() => createGroup()}>
          <View
            style={{
              height: 60,
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: 'red',
              borderWidth: 2,
              margin: 10,
              borderRadius: 10,
            }}>
            <Text style={{fontSize: 20}}>Create Group</Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
};

export default CreateGroup;
