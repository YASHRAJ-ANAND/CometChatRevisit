/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Image, Pressable, SafeAreaView, TextInput} from 'react-native';

const ChatInput = (props: any) => {
  const {value, setValue, onSendPressed} = props;
  return (
    <SafeAreaView
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
      }}>
      <TextInput
        numberOfLines={1}
        style={{
          fontSize: 15,
          padding: 15,
          width: '85%',
          borderWidth: 2,
          borderColor: 'black',
          borderRadius: 10,
          marginLeft: 10,
          marginTop: 5,
          marginBottom: 5,
          height: 50,
        }}
        placeholder="enter your message....."
        value={value}
        onChangeText={value => setValue(value)}
      />
      <Pressable style={{padding: 10}} onPress={() => onSendPressed()}>
        <Image
          style={{width: 25, height: 25}}
          source={{uri: 'https://static.thenounproject.com/png/373675-200.png'}}
        />
      </Pressable>
    </SafeAreaView>
  );
};

export default ChatInput;
