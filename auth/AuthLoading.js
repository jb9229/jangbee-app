import React from 'react';
import {
  Alert, ActivityIndicator, StyleSheet, Text, View,
} from 'react-native';
import { Notifications } from 'expo';
import firebase from 'firebase';
import firebaseconfig from '../firebaseconfig';
import colors from '../constants/Colors';
import { getUserType } from '../utils/FirebaseUtils';
import { withLogin } from '../contexts/LoginProvider';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

class AuthLoading extends React.Component {
  componentDidMount() {
    this.initFirebase();
    this.checkLogin();
  }

  initFirebase = () => {
    firebase.initializeApp(firebaseconfig);

    firebase.auth().languageCode = 'ko';
  };

  checkLogin = () => {
    const { navigation, setUser, setUserType } = this.props;

    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        getUserType(user.uid).then((data) => {
          const userType = data.val();

          if (userType === undefined) {
            navigation.navigate('SignUp');
          } else {
            setUser(user);
            setUserType(userType);
            this._notificationSubscription = Notifications.addListener(this._handleNotification);
            if (userType === 1) {
              navigation.navigate('ClientMain');
            } else if (userType === 2) {
              navigation.navigate('FirmMain');
            } else {
              Alert.alert(`[${userType}] 유효하지 않은 사용자 입니다`);
            }
          }
        });
      } else {
        navigation.navigate('Login');
      }
    });
  };

  _handleNotification = (notification) => {
    const { navigation } = this.props;
    // Alert.alert('리시브 Notification', notification.origin);

    const localnotificationId = notification.notificationId;
    Notifications.dismissNotificationAsync(localnotificationId);

    if (navigation !== undefined && notification.data !== undefined) {
      // TODO Notice 확인 시, Notice 알람 제거
      if (notification.data.notice === 'NOTI_ARRIVE_ACCTOKEN_DISCARDDATE') {
        Alert.alert(
          '이체통장 재인증 요청',
          '보안을 위해 일년에 한번씩 이체통장에 대한 재인증이 필요합니다.',
          [
            {
              text: 'Cancel',
              onPress: () => navigation.navigate('FirmMain'),
              style: 'cancel',
            },
            { text: 'OK', onPress: () => navigation.navigate('AdCreate') },
          ],
        );
      }
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Login Checking...</Text>
        <ActivityIndicator size="large" color={colors.indicator} />
      </View>
    );
  }
}

export default withLogin(AuthLoading);
