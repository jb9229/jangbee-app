import * as api from 'api/api';

import { Alert, DeviceEventEmitter, Platform } from 'react-native';
import { DefaultNavigationProps, UserProfile, UserType } from 'src/types';

import { Firm } from 'src/provider/LoginProvider';
import FirmCntChart from 'templates/FirmCntChart';
import GPSSearchScreen from 'screens/GPSSearchScreen';
import JBTerm from 'templates/JBTerm';
import JangbeeAdList from 'organisms/JangbeeAdList';
import { Notifications } from 'expo';
import React from 'react';
import { User } from 'firebase';
import adLocation from 'constants/AdLocation';
import colors from 'constants/Colors';
import { notifyError } from 'common/ErrorNotice';
import styled from 'styled-components/native';
import { useLoginContext } from 'src/contexts/LoginContext';

const Container = styled.ScrollView`
  background-color: ${colors.batangLight};
`;

interface Props {
  navigation: DefaultNavigationProps;
  screenProps: any;
}
const HomeScreen: React.FC<Props> = (props) =>
{
  const { user, userProfile, setFirm } = useLoginContext();
  let _notificationSubscription;

  React.useEffect(() =>
  {
    addNotificationListener();
    setUserFirmInfo(props.navigation, user, userProfile, setFirm);
    runListener();
    checkBLListLoading();

    return (): void => { _notificationSubscription.remove() };
  }, []);

  // android permissions are given on install
  const addNotificationListener = (): void =>
  {
    _notificationSubscription = Notifications.addListener(_handleNotification);

    if (Platform.OS === 'android')
    {
      Notifications.createChannelAndroidAsync('jbcall-messages', {
        name: 'JBCall Messages',
        sound: true
      });
    }
  };

  const _handleNotification = (notification): void =>
  {
    if (notification && notification.data)
    {
      Notifications.setBadgeNumberAsync(1);
      // TODO Notice 확인 시, Notice 알람 제거

      if (notification.data.notice === 'NOTI_WORK_REGISTER')
      {
        noticeCommonNavigation(notification, '일감 지원하기', () =>
          props.navigation.navigate('FirmWorkList', { refresh: true })
        );
      }
      else if (notification.data.notice === 'NOTI_WORK_ADD_REGISTER')
      {
        noticeCommonNavigation(notification, '지원자 확인하기', () =>
          props.navigation.navigate('WorkList', { refresh: true })
        );
      }
      else if (notification.data.notice === 'NOTI_WORK_SELECTED')
      {
        noticeCommonNavigation(notification, '배차 수락하러가기', () =>
          props.navigation.navigate('FirmWorkList', { refresh: true })
        );
      }
      else if (notification.data.notice === 'NOTI_WORK_ABANDON')
      {
        noticeCommonNavigation(notification, '배차 다시 요청하기', () =>
          props.navigation.navigate('WorkList', { refresh: true })
        );
      }
      else if (notification.data.notice === 'NOTI_WORK_CLOSED')
      {
        noticeCommonNavigation(notification, '업체 평가하기', () =>
          props.navigation.navigate('WorkList', { refresh: true })
        );
      }
      else if (notification.data.notice === 'NOTI_CEVALU_REGISTER')
      {
        noticeCommonNavigation(
          notification,
          '피해사례(악덕) 조회하기',
          () => props.props.navigation.navigate('ClientEvalu')
        );
      }
      else
      {
        noticeCommonNavigation(notification, '확인', () => {});
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
            onPress: (): void =>
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

  const noticeCommonNavigation = (notification, actionName, action): void =>
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

  const runListener = (): void =>
  {
    DeviceEventEmitter.addListener('blackListAppLauchEvent', function (
      e: Event
    )
    {
      // handle event and you will get a value in event object, you can log it here
      const paramObj = e;
      props.navigation.navigate('ClientEvalu', { search: e.telNumber });
    });
  };

  const checkBLListLoading = (): void =>
  {
    if (props.screenProps && props.screenProps.blListNumber)
    {
      props.navigation.navigate('ClientEvalu', { search: props.screenProps.blListNumber });
    }
  };

  return (
    <Container>
      <JangbeeAdList adLocation={adLocation.main} navigation={props.navigation} />
      <GPSSearchScreen {...props} />
      <FirmCntChart />
      <JBTerm />
    </Container>
  );
};

/**
 * 장비기사인경우 장비정보 설정함수
 */
const setUserFirmInfo = (navigation: DefaultNavigationProps, user: User, userProfile: UserProfile,
  setFirm: (firm: Firm) => void): void =>
{
  if (!user.uid || !userProfile || userProfile.userType !== UserType.FIRM)
  {
    return;
  }

  api
    .getFirm(user.uid)
    .then(firm =>
    {
      if (firm)
      {
        setFirm(firm);
      }
      else
      {
        Alert.alert(
          '장비등록 정보가 없습니다.',
          '장비등록을 먼저 해 주세요.',
          [{ text: '확인' }],
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
          { text: '취소' },
          { text: '업체정보 요청하기', onPress: (): void => setUserFirmInfo(navigation, user, userProfile, setFirm) }
        ]
      );
    });
};

export default HomeScreen;
