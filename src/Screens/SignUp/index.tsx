/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {Alert, Button, Text, TextInput, View} from 'react-native';
import * as actions from '../../store/action';
import {useDispatch, useSelector} from 'react-redux';
import {COMETCHAT_CONSTANTS} from '../../cometChat/CONST';
import {useNavigation} from '@react-navigation/native';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const dispatch: any = useDispatch();
  const navigation = useNavigation<any>();
  const data: any = useSelector<any>(state => state.reducer);

  useEffect(() => {
    if (data.isLoggedIn) {
      navigation.navigate('HomeNavigation');
    }
  }, [data]);

  const LoginUser = () => {
    // check if user uid is provided
    if (username.length > 0) {
      console.log(username);
      dispatch(actions.createNewUser(username, COMETCHAT_CONSTANTS.AUTH_KEY));
    } else {
      Alert.alert('please provide a username');
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <TextInput
        style={{
          width: 300,
          height: 50,
          padding: 10,
          borderWidth: 2,
          borderColor: 'red',
          borderRadius: 10,
          marginBottom: 10,
        }}
        value={username}
        onChangeText={value => setUsername(value)}
        placeholder="Enter a new username"
      />
      <Button title="Sign Up" color={'red'} onPress={() => LoginUser()} />
      <Text
        style={{
          marginBottom: 10,
        }}>
        Already a user?
      </Text>
      <Button title="Login Here" onPress={() => navigation.navigate('Login')} />
    </View>
  );
};

export default SignUp;
