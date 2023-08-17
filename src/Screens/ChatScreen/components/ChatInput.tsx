/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
} from 'react-native';

const ChatInput = (props: any) => {
  const {value, setValue, onSendPressed, onAttachmentPressed} = props;
  return (
    <SafeAreaView style={styles.inputMainView}>
      <TextInput
        numberOfLines={1}
        style={styles.textInputStyle}
        placeholder="enter your message....."
        value={value}
        onChangeText={value => setValue(value)}
      />
      <Pressable
        style={styles.itemAttach}
        onPress={() => onAttachmentPressed()}>
        <Image
          style={styles.sendIcon}
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/8377/8377269.png',
          }}
        />
      </Pressable>
      <Pressable style={styles.sendPress} onPress={() => onSendPressed()}>
        <Image
          style={styles.sendIcon}
          source={{uri: 'https://static.thenounproject.com/png/373675-200.png'}}
        />
      </Pressable>
    </SafeAreaView>
  );
};

export default ChatInput;

const styles = StyleSheet.create({
  inputMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  textInputStyle: {
    fontSize: 15,
    padding: 15,
    width: '78%',
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    marginLeft: 10,
    marginTop: 5,
    marginBottom: 5,
    height: 50,
  },
  sendPress: {padding: 10},
  itemAttach: {paddingLeft: 10},
  sendIcon: {width: 25, height: 25},
});
