import { Alert, Linking, Platform, ToastAndroid } from 'react-native';

import Card from 'molecules/CardUI';
import JBButton from 'molecules/JBButton';
import JBTextItem from 'molecules/JBTextItem';
import React from 'react';
import Styled from 'styled-components/native';
import firebase from 'firebase';
import { useLoginContext } from 'src/contexts/LoginContext';

const Container = Styled.View`
  flex: 1;
`;

const TopMenu = Styled.View`
  flex-direction: row;
  justify-content: flex-end;
`;

const ClientMyInfoScreen = () =>
{
  const { user } = useLoginContext();
  const confirmDeleteUser = () =>
  {
    Alert.alert(
      '탈퇴확인',
      '정말 탈퇴 하시겠습니까? 탈퇴하시면 즉시 모든 사용하던 데이터가 삭제됩니다.',
      [
        { text: '탈퇴하기', onPress: () => deleteUser(false) },
        { text: '취소', onPress: () => {} }
      ]
    );
  };

  /**
   * 로그아웃 함수
   */
  const onSignOut = async () =>
  {
    try
    {
      await firebase.auth().signOut();
    }
    catch (e)
    {
      Alert.alert('로그아웃에 문제가 있습니다, 재 시도해 주세요.');
    }
  };

  /**
   * 회원 탈퇴 요청
   */
  const deleteUser = reAuth =>
  {
    // Delete Firebase User
    const user = firebase.auth().currentUser;

    user
      .delete()
      .then(() =>
      {
        firebase
          .database()
          .ref(`users/${user.uid}`)
          .remove()
          .then(() =>
          {
            if (Platform.OS === 'android')
            {
              ToastAndroid.show(
                '회원 탈퇴 성공, 감사합니다.',
                ToastAndroid.SHORT
              );
            }
            else
            {
              Alert.alert('회원 탈퇴 성공, 감사합니다.');
            }
          })
          .catch(error =>
          {
            Alert.alert(
              '회원 탈퇴에 문제가 있습니다',
              `Firebase 데이터 삭제에 실패 했습니다, 관리자에게 문의해 주세요${
                error.message
              }`
            );
          });
      })
      .catch(error =>
      {
        Alert.alert(
          '인증서버에서 재인증을 요구하고 있습니다',
          `죄송합니다, 인증 유효시간이 오래된경우(자동 로그인) 재로그인 후 탈퇴를 진행부탁 드립니다(${
            error.message
          })`,
          [
            { text: '로그 아웃', onPress: () => onSignOut() },
            { text: '취소', onPress: () => {} }
          ]
        );
      });
  };

  return (
    <Container>
      <Card>
        <TopMenu>
          <JBButton
            title="탈퇴하기"
            onPress={() => confirmDeleteUser()}
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
        <JBTextItem
          title="전화번호"
          value={user.phoneNumber}
          align="center"
          row
        />
        <JBButton
          title="장비콜 메일 문의하기"
          onPress={() => Linking.openURL('mailto:support@jangbeecall.kr')}
          size="full"
          Secondary
        />
      </Card>
    </Container>
  );
};

export default ClientMyInfoScreen;
