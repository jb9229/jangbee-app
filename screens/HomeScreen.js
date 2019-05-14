import React from 'react';
import { Alert } from 'react-native';
import { Notifications } from 'expo';
import moment from 'moment';
import { withLogin } from '../contexts/LoginProvider';
import GPSSearchScreen from './GPSSearchScreen';

class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    this.addNotificationListener();
    this.checkOBAccDiscDate();
  }

  // android permissions are given on install
  addNotificationListener = () => {
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  };

  _handleNotification = (notification) => {
    const { navigation } = this.props;

    const localnotificationId = notification.notificationId;
    Notifications.dismissNotificationAsync(localnotificationId);

    if (notification && notification.data) {
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
    } else {
      Alert.alert('유효하지 않음 알람입니다', `내용: ${notification}`);
    }
  };

  noticeCommonNavigation = (notification, actionName, action) => {
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

  checkOBAccDiscDate = () => {
    const { userProfile, navigation } = this.props;

    if (!userProfile || !userProfile.obAccTokenDiscDate) {
      return;
    }

    const afterTwentyDay = moment()
      .add(20, 'days')
      .format('YYYY-MM-DD');

    const compareResult = moment(afterTwentyDay).isAfter(userProfile.obAccTokenDiscDate);
    if (compareResult) {
      Alert.alert(
        '결재통장 재인증',
        '보완을위해 일년에 한번씩 등록하신 통장을 재인증 해야 합니다.',
        [
          {
            text: '취소',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: '재인증하러가기',
            onPress: () => navigation.navigate('OpenBankAuth', { type: 'REAUTH' }),
          },
        ],
        { cancelable: false },
      );
    }
  };

  render() {
    return <GPSSearchScreen {...this.props} />;
  }
}

export default withLogin(HomeScreen);
