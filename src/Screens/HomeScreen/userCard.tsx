/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, Image, TouchableOpacity} from 'react-native';

interface iUserCard {
  name: string;
  avatar: string;
  onPressed?: () => void;
}

const UserCard = (props: iUserCard) => {
  const {name, avatar, onPressed} = props;
  return (
    <TouchableOpacity
      onPress={onPressed}
      style={{
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 5,
        marginVertical: 5,
      }}>
      <Image
        style={{width: 50, height: 50}}
        source={{
          uri: avatar
            ? avatar
            : 'https://media.istockphoto.com/id/1393750072/vector/flat-white-icon-man-for-web-design-silhouette-flat-illustration-vector-illustration-stock.jpg?s=612x612&w=0&k=20&c=s9hO4SpyvrDIfELozPpiB_WtzQV9KhoMUP9R9gVohoU=',
        }}
      />
      <Text style={{fontSize: 25}}>{name}</Text>
    </TouchableOpacity>
  );
};

export default UserCard;
