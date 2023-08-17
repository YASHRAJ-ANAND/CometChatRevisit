/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Modal, Alert, Pressable, Image} from 'react-native';

interface iMediaModal {
  modalVisible: boolean;
  setModalVisible: () => void;
  onImageUploadPress: () => void;
  onVideoUploadPress: () => void;
}

const MediaModal = (props: iMediaModal) => {
  const {
    modalVisible,
    setModalVisible,
    onImageUploadPress,
    onVideoUploadPress,
  } = props;
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        setModalVisible();
      }}>
      <Pressable
        onPress={() => setModalVisible()}
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
          zIndex: -1,
        }}>
        <Pressable
          onPress={() => {}} // modal doesn't get closed when touched anywhere inside modal visible view
          style={{
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 20,
            marginBottom: '30%',
            flexDirection: 'row',
            alignItems: 'center',
            zIndex: 3,
          }}>
          <Pressable
            style={{marginHorizontal: 5}}
            onPress={() => onImageUploadPress()}>
            <Image
              style={{width: 30, height: 30}}
              source={{
                uri: 'https://upload.wikimedia.org/wikipedia/vi/9/90/Microsoft_Photos_Icon_on_Windows_10.png',
              }}
            />
          </Pressable>
          <Pressable
            style={{marginHorizontal: 5}}
            onPress={() => onVideoUploadPress()}>
            <Image
              style={{width: 30, height: 30}}
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/777/777242.png',
              }}
            />
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default MediaModal;
