// @flow
import React from 'react';
import {
  Alert,
  Image,
  Linking,
  Modal,
  Platform,
  StyleSheet,
  ToastAndroid,
  Text,
  View,
} from 'react-native';
import Styled from 'styled-components';
import firebase from 'firebase';
import { withLogin } from '../contexts/LoginProvider';
import * as api from '../api/api';
import JBIcon from './molecules/JBIcon';
import JBButton from './molecules/JBButton';
import JBTerm from './JBTerm';

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
    flex: 4,
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

const Top = Styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const TopMenu = Styled.View`
  flex-direction: row;
  justify-content: flex-end;
`;

type Props = {
  isVisibleModal: boolean,
  setVisibleModal: func,
};
type State = {};

class FirmProfileModal extends React.PureComponent<Props, State> {
  confirmDeleteUser = () => {
    Alert.alert(
      '탈퇴확인',
      '정말 탈퇴 하시겠습니까? \n탈퇴하시면 즉시 모든 사용하던 데이터가 삭제됩니다.\n\n등록하신 광고가 있다면 이달 잔여기간 만료 후 삭제됩니다.',
      [{ text: '탈퇴하기', onPress: () => this.deleteUser() }, { text: '취소', onPress: () => {} }],
    );
  };

  /**
   * 회원 탈퇴 요청
   */
  deleteJBData = () => {
    const { user } = this.props;

    api
      .deleteFirmAccount(user.uid)
      .then((result) => {
        if (!result) {
          Alert.alert(
            '회원 탈퇴에 문제가 있습니다',
            '서버 데이터 삭제에 실패 했습니다, 죄송합니다, 관리자에게 문의 부탁 드립니다(응답값: false)',
          );
        }
      })
      .catch((error) => {
        Alert.alert(
          '회원 탈퇴에 문제가 있습니다',
          `서버 데이터 삭제에 실패 했습니다, 죄송합니다, 관리자에게 문의 부탁 드립니다(응답: ${
            error.message
          })`,
        );
      });
  };

  /**
   * 회원 탈퇴 요청
   */
  deleteUser = () => {
    const { onSignOut } = this.props;
    // Delete Firebase User
    const user = firebase.auth().currentUser;

    user
      .delete()
      .then(() => {
        firebase
          .database()
          .ref(`users/${user.uid}`)
          .remove()
          .then(() => {
            this.deleteJBData();

            if (Platform.OS === 'android') {
              ToastAndroid.show('회원 탈퇴 성공, 감사합니다.', ToastAndroid.SHORT);
            } else {
              Alert.alert('회원 탈퇴 성공, 감사합니다.');
            }
          })
          .catch((error) => {
            Alert.alert(
              '회원 탈퇴에 문제가 있습니다',
              `Firebase 데이터 삭제에 실패 했습니다, 관리자에게 문의해 주세요${error.message}`,
            );
          });
      })
      .catch((error) => {
        Alert.alert(
          '인증서버에서 재인증을 요구하고 있습니다',
          `죄송합니다, 인증 유효시간이 오래된경우(자동 로그인) 재로그인 후 탈퇴를 진행부탁 드립니다(${
            error.message
          })`,
          [{ text: '로그 아웃', onPress: () => onSignOut() }, { text: '취소', onPress: () => {} }],
        );
      });
  };

  updateFirm = () => {
    const { navigation, setVisibleModal } = this.props;

    navigation.navigate('FirmUpdate');
    setVisibleModal(false);
  };

  render() {
    const {
      isVisibleModal, setVisibleModal, navigation, firm, user, onSignOut,
    } = this.props;
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent
          visible={isVisibleModal}
          onRequestClose={() => setVisibleModal(false)}
        >
          <View style={styles.modalWrap}>
            <Top>
              <JBIcon name="close" size={32} onPress={() => setVisibleModal(false)} />
              <TopMenu>
                <JBButton
                  title="탈퇴하기"
                  onPress={() => this.confirmDeleteUser()}
                  size="small"
                  underline
                  align="right"
                  Secondary
                />
                <JBButton
                  title="로그아웃"
                  onPress={() => onSignOut()}
                  size="small"
                  underline
                  align="right"
                  Secondary
                />
              </TopMenu>
            </Top>
            <View style={styles.titleWrap}>
              <View>
                <Text style={styles.fnameText}>{firm.fname}</Text>
                <Text style={styles.phoneNumberText}>{user.phoneNumber}</Text>
              </View>
              <Image style={styles.thumbnail} source={{ uri: firm.thumbnail }} />
            </View>
            <View style={styles.itemsWrap}>
              <JBButton
                title="내 장비 정보수정"
                onPress={() => this.updateFirm()}
                size="full"
                Primary
              />
              <JBButton
                title="장비콜 메일 문의하기"
                onPress={() => Linking.openURL('mailto:support@jangbeecall.com')}
                size="full"
                Primary
              />
            </View>
            <JBTerm />
          </View>
        </Modal>
      </View>
    );
  }
}

export default withLogin(FirmProfileModal);
