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

          if (!userType) {
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
    const { navigation } = this.props;

    const localnotificationId = notification.notificationId;
    Notifications.dismissNotificationAsync(localnotificationId);

    if (notification !== undefined && notification.data !== undefined) {
      // TODO Notice 확인 시, Notice 알람 제거
      if (notification.data.notice === 'NOTI_ARRIVE_ACCTOKEN_DISCARDDATE') {
        this.noticeCommonNavigation(notification, '통장 재인증하기', () => navigation.navigate('OpenBankAuth', { type: 'REAUTH' }));
      } else if (notification.data.notice === 'NOTI_WORK_REGISTER') {
        this.noticeCommonNavigation(notification, '일감 지원하기', () => navigation.navigate('FirmWorkList'));
      } else if (notification.data.notice === 'NOTI_WORK_ADD_REGISTER') {
        this.noticeCommonNavigation(notification, '지원자 확인하기', () => navigation.navigate('WorkList'));
      } else if (notification.data.notice === 'NOTI_WORK_SELECTED') {
        this.noticeCommonNavigation(notification, '배차 수락하러가기', () => navigation.navigate('FirmWorkList'));
      } else if (notification.data.notice === 'NOTI_WORK_ABANDON') {
        this.noticeCommonNavigation(notification, '배차 다시 요청하기', () => navigation.navigate('WorkList'));
      } else if (notification.data.notice === 'NOTI_WORK_CLOSED') {
        this.noticeCommonNavigation(notification, '업체 평가하기', () => navigation.navigate('WorkList'));
      } else {
        this.noticeCommonNavigation(notification, '확인', () => {});
      }
    }
  };

  noticeCommonNavigation = (notification, actionName, action) => {
    const { user } = this.props;

    Alert.alert(
      notification.data.title,
      notification.data.body,
      [
        {
          text: '취소',
          onPress: () => {},
          style: 'cancel',
        },
        { text: actionName, onPress: () => action() },
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
