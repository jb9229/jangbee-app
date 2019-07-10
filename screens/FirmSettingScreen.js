import React from 'react';
import { Alert, Platform, ToastAndroid } from 'react-native';
import styled from 'styled-components/native';
import firebase from 'firebase';
import * as api from '../api/api';
import { notifyError } from '../common/ErrorNotice';
import { withLogin } from '../contexts/LoginProvider';
import KatalkAskWebview from '../components/KatalkAskWebview';
import OpenBankAccSelectModal from '../components/OpenBankAccSelectModal';
import DocumentsModal from '../components/DocumentsModal';
import JBIconButton from '../components/molecules/JBIconButton';
import colors from '../constants/Colors';
import { validatePresence } from '../utils/Validation';

const Container = styled.View`
  flex: 1;
  background-color: ${colors.batangLight};
`;
const Top = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const TopMenu = styled.View`
  flex-direction: row;
  justify-content: flex-end;
`;

const MenuWrap = styled.ScrollView.attrs(props => ({
  contentContainerStyle: {
  },
}))``;

const MenueRowWrap = styled.View`
  flex-direction: row;
  justify-content: space-around;
`;

class FirmSettingScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isVisibleKatalkAskModal: false,
      isOBSelVisibleModal: false,
      isVisibleDocModal: false,
    };
  }

  confirmDeleteUser = () => {
    Alert.alert(
      '탈퇴확인',
      '정말 탈퇴 하시겠습니까? \n탈퇴하시면 즉시 모든 사용하던 데이터가 삭제됩니다.\n\n등록하신 광고가 있다면 이달 잔여기간 만료 후 삭제됩니다.',
      [{ text: '탈퇴하기', onPress: () => this.deleteUser() }, { text: '취소', onPress: () => {} }],
    );
  };

  confirmLogout = () => {
    Alert.alert('로그아웃확인', '정말 로그아웃 하시겠습니까?', [
      { text: '로그아웃하기', onPress: () => this.onSignOut() },
      { text: '취소', onPress: () => {} },
    ]);
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
          [
            { text: '로그 아웃', onPress: () => this.onSignOut() },
            { text: '취소', onPress: () => {} },
          ],
        );
      });
  };

  /**
   * 로그아웃 함수
   */
  onSignOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (e) {
      Alert.alert('로그아웃에 문제가 있습니다, 재시도해 주세요.');
    }
  };

  requestCashback = (fintechUseNum, cashbackAmount) => {
    firebase
      .database()
      .ref('openbank/oob/access_token')
      .once('value', data => data)
      .then((data) => {
        const token = data.val();
        const depositData = this.validateDepositData(token, fintechUseNum, cashbackAmount);

        if (!depositData) {
          return;
        }

        api
          .requestCashback(depositData)
          .then((result) => {
            if (result) {
              Alert.alert('캐쉬백 처리 완료', '선택하신 통장으로 캐쉬백처리가 완료 되었습니다');
            } else {
              Alert.alert('캐쉬백 처리 실패!', '창을 새로열어, 가용 캐쉬백을 다시 확인해주세요');
            }
          })
          .catch((error) => {
            notifyError('캐쉬백 요청에 문제가 있습니다', error.message);
          });
      });
  };

  validateDepositData = (obAccessToken, fintechUseNum, cashbackAmount) => {
    const { user } = this.props;

    let v = validatePresence(user.uid);
    if (!v[0]) {
      Alert.alert('계정값이 유효하지 않습니다', `재 로그인 부탁 드립니다: ${v[1]}`);
      return false;
    }

    v = validatePresence(obAccessToken);
    if (!v[0]) {
      Alert.alert('계좌 접근정보가 유효하지 않습니다', `재 로그인 부탁 드립니다: ${v[1]}`);
      return false;
    }

    const depositData = {
      accountId: user.uid,
      authToken: obAccessToken,
      fintechUseNum,
      cashback: cashbackAmount,
    };

    return depositData;
  };

  render() {
    const { navigation, user } = this.props;
    const { isVisibleKatalkAskModal, isOBSelVisibleModal, isVisibleDocModal } = this.state;
    return (
      <Container>
        <Top>
          <TopMenu />
        </Top>
        <MenuWrap>
          <MenueRowWrap>
            <JBIconButton
              title="내장비 등록정보"
              img={require('../assets/images/icon/edit_equipinfo_icon.png')}
              onPress={() => navigation.navigate('FirmMyInfo')}
            />
            <JBIconButton
              title="자료실"
              img={require('../assets/images/icon/doc_equipment_icon.png')}
              onPress={() => this.setState({ isVisibleDocModal: true })}
            />
          </MenueRowWrap>
          <MenueRowWrap>
            <JBIconButton
              title="카톡상담하기"
              img={{
                uri:
                  'https://developers.kakao.com/assets/img/about/logos/plusfriend/consult_small_yellow_pc.png',
              }}
              onPress={() => this.setState({ isVisibleKatalkAskModal: true })}
              imgWith={100}
              imgHeight={10}
            />
            <JBIconButton
              title="알람 설정"
              img={require('../assets/images/icon/alarm_icon.png')}
              onPress={() => Alert.alert('준비중..', '해당서비스를 준비중 입니다(8월안 오픈목표)')}
            />
          </MenueRowWrap>
          <MenueRowWrap>
            <JBIconButton
              title="캐쉬백"
              img={require('../assets/images/icon/cashback_icon.png')}
              onPress={() => this.setState({ isOBSelVisibleModal: true })}
            />
            <JBIconButton
              title="로그아웃"
              img={require('../assets/images/icon/sign_out_icon.png')}
              onPress={() => {
                this.confirmLogout();
              }}
            />
          </MenueRowWrap>
          <MenueRowWrap>
            <JBIconButton
              title="탈퇴하기"
              img={require('../assets/images/icon/delete_user_icon.png')}
              onPress={() => {
                this.confirmDeleteUser();
              }}
            />
          </MenueRowWrap>
        </MenuWrap>
        <KatalkAskWebview
          isVisibleModal={isVisibleKatalkAskModal}
          closeModal={() => this.setState({ isVisibleKatalkAskModal: false })}
        />
        <OpenBankAccSelectModal
          accountId={user.uid}
          isVisibleModal={isOBSelVisibleModal}
          navigation={navigation}
          completeSelect={this.requestCashback}
          closeModal={() => this.setState({ isOBSelVisibleModal: false })}
          reauthAfterAction={() => this.setState({ isOBSelVisibleModal: true })}
          actionName="캐쉬백 요청하기"
          mode="CASHBACK_MODE"
        />
        <DocumentsModal
          isVisibleModal={isVisibleDocModal}
          closeModal={() => this.setState({ isVisibleDocModal: false })}
        />
      </Container>
    );
  }
}

export default withLogin(FirmSettingScreen);
