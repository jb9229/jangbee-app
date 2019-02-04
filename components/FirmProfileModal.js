// @flow
import React from 'react';
import {
  TouchableHighlight, Image, Modal, StyleSheet, Text, View,
} from 'react-native';
import { withLogin } from '../contexts/LoginProvider';
import JBIcon from './molecules/JBIcon';

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
  },
  commWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },
  itemWrap: {
    flex: 1,
  },
  itemTH: {
    borderWidth: 1,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
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
            <JBIcon name="ios-close" size={32} onPress={() => setVisibleModal(false)} />
            <View style={styles.titleWrap}>
              <View>
                <Text style={styles.fnameText}>{firm.fname}</Text>
                <Text style={styles.phoneNumberText}>{user.phoneNumber}</Text>
              </View>
              <Image style={styles.thumbnail} source={{ uri: firm.thumbnail }} />
            </View>
            <View style={styles.itemsWrap}>
              <View style={styles.itemWrap}>
                <TouchableHighlight onPress={() => this.updateFirm()} style={styles.itemTH}>
                  <Text style={styles.itemTitle}>업체정보 수정</Text>
                </TouchableHighlight>
              </View>
              <View style={styles.itemWrap}>
                <TouchableHighlight onPress={() => onSignOut()} style={styles.itemTH}>
                  <Text style={styles.itemTitle}>로그아웃</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

export default withLogin(FirmProfileModal);
