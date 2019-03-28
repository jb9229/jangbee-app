// @flow
import React from 'react';
import {
  Image, Linking, Modal, StyleSheet, Text, View,
} from 'react-native';
import { withLogin } from '../contexts/LoginProvider';
import JBIcon from './molecules/JBIcon';
import JBButton from './molecules/JBButton';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalWrap: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
    paddingTop: 10,
  },
  titleWrap: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemsWrap: {
    flex: 3,
    justifyContent: 'space-around',
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },
  fnameText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

type Props = {
  isVisibleModal: boolean,
  setVisibleModal: func,
};
type State = {};

class FirmProfileModal extends React.PureComponent<Props, State> {
  updateFirm = () => {
    const { navigation, setVisibleModal } = this.props;

    navigation.navigate('FirmUpdate');
    setVisibleModal(false);
  };

  render() {
    const {
      isVisibleModal, setVisibleModal, firm, user, onSignOut,
    } = this.props;
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
            <JBIcon name="close" size={32} onPress={() => setVisibleModal(false)} />
            <View style={styles.titleWrap}>
              <View>
                <Text style={styles.fnameText}>{firm.fname}</Text>
                <Text style={styles.phoneNumberText}>{user.phoneNumber}</Text>
              </View>
              <Image style={styles.thumbnail} source={{ uri: firm.thumbnail }} />
            </View>
            <View style={styles.itemsWrap}>
              <JBButton title="업체정보 수정" onPress={() => this.updateFirm()} size="full" />
              <JBButton
                title="메일로 의견보내기"
                onPress={() => Linking.openURL('mailto:jb9229@gmail.com')}
                size="full"
              />
              <JBButton title="로그아웃" onPress={() => onSignOut()} size="full" />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

export default withLogin(FirmProfileModal);
