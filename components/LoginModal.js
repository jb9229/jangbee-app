import React from 'react';
import {
  Modal,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  Text,
  TextInput,
  View,
} from 'react-native';
import { white } from 'ansi-colors';
import fonts from '../constants/Fonts';
import colors from '../constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    borderWidth: 1,
  },
  modalWrap: {
    flex: 1,
    borderWidth: 1,
    justifyContent: 'center',
  },
  accoutTypeWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  accountTypeTO: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    elevation: 10,
  },
  accountTypeText: {
    fontSize: 20,
  },
  selectedAccType: {
    backgroundColor: colors.point,
  },
  itemWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  commWrap: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  title: {
    width: 300,
    fontFamily: fonts.titleMiddle,
    fontSize: 20,
  },
  loginTI: {
    width: 300,
    fontSize: 23,
    fontFamily: fonts.batang,
  },
  commText: {
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: fonts.titleTop,
  },
  accTypePicker: {
    width: 265,
    height: 20,
  },
  accTypePickerItem: {},
});
export default class LoginModal extends React.PureComponent {
  login = () => {
    const { setLoginModalVisible } = this.props;

    setLoginModalVisible(false);
  };

  register = () => {};

  render() {
    const {
      isVisible,
      phoneNumber,
      password,
      isFirm,
      onChangePN,
      onChangePW,
      onChangeAT,
    } = this.props;

    return (
      <View style={styles.container}>
        <Modal amimationType="slide" visible={isVisible} onRequestClose={() => this.closeModal()}>
          <View style={styles.modalWrap}>
            <View style={styles.accoutTypeWrap}>
              <TouchableOpacity
                style={[styles.accountTypeTO, isFirm ? null : styles.selectedAccType]}
                onPress={() => onChangeAT(false)}
              >
                <Text style={[styles.accountTypeText]}>장비고객</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.accountTypeTO, isFirm ? styles.selectedAccType : null]}
                onPress={() => onChangeAT(true)}
              >
                <Text style={[styles.accountTypeText]}>장비업체 </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.itemWrap}>
              <Text style={styles.title}>핸드폰번호: </Text>
              <TextInput
                style={styles.loginTI}
                value={phoneNumber}
                onChangeText={onChangePN}
                placeholder="핸드폰번호를 입력해 주세요"
              />
            </View>
            <View style={styles.itemWrap}>
              <Text style={styles.title}>비밀번호: </Text>
              <TextInput
                style={styles.loginTI}
                value={password}
                onChangeText={onChangePW}
                placeholder="비밀번호를 입력해 주세요"
              />
            </View>
            <View style={styles.commWrap}>
              <TouchableHighlight onPress={() => this.login()}>
                <Text style={styles.commText}>Login</Text>
              </TouchableHighlight>
              <TouchableHighlight onPress={() => this.register()}>
                <Text style={styles.commText}>Register</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
