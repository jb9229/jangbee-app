import * as React from 'react';

import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { DefaultTheme, withTheme } from 'styled-components/native';

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
  changeAuthPath: (path: number, data?: any) => void;
  completeAuth: (isClient: boolean) => void;
}

const AuthLoading: React.FC<AuthPathProps> = ({
  theme,
  changeAuthPath,
  completeAuth,
}) => {
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
              changeAuthPath(2, user);
              return;
            }

            const { userType } = userInfo;
            console.log('=== setUser: ', user);
            if (!userType) {
              changeAuthPath(2, user);
            } else {
              setUserProfile({
                ...userInfo,
                uid: user.uid,
                phoneNumber: user.phoneNumber,
              });

              // Go to Screeen By User Type
              if (userType === 1) {
                completeAuth(true);
              } else if (userType === 2) {
                completeAuth(false);
              } else {
                Alert.alert(`[${userType}] 유효하지 않은 사용자 입니다`);
                completeAuth(true);
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
        changeAuthPath(3);
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
