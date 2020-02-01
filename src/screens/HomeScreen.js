import * as api from 'api/api';

import { Alert, DeviceEventEmitter, Platform } from 'react-native';

import FirmCntChart from 'templates/FirmCntChart';
import GPSSearchScreen from 'screens/GPSSearchScreen';
import JBTerm from 'templates/JBTerm';
import JangbeeAdList from 'organisms/JangbeeAdList';
import { Notifications } from 'expo';
import OpenBankAuthWebView from 'templates/OpenBankAuthWebView';
import React from 'react';
import adLocation from 'constants/AdLocation';
import colors from 'constants/Colors';
import moment from 'moment';
import { notifyError } from 'common/ErrorNotice';
import styled from 'styled-components/native';
import { withLogin } from 'src/contexts/LoginProvider';

const Container = styled.ScrollView`
  background-color: ${colors.batangLight};
`;

class HomeScreen extends React.Component
{
  static navigationOptions = {
    header: null
  };

  constructor (props)
  {
    super(props);
    this.state = {
      isVisibleOBAuthModal: false
    };

    this._notificationSubscription = undefined;
  }

  componentDidMount ()
  {
    this.addNotificationListener();
    this.checkOBAccDiscDate();
    this.setUserFirmInfo();
    this.runListener();
    this.checkBLListLoading();
  }

  componentWillUnmount ()
  {
    this._notificationSubscription.remove();
  }

  // android permissions are given on install
  addNotificationListener = () =>
  {
    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );

