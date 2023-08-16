import {CometChat} from '@cometchat-pro/react-native-chat';

export const getAllUsers = async () => {
  let limit: number = 30;
  let usersRequest: CometChat.UsersRequest = new CometChat.UsersRequestBuilder()
    .setLimit(limit)
    .build();

  usersRequest.fetchNext().then(
    (userList: CometChat.User[]) => {
      return userList;
    },
    (error: CometChat.CometChatException) => {
      return error;
    },
  );
};
