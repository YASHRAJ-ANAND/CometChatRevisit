/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text} from 'react-native';

const ChatCard = (props: any) => {
  const {message} = props;
  return (
    <View
      style={{
        maxWidth: '60%',
        backgroundColor: '#d3d3d3',
        marginLeft: 10,
        marginRight: 10,
        padding: 15,
        borderRadius: 5,
      }}>
      <Text>{message}</Text>
    </View>
  );
};

export default ChatCard;