    if (Platform.OS === 'android')
    {
      Notifications.createChannelAndroidAsync('jbcall-messages', {
        name: 'JBCall Messages',
        sound: true
      });
    }
  };

  _handleNotification = notification =>
  {
    const { navigation } = this.props;

    if (notification && notification.data)
    {
      Notifications.setBadgeNumberAsync(1);
      // TODO Notice 확인 시, Notice 알람 제거
      if (notification.data.notice === 'NOTI_ARRIVE_ACCTOKEN_DISCARDDATE')
      {
        this.noticeCommonNavigation(notification, '통장 재인증하기', () =>
          this.setState({ isVisibleOBAuthModal: true })
        );
      }
      else if (notification.data.notice === 'NOTI_WORK_REGISTER')
      {
        this.noticeCommonNavigation(notification, '일감 지원하기', () =>
          navigation.navigate('FirmWorkList', { refresh: true })
        );
      }
      else if (notification.data.notice === 'NOTI_WORK_ADD_REGISTER')
      {
        this.noticeCommonNavigation(notification, '지원자 확인하기', () =>
          navigation.navigate('WorkList', { refresh: true })
        );
      }
      else if (notification.data.notice === 'NOTI_WORK_SELECTED')
      {
        this.noticeCommonNavigation(notification, '배차 수락하러가기', () =>
          navigation.navigate('FirmWorkList', { refresh: true })
        );
      }
      else if (notification.data.notice === 'NOTI_WORK_ABANDON')
      {
        this.noticeCommonNavigation(notification, '배차 다시 요청하기', () =>
          navigation.navigate('WorkList', { refresh: true })
        );
      }
      else if (notification.data.notice === 'NOTI_WORK_CLOSED')
      {
        this.noticeCommonNavigation(notification, '업체 평가하기', () =>
          navigation.navigate('WorkList', { refresh: true })
        );
      }
      else if (notification.data.notice === 'NOTI_CEVALU_REGISTER')
      {
        this.noticeCommonNavigation(
          notification,
          '피해사례(악덕) 조회하기',
          () => navigation.navigate('ClientEvalu')
        );
      }
      else
      {
        this.noticeCommonNavigation(notification, '확인', () => {});
      }
    }
    else
    {
      Alert.alert(
        '유효하지 않은 알람입니다',
        `내용: ${notification}`,
        [
          {
            text: '확인',
            onPress: () =>
            {
              Notifications.dismissNotificationAsync(
                notification.notificationId
              );
            }
          }
        ],
        { cancelable: false }
      );
    }
  };

  noticeCommonNavigation = (notification, actionName, action) =>
  {
    setTimeout(() =>
    {
      Alert.alert(
        notification.data.title,
        notification.data.body,
        [
          {
            text: '취소',
            onPress: () =>
            {
              Notifications.dismissNotificationAsync(
                notification.notificationId
              );
            },
            style: 'cancel'
          },
          {
            text: actionName,
            onPress: () =>
            {
              Notifications.dismissNotificationAsync(
                notification.notificationId
              );
              action();
            }
          }
        ],
        { cancelable: false }
      );
    }, 1000);
  };

  checkOBAccDiscDate = () =>
  {
    const { userProfile, navigation } = this.props;

    if (!userProfile || !userProfile.obAccTokenDiscDate)
    {
      return;
    }

    const afterTwentyDay = moment()
      .add(20, 'days')
      .format('YYYY-MM-DD');

    const compareResult = moment(afterTwentyDay).isAfter(
      userProfile.obAccTokenDiscDate
    );
    if (compareResult)
    {
      Alert.alert(
        '결재통장 재인증',
        '보완을위해 일년에 한번씩 등록하신 통장을 재인증 해야 합니다.',
        [
          {
            text: '취소',
            onPress: () => {},
            style: 'cancel'
          },
          {
            text: '재인증하러가기',
            onPress: () =>
              navigation.navigate('OpenBankAuth', { type: 'REAUTH' })
          }
        ],
        { cancelable: false }
      );
    }
  };

  /**
   * 장비기사인경우 장비정보 설정함수
   */
  setUserFirmInfo = () =>
  {
    const { user, userProfile, setFirmInfo, navigation } = this.props;

    if (!user.uid || !userProfile || userProfile.type !== 2)
    {
      return;
    }

    api
      .getFirm(user.uid)
      .then(firm =>
      {
        if (firm)
        {
          setFirmInfo(firm.equiListStr, firm.modelYear);
        }
        else
        {
          Alert.alert(
            '장비등록 정보가 없습니다.',
            '장비등록을 먼저 해 주세요.',
            [{ text: '확인', onPress: () => {} }],
            { cancelable: false }
          );

          setTimeout(() =>
          {
            navigation.navigate('FirmRegister');
          }, 500);
        }
      })
      .catch(error =>
      {
        notifyError(
          '업체정보 확인중 문제발생',
          `업체정보를 불러오는 도중 문제가 발생했습니다, 다시 시도해 주세요 -> [${
            error.name
          }] ${error.message}`,
          [
            { text: '취소', onPress: () => {} },
            { text: '업체정보 요청하기', onPress: () => this.setUserFirmInfo() }
          ]
        );
      });
  };

  runListener = () =>
  {
    const { navigation } = this.props;

    DeviceEventEmitter.addListener('blackListAppLauchEvent', function (
      e: Event
    )
    {
      // handle event and you will get a value in event object, you can log it here
      const paramObj = e;
      navigation.navigate('ClientEvalu', { search: e.telNumber });
    });
  };

  checkBLListLoading = () =>
  {
    const { screenProps, navigation } = this.props;

    if (screenProps && screenProps.blListNumber)
    {
      navigation.navigate('ClientEvalu', { search: screenProps.blListNumber });
    }
  };

  render ()
  {
    const { navigation } = this.props;
    const { isVisibleOBAuthModal } = this.state;

    return (
      <Container>
        <JangbeeAdList adLocation={adLocation.main} navigation={navigation} />
        <GPSSearchScreen {...this.props} />
        <FirmCntChart />
        <JBTerm />
        <OpenBankAuthWebView
          isVisibleModal={isVisibleOBAuthModal}
          type="REAUTH"
          navigation={navigation}
          completeAction={() =>
          {
            this.setState({ isVisibleOBAuthModal: false });
          }}
          closeModal={() => this.setState({ isVisibleOBAuthModal: false })}
        />
      </Container>
    );
  }
}

export default HomeScreen;
