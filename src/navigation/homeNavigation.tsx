import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import Home from '../Screens/HomeScreen';
import ChatScreen from '../Screens/ChatScreen';

const HomeNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
