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

export const CreateChatGroup = (
  membersList: string[],
  loggedInUserId: string,
  gName: string,
  navigation: any,
) => {
  let GUID = `chatlist_${new Date().getTime()}`;
  let groupName = gName || 'Hello Group!';
  let groupType = CometChat.GROUP_TYPE.PUBLIC;

  let group = new CometChat.Group(GUID, groupName, groupType);
  let members = membersList.map(ids => {
    return new CometChat.GroupMember(
      ids,
      CometChat.GROUP_MEMBER_SCOPE.PARTICIPANT,
    );
  });
  let banMembers = ['']; // required params

  CometChat.createGroupWithMembers(group, members, banMembers).then(
    (response: any) => {
      // console.log('Group created successfully', response);
      navigation.navigate('ChatScreen', {
        userId: response.group.name,
        username: response.group.name,
        type: CometChat.RECEIVER_TYPE.GROUP,
        conversationId: response.group.guid,
        loggedInUserId: loggedInUserId,
      });
    },
    error => {
      console.log('Some error occured while creating group', error);
    },
  );
};
