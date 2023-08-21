/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const ChatHeader = (props: any) => {
  const {username, onBackPress, onHeaderPress, members} = props;
  return (
    <SafeAreaView>
      <Pressable
        onPress={() => onHeaderPress()}
        style={styles.chatHeaderMainView}>
        <Pressable style={{padding: 10}} onPress={() => onBackPress()}>
          <Image
            style={styles.backButtonImage}
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/93/93634.png',
            }}
          />
        </Pressable>
        <View>
          <Text style={{fontSize: 25}}>{username}</Text>
          {members !== undefined && <Text>{members} members</Text>}
        </View>
      </Pressable>
    </SafeAreaView>
  );
};

export default ChatHeader;

const styles = StyleSheet.create({
  chatHeaderMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButtonImage: {width: 25, height: 25},
});
