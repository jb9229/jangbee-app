import * as React from 'react';
import * as Updates from 'expo-updates';

import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { DefaultTheme, withTheme } from 'styled-components/native';

import { AuthStackParamList } from 'src/navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import firebase from 'firebase';
import { getUserInfo } from 'utils/FirebaseUtils';
import { noticeUserError } from 'src/container/request';
import { useLoginContext } from 'src/contexts/LoginContext';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export interface AuthPathProps {
  theme: DefaultTheme;
  navigation: StackNavigationProp<AuthStackParamList, 'AuthLoading'>;
}

const AuthLoading: React.FC<AuthPathProps> = ({ theme, navigation }) => {
  const { setUserProfile } = useLoginContext();

  // actions
  const checkLogin = (): void => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log('>>> checklogin uid: ', user.uid);
        getUserInfo(user.uid)
          .then(data => {
            const userInfo = data.val();
            if (!userInfo) {
              navigation.navigate('Signup', { fbUser: user });
              return;
            }

            const { userType, scanAppVersion } = userInfo;
            console.log('=== setUser: ', user);
            if (!userType) {
              navigation.navigate('Signup', { fbUser: user });
            } else {
              setUserProfile({
                ...userInfo,
                uid: user.uid,
                phoneNumber: user.phoneNumber,
              });

              // Go to Screeen By User Type
              if ((userType === 1 || userType === 2) && user.phoneNumber) {
                setUserProfile({
                  phoneNumber: user.phoneNumber,
                  uid: user.uid,
                  userType: userType,
                  scanAppVersion: scanAppVersion,
                });
              } else {
                alert(
                  `UT: [${userType}, PN: ${user.phoneNumber}] 유효하지 않은 사용자 입니다, 관리자에게 문의해 주세요`
                );

                Updates.reloadAsync();
              }
            }
          })
          .catch(error => {
            noticeUserError(
              'AuthLoadingError(firbase getUserInfo)',
              error.message
            );
          });
      } else {
        navigation.navigate('SignIn');
      }
    });
  };

  // component life cycle
  React.useEffect(() => {
    checkLogin();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Login Checking...</Text>
      <ActivityIndicator size="large" color={theme.ColorActivityIndicator} />
    </View>
  );
};

export default withTheme(AuthLoading);
