// @flow
import React from 'react';
import {
  Alert, Modal, StyleSheet, Text, View,
} from 'react-native';
import firebase from 'firebase';
import colors from '../constants/Colors';
import JBButton from './molecules/JBButton';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalWrap: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
  itemWrap: {
    justifyContent: 'space-between',
  },
  commWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

type Props = {
  isVisibleModal: boolean,
  setVisibleModal: func,
};
type State = {};

export default class FirmProfileModal extends React.PureComponent<Props, State> {
  updateFirm = () => {
    const { navigation, setVisibleModal } = this.props;

    navigation.navigate('FirmUpdate');
    setVisibleModal(false);
  };

  onSignOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (e) {
      Alert.alert('로그아웃에 문제가 있습니다, 재시도해 주세요.');
    }
  };

  render() {
    const { isVisibleModal, setVisibleModal } = this.props;
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent
          visible={isVisibleModal}
          onRequestClose={() => {
            console.log('Modal has been closed.');
          }}
        >
          <View style={styles.modalWrap}>
            <View style={styles.itemWrap}>
              <JBButton title="업체정보 수정" onPress={() => this.updateFirm()} />
              <JBButton title="로그아웃" onPress={() => this.onSignOut()} />
            </View>
            <View style={styles.commWrap}>
              <JBButton title="닫기" onPress={() => setVisibleModal(false)} />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
