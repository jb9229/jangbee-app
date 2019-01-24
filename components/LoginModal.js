import React from 'react';
import {
  Modal, Picker, StyleSheet, TouchableHighlight, Text, TextInput, View,
} from 'react-native';

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
    width: 250,
  },
  loginTI: {
    width: 250,
    fontSize: 20,
  },
  commText: {
    fontSize: 25,
    fontWeight: 'bold',
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
      isVisible, phoneNumber, password, onChangePN, onChangePW, accountType,
    } = this.props;

    return (
      <View style={styles.container}>
        <Modal amimationType="slide" visible={isVisible} onRequestClose={() => this.closeModal()}>
          <View style={styles.modalWrap}>
            <View style={styles.itemWrap}>
              <Text style={styles.title}>고객구분: </Text>
              <Picker selectedValue={accountType} style={styles.accTypePicker}>
                <Picker.Item label="장비 고객" value="장비 고객" style={styles.accTypePickerItem} />
                <Picker.Item label="장비 업체" value="장비 업체" />
              </Picker>
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
