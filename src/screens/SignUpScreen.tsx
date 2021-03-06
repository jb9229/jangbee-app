import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import firebase, { User } from 'firebase';

import { AuthStackParamList } from 'src/navigation/types';
import JBErrorMessage from 'organisms/JBErrorMessage';
import { RouteProp } from '@react-navigation/core';
import SolidButton from 'atoms/button/SolidButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { UserType } from 'src/types';
import colors from 'constants/Colors';
import fonts from 'constants/Fonts';
import styled from 'styled-components/native';
import { useLoginContext } from 'src/contexts/LoginContext';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  thanksWrap: {
    alignItems: 'center',
    marginBottom: 20,
  },
  titleWrap: {
    alignItems: 'center',
    marginBottom: 20,
  },
  thanksRegiText: {
    fontSize: 15,
    fontFamily: fonts.batang,
    paddingBottom: 5,
  },
  titleText: {
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: fonts.titleTop,
  },
  accoutTypeWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
  },
  accountTypeTO: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 40,
    paddingBottom: 40,
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    elevation: 10,
    alignItems: 'center',
  },
  accountTypeText: {
    fontSize: 20,
    fontFamily: fonts.batang,
  },
  accountTypeSubText: {
    fontSize: 15,
    fontFamily: fonts.batang,
  },
  selectedAccType: {
    backgroundColor: colors.point,
  },
  commWrap: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 20,
  },
  commTH: {
    backgroundColor: colors.pointDark,
    paddingLeft: 22,
    paddingRight: 22,
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 10,
  },
  commText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: fonts.button,
    color: 'white',
  },
});

const UserTypeImage = styled.Image`
  height: 90px;
  width: 110px;
  margin: 5px;
`;

const NoticeWrap = styled.View`
  align-items: center;
`;

const Notice = styled.Text`
  font-family: ${fonts.titleTop};
  font-size: 11;
`;

const USER_CLIENT = 1;
const USER_FIRM = 2;

interface Props {
  navigation: StackNavigationProp<AuthStackParamList, 'Signup'>;
  route: RouteProp<AuthStackParamList, 'Signup'>;
}

const SignUpScreen: React.FC<Props> = ({ navigation, route }) => {
  const { fbUser } = route.params;
  const { setUserProfile } = useLoginContext();
  const [userType, setUserType] = useState<UserType | undefined>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [regiText, setRegiText] = useState<string>(
    '화주인지 차주인지 먼저 선택하세요'
  );

  /**
   * Firebase user DB에 사용자 추가정보 저장
   */
  const onSignUp = () => {
    if (userType === undefined) {
      setErrorMessage('사용자님의 업무를 선택해 주세요');
      return;
    }

    if (!fbUser?.uid) {
      setErrorMessage(`Invalid uid: ${fbUser?.uid}`);
      return;
    }

    firebase
      .database()
      .ref(`users/${fbUser?.uid}`)
      .update(
        {
          userType,
        },
        error => {
          if (error) {
            Alert.alert(
              '저장 실패',
              '사용자타입 FB DB에 저장에 문제가 있습니다, 다시 시도해 주세요.'
            );
          }
        }
      )
      .then(() => {
        if (userType !== 1 && userType !== 2) {
          Alert.alert(`[${userType}] 유효하지 않은 사용자 입니다`);
        }

        userType &&
          setUserProfile({
            ...fbUser,
            userType: userType,
            sid: undefined,
            phoneNumber: fbUser.phoneNumber || 'unknown',
          });
      });
  };

  const onChangeUserType = (userType: UserType) => {
    setUserType(userType);
    if (userType === 1) {
      setRegiText('가입 완료하기');
    } else if (userType === 2) {
      setRegiText('장비등록 하러가기');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.thanksWrap}>
        <Text style={styles.thanksRegiText}>장비 콜 가입을 축하 합니다,</Text>
        <Text style={styles.thanksRegiText}>...</Text>
        <Text style={styles.thanksRegiText}>
          건설장비 사용에도 서비스개선 및 향상이 필요합니다.
        </Text>
        <Text style={styles.thanksRegiText}>
          일잘하는 장비 쉽게찾기, 피해사례 공유부터 시작합니다.
        </Text>
        <Text style={styles.thanksRegiText}>
          무료가입☆무료장비등록☆무료콜받기
        </Text>
      </View>
      <View style={styles.titleWrap}>
        <Text style={styles.titleText}>어떤 서비스로 가입하시겠습니까?</Text>
      </View>
      <View style={styles.accoutTypeWrap}>
        <TouchableOpacity
          style={[
            styles.accountTypeTO,
            userType === USER_CLIENT ? styles.selectedAccType : null,
          ]}
          onPress={() => onChangeUserType(USER_CLIENT)}
        >
          <Text style={[styles.accountTypeText]}>화주</Text>
          <UserTypeImage source={require('../../assets/images/manager.png')} />
          <Text style={[styles.accountTypeSubText]}>(장비사용 고객님)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.accountTypeTO,
            userType === USER_FIRM ? styles.selectedAccType : null,
          ]}
          onPress={() => onChangeUserType(USER_FIRM)}
        >
          <Text style={[styles.accountTypeText]}>차주</Text>
          <UserTypeImage source={require('../../assets/images/operator.jpg')} />
          <Text style={[styles.accountTypeSubText]}>(장비 사장님)</Text>
        </TouchableOpacity>
      </View>
      <NoticeWrap>
        <Notice>※ 실수로 잘못 등록시, 탈퇴후 다시 로그인하세요.</Notice>
      </NoticeWrap>
      <JBErrorMessage errorMSG={errorMessage} />
      <SolidButton
        text={regiText}
        onPress={() => onSignUp()}
        rootStyle={{ marginLeft: 20, marginRight: 20 }}
      />
    </View>
  );
};

export default SignUpScreen;
