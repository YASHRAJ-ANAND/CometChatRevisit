import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useContext} from 'react';
import Login from '../Screens/Login';
import SignUp from '../Screens/SignUp';
import HomeNavigator from './homeNavigation';
import {ReactReduxContext} from 'react-redux';

const RootNavigator = () => {
  const Stack = createNativeStackNavigator();
  const {store} = useContext(ReactReduxContext);

  return (
    <Stack.Navigator
      initialRouteName={
        store.getState().reducer.isLoggedIn ? 'HomeNavigation' : 'Login'
      }
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="HomeNavigation" component={HomeNavigator} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
