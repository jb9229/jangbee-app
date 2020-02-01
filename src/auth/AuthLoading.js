import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';

import React from 'react';
import colors from 'constants/Colors';
import firebase from 'firebase';
import { getUserInfo } from 'utils/FirebaseUtils';
import { withLogin } from 'src/contexts/LoginProvider';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

class AuthLoading extends React.Component
{
  componentDidMount ()
  {
    this.checkLogin();
  }

  checkLogin = () =>
  {
    const {
      setUser,
      setUserType,
      setOBInfo,
      completeAuth,
      changeAuthPath
    } = this.props;

    firebase.auth().onAuthStateChanged(user =>
    {
      if (user)
      {
        getUserInfo(user.uid).then(data =>
        {
          const userInfo = data.val();

          if (!userInfo)
          {
            changeAuthPath(2, user);
          }

          const {
            userType,
            obAccessToken,
            obRefreshToken,
            obAccTokenExpDate,
            obAccTokenDiscDate,
            obUserSeqNo
          } = userInfo;

          if (!userType)
          {
            changeAuthPath(2, user);
          }
          else
          {
            setUser(user);
            setUserType(userType);
            setOBInfo(
              obAccessToken,
              obRefreshToken,
              obAccTokenExpDate,
              obAccTokenDiscDate,
              obUserSeqNo
            );

            // Go to Screeen By User Type
            if (userType === 1)
            {
              completeAuth(true);
            }
            else if (userType === 2)
            {
              completeAuth(false);
            }
            else
            {
              Alert.alert(`[${userType}] 유효하지 않은 사용자 입니다`);
              completeAuth(true);
            }
          }
        });
      }
      else
      {
        changeAuthPath(3);
      }
    });
  };

  render ()
  {
    return (
      <View style={styles.container}>
        <Text>Login Checking...</Text>
        <ActivityIndicator size="large" color={colors.indicator} />
      </View>
    );
  }
}

export default AuthLoading;
