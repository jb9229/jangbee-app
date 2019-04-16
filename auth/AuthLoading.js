import React from 'react';
import {
  Alert, ActivityIndicator, StyleSheet, Text, View,
} from 'react-native';
import { Notifications } from 'expo';
import firebase from 'firebase';
import moment from 'moment';
import colors from '../constants/Colors';
import { getUserInfo } from '../utils/FirebaseUtils';
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
    this.checkLogin();

    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  checkLogin = () => {
    const {
      navigation, setUser, setUserType, setOBInfo,
    } = this.props;

    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        getUserInfo(user.uid).then((data) => {
          const userInfo = data.val();

          if (userInfo === null) {
            navigation.navigate('SignUp', { user });
          }

          const {
            userType,
            obAccessToken,
            obRefreshToken,
            obAccTokenExpDate,
            obAccTokenDiscDate,
            obUserSeqNo,
          } = userInfo;

          if (userType === undefined) {
            navigation.navigate('SignUp', { user });
          } else {
            setUser(user);
            setUserType(userType);
            setOBInfo(
              obAccessToken,
              obRefreshToken,
              obAccTokenExpDate,
              obAccTokenDiscDate,
              obUserSeqNo,
            );

            this.checkOBAccDiscDate(obAccTokenDiscDate);

            // Go to Screeen By User Type
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

  checkOBAccDiscDate = (discardDate) => {
    if (discardDate === undefined) {
      return;
    }
    const beforeTwentyDay = moment()
      .add(-20, 'days')
      .format('YYYY-MM-DD');

    const compareResult = moment(beforeTwentyDay).isAfter(discardDate);
    if (compareResult) {
      this.comfirmReOpenBankAuth();
    }
  };

  _handleNotification = (notification) => {
    const localnotificationId = notification.notificationId;
    Notifications.dismissNotificationAsync(localnotificationId);

    if (notification !== undefined && notification.data !== undefined) {
      // TODO Notice 확인 시, Notice 알람 제거
      if (notification.data.notice === 'NOTI_ARRIVE_ACCTOKEN_DISCARDDATE') {
        this.comfirmReOpenBankAuth();
      } else if (notification.data.notice === 'NOTI_WORK_REGISTER') {
        this.comfirmViewRegisterWork(notification);
      }
    }
  };

  comfirmReOpenBankAuth = () => {
    const { navigation, user } = this.props;

    Alert.alert(
      '이체통장 재인증 요청',
      '보안을 위해 일년에 한번씩 이체통장에 대한 재인증이 필요합니다.',
      [
        {
          text: 'Cancel',
          onPress: () => navigation.navigate('FirmMain'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => navigation.navigate('OpenBankAuth', { type: 'REAUTH' }) },
      ],
      { cancelable: false },
    );
  };

  comfirmViewRegisterWork = (notification) => {
    const { navigation, user } = this.props;

    Alert.alert(
      notification.title,
      notification.body,
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        { text: 'OK', onPress: () => navigation.navigate('WorkList') },
      ],
      { cancelable: false },
    );
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
