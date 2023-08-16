import {useState} from 'react';
import {CometChat} from '@cometchat-pro/react-native-chat';

const useConversationList = () => {
  const [newMessage, setNewMessage] = useState(null);
  function attachChatListeners(conversationListenerId: string) {
    CometChat.addMessageListener(
      conversationListenerId,
      new CometChat.MessageListener({
        onTextMessageReceived: (textMessage: any) => {
          setNewMessage(textMessage);
        },
        onMediaMessageReceived: (mediaMessage: any) => {
          setNewMessage(mediaMessage);
        },
      }),
    );
  }
  function removeChatListeners(conversationListenerId: string) {
    CometChat.removeMessageListener(conversationListenerId);
  }
  return {
    attachChatListeners,
    removeChatListeners,
    newMessage,
  };
};
export {useConversationList};
