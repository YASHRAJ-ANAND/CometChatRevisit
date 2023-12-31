/* eslint-disable no-shadow */
import {Alert} from 'react-native';
import * as actionTypes from './actionTypes';

import {CometChat} from '@cometchat-pro/react-native-chat';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = user => {
  console.log(user);
  return {
    type: actionTypes.AUTH_SUCCESS,
    user: user,
    isLoggedIn: true,
  };
};

export const authFail = error => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  };
};

export const createNewUser = (name, authKey) => {
  return dispatch => {
    let user = new CometChat.User(name);
    // let tags = ['partner'];
    user.setName(name);
    // user.setTags(tags);
    CometChat.createUser(user, authKey).then(
      user => {
        dispatch(auth(user.uid, authKey));
      },
      error => {
        Alert.alert(error.message);
        dispatch(authFail(error));
      },
    );
  };
};

export const logoutSuccess = () => {
  return {
    type: actionTypes.AUTH_LOGOUT,
    authRedirectPath: '/login',
  };
};

export const logout = () => {
  return dispatch => {
    CometChat.logout().then(dispatch(logoutSuccess()));
  };
};

export const auth = (uid, authKey) => {
  // const uname = name || 'test';
  return dispatch => {
    dispatch(authStart());
    CometChat.login(uid, authKey)
      .then(user => {
        if (user) {
          dispatch(authSuccess(user));
        } else {
          dispatch(authFail(user));
        }
      })
      .catch(error => {
        if (error.code === 'ERR_UID_NOT_FOUND') {
          // dispatch(createNewUser(uid, uname, authKey));
          Alert.alert('user not found');
        } else {
          dispatch(authFail(error));
        }
      });
  };
};

export const authCheckState = () => {
  console.log('3234234');
  return dispatch => {
    CometChat.getLoggedinUser()
      .then(user => {
        if (user) {
          dispatch(authSuccess(user));
        } else {
          dispatch(authFail(user));
        }
      })
      .catch(error => {
        dispatch(authFail(error));
      });
  };
};

export const setAuthRedirectPath = path => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path,
  };
};
