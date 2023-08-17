/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Image, Pressable, SafeAreaView, StyleSheet, Text} from 'react-native';

const ChatHeader = (props: any) => {
  const {username, onBackPress} = props;
  return (
    <SafeAreaView style={styles.chatHeaderMainView}>
      <Pressable style={{padding: 10}} onPress={() => onBackPress()}>
        <Image
          style={styles.backButtonImage}
          source={{uri: 'https://cdn-icons-png.flaticon.com/512/93/93634.png'}}
        />
      </Pressable>
      <Text style={{fontSize: 25}}>{username}</Text>
    </SafeAreaView>
  );
};

export default ChatHeader;

const styles = StyleSheet.create({
  chatHeaderMainView: {flexDirection: 'row', alignItems: 'center'},
  backButtonImage: {width: 25, height: 25},
});
