import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const ChatCard = (props: any) => {
  const {message} = props;
  return (
    <View style={styles.cardView}>
      <Text>{message}</Text>
    </View>
  );
};

export default ChatCard;

const styles = StyleSheet.create({
  cardView: {
    maxWidth: '60%',
    backgroundColor: '#d3d3d3',
    marginLeft: 10,
    marginRight: 10,
    padding: 15,
    borderRadius: 5,
  },
});
