import * as api from 'src/api/api';

import { Alert, Platform, ToastAndroid } from 'react-native';

import { DELETE_FIRM } from 'src/api/mutations';
import { DefaultNavigationProps } from 'src/types';
import DocumentsModal from 'templates/DocumentsModal';
import JBIconButton from 'molecules/JBIconButton';
import JBTerm from 'src/components/templates/JBTerm';
import KatalkAskWebview from 'templates/KatalkAskWebview';
import { Linking } from 'expo';
import React from 'react';
import { alarmSettingModalStat } from 'src/container/firmHarmCase/store';
import colors from 'constants/Colors';
import firebase from 'firebase';
import { noticeUserError } from 'src/container/request';
import { notifyError } from 'common/ErrorNotice';
import styled from 'styled-components/native';
import { useLoginContext } from 'src/contexts/LoginContext';
import { useMutation } from '@apollo/client';
import { useSetRecoilState } from 'recoil';
import { validatePresence } from 'utils/Validation';

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
  contentContainerStyle: {},
}))``;

const MenueRowWrap = styled.View`
  flex-direction: row;
  justify-content: space-around;
`;

interface Props {
  navigation: DefaultNavigationProps;
}

const FirmSettingScreen: React.FC<Props> = props => {
  // states
  const { userProfile, setUserProfile } = useLoginContext();
  const setAlarmSettingModalStat = useSetRecoilState(alarmSettingModalStat);
  const [isVisibleKatalkAskModal, setVisibleKatalkAskModal] = React.useState(
    false
  );
  const [isVisibleDocModal, setVisibleDocModal] = React.useState(false);
  const [deletFirmRequest] = useMutation(DELETE_FIRM, {
    onCompleted: data => {
      if (data && data.deleteFirm) {
        if (Platform.OS === 'android') {
          ToastAndroid.show(
            '회원 탈퇴 성공, 감사했습니다~~',
            ToastAndroid.SHORT
          );
        } else {
          Alert.alert('회원 탈퇴 성공, 감사했습니다~~');
        }
      } else {
        noticeUserError(
          'FirmModifyProvider(requestModifyFirm -> error)',
          data?.updateFirm,
          userProfile
        );
      }
    },
    onError: err => {
      noticeUserError(
        'FirmModifyProvider(requestModifyFirm -> error)',
        err?.message,
        userProfile
      );
    },
  });

  const confirmDeleteUser = (): void => {
    Alert.alert(
      '탈퇴확인',
      '정말 탈퇴 하시겠습니까? \n탈퇴하시면 즉시 모든 사용하던 데이터가 삭제됩니다.\n\n등록하신 광고가 있다면 이달 잔여기간 만료 후 삭제됩니다.',
      [
        { text: '탈퇴하기', onPress: (): void => deleteUser() },
        { text: '취소' },
      ]
    );
  };

  const confirmLogout = () => {
    Alert.alert('로그아웃확인', '정말 로그아웃 하시겠습니까?', [
      { text: '로그아웃하기', onPress: () => onSignOut() },
      { text: '취소', onPress: () => {} },
    ]);
  };

  /**
   * 회원 탈퇴 요청
   */
  const deleteUser = (): void => {
    // Delete Firebase User
    const user = firebase.auth().currentUser;

    if (!user) {
      alert('error: fail get firebase current user!');
      return;
    }

    user
      .delete()
      .then(() => {
        firebase
          .database()
          .ref(`users/${user?.uid}`)
          .remove()
          .then(() => {
            deletFirmRequest({ variables: { accountId: user?.uid } });
          })
          .catch(error => {
            Alert.alert(
              '회원 탈퇴에 문제가 있습니다',
              `Firebase 데이터 삭제에 실패 했습니다, 관리자에게 문의해 주세요${error.message}`
            );
          });
      })
      .catch(error => {
        Alert.alert(
          '인증서버에서 재인증을 요구하고 있습니다',
          `죄송합니다, 인증 유효시간이 오래된경우(자동 로그인) 재로그인 후 탈퇴를 진행부탁 드립니다(${error.message})`,
          [{ text: '로그 아웃', onPress: () => onSignOut() }, { text: '취소' }]
        );
      });
  };

  /**
   * 로그아웃 함수
   */
  const onSignOut = async () => {
    try {
      console.log('>>> logout~~');
      await firebase
        .auth()
        .signOut()
        .then(() => setUserProfile(undefined));
    } catch (e) {
      Alert.alert('로그아웃에 문제가 있습니다, 재시도해 주세요.');
    }
  };

  const requestCashback = (fintechUseNum, cashbackAmount) => {
    firebase
      .database()
      .ref('openbank/oob/access_token')
      .once('value', data => data)
      .then(data => {
        const token = data.val();
        const depositData = validateDepositData(
          token,
          fintechUseNum,
          cashbackAmount
        );

        if (!depositData) {
          return;
        }

        api
          .requestCashback(depositData)
          .then(result => {
            if (result) {
              Alert.alert(
                '캐쉬백 처리 완료',
                '선택하신 통장으로 캐쉬백처리가 완료 되었습니다'
              );
            } else {
              Alert.alert(
                '캐쉬백 처리 실패!',
                '창을 새로열어, 가용 캐쉬백을 다시 확인해주세요'
              );
            }
          })
          .catch(error => {
            notifyError('캐쉬백 요청에 문제가 있습니다', error.message);
          });
      });
  };

  const validateDepositData = (
    obAccessToken,
    fintechUseNum,
    cashbackAmount
  ) => {
    let v = validatePresence(userProfile.uid);
    if (!v[0]) {
      Alert.alert(
        '계정값이 유효하지 않습니다',
        `재 로그인 부탁 드립니다: ${v[1]}`
      );
      return false;
    }

    v = validatePresence(obAccessToken);
    if (!v[0]) {
      Alert.alert(
        '계좌 접근정보가 유효하지 않습니다',
        `재 로그인 부탁 드립니다: ${v[1]}`
      );
      return false;
    }

    const depositData = {
      accountId: userProfile?.uid,
      authToken: obAccessToken,
      fintechUseNum,
      cashback: cashbackAmount,
    };

    return depositData;
  };

  // component life cycle

  return (
    <Container>
      <Top>
        <TopMenu />
      </Top>
      <MenuWrap>
        <MenueRowWrap>
          <JBIconButton
            title="내장비 등록정보"
            img={require('../../assets/images/icon/edit_equipinfo_icon.png')}
            onPress={(): void => {
              props.navigation.navigate('FirmMyInfo');
            }}
          />
          <JBIconButton
            title="자료실"
            img={require('../../assets/images/icon/doc_equipment_icon.png')}
            onPress={(): void => {
              setVisibleDocModal(true);
            }}
          />
        </MenueRowWrap>
        <MenueRowWrap>
          <JBIconButton
            title="카톡상담하기"
            img={{
              uri:
                'https://developers.kakao.com/assets/img/about/logos/plusfriend/consult_small_yellow_pc.png',
            }}
            onPress={(): void => {
              setVisibleKatalkAskModal(true);
            }}
          />
          <JBIconButton
            title="알람 설정"
            img={require('../../assets/images/icon/alarm_icon.png')}
            onPress={(): void => {
              setAlarmSettingModalStat({ visible: true });
            }}
          />
        </MenueRowWrap>
        <MenueRowWrap>
          <JBIconButton
            title="캐쉬백"
            img={require('../../assets/images/icon/cashback_icon.png')}
            onPress={(): void => {
              props.navigation.navigate('Cashback');
            }}
          />
          <JBIconButton
            title="콜이력"
            img={require('../../assets/images/icon/call-log.jpg')}
            onPress={(): void => {
              props.navigation.navigate('CallLog');
            }}
          />
        </MenueRowWrap>
        <MenueRowWrap>
          <JBIconButton
            title="장비콜 화주 앱"
            img={require('../../assets/images/jangbeecallClientApp.jpeg')}
            onPress={(): void => {
              props.navigation.navigate('ClientHomeModal');
            }}
          />
          <JBIconButton
            title="장비콜 웹"
            img={require('../../assets/images/jangbeecallWeb.png')}
            onPress={(): void => {
              Linking.openURL('https://jangbeecall.kr');
            }}
          />
        </MenueRowWrap>
        <MenueRowWrap>
          <JBIconButton
            title="로그아웃"
            img={require('../../assets/images/icon/sign_out_icon.png')}
            onPress={(): void => {
              confirmLogout();
            }}
          />
          <JBIconButton
            title="탈퇴하기"
            img={require('../../assets/images/icon/delete_user_icon.png')}
            onPress={(): void => {
              confirmDeleteUser();
            }}
          />
        </MenueRowWrap>
        <JBTerm />
      </MenuWrap>
      <KatalkAskWebview
        isVisibleModal={isVisibleKatalkAskModal}
        closeModal={(): void => {
          setVisibleKatalkAskModal(false);
        }}
      />
      <DocumentsModal
        isVisibleModal={isVisibleDocModal}
        closeModal={(): void => {
          setVisibleDocModal(false);
        }}
      />
    </Container>
  );
};

export default FirmSettingScreen;
