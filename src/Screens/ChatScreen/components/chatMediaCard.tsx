import React from 'react';
import {View, StyleSheet, Image} from 'react-native';

const ChatMediaCard = (props: any) => {
  const {message} = props;
  return (
    <View style={styles.cardView}>
      <Image
        resizeMode="stretch"
        source={{uri: message}}
        style={{width: 200, height: 200, borderRadius: 5}}
      />
    </View>
  );
};

export default ChatMediaCard;

const styles = StyleSheet.create({
  cardView: {
    maxWidth: 200,
    backgroundColor: '#d3d3d3',
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 5,
  },
});