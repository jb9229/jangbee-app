import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import firebase, { User } from 'firebase';

import React from 'react';
import { UserProfile } from 'src/types';
import colors from 'constants/Colors';
import { getUserInfo } from 'utils/FirebaseUtils';
import { noticeUserError } from 'src/container/request';
import { useLoginContext } from 'src/contexts/LoginContext';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

interface Props {
  changeAuthPath: (path: number, data?: any) => void;
  completeAuth: (isClient: boolean) => void;
  setUser: (u: User) => void;
  setUserProfile: (p: UserProfile) => void;
}

const AuthLoading: React.FC<Props> = (props) =>
{
  const { refetchFirm, user } = useLoginContext();
  
  React.useEffect(() =>
  {
    checkLogin(props);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Login Checking...</Text>
      <ActivityIndicator size="large" color={colors.indicator} />
    </View>
  );
};

const checkLogin = (props: Props): void =>
{
  firebase.auth().onAuthStateChanged(user =>
  {
    if (user)
    {
      console.log('>>> checklogin uid: ', user.uid);
      getUserInfo(user.uid)
        .then(data =>
        {
          const userInfo = data.val();
          if (!userInfo)
          {
            props.changeAuthPath(2, user);
            return;
          }

          const { userType } = userInfo;

          if (!userType)
          {
            props.changeAuthPath(2, user);
          }
          else
          {
            props.setUser(user);
            props.setUserProfile(userInfo);

            // Go to Screeen By User Type
            if (userType === 1)
            {
              props.completeAuth(true);
            }
            else if (userType === 2)
            {
              props.completeAuth(false);
            }
            else
            {
              Alert.alert(`[${userType}] 유효하지 않은 사용자 입니다`);
              props.completeAuth(true);
            }
          }
        })
        .catch((error) => { noticeUserError('AuthLoadingError(firbase getUserInfo)', error.message) });
    }
    else
    {
      props.changeAuthPath(3);
    }
  });
};



export default AuthLoading;
