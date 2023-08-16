import {BackHandler} from 'react-native';
const onBackPress = (callback: {
  (): boolean | null | undefined;
  (): boolean | null | undefined;
}) => {
  BackHandler.addEventListener('hardwareBackPress', callback);
  return () => {
    BackHandler.removeEventListener('hardwareBackPress', callback);
  };
};

export {onBackPress};
