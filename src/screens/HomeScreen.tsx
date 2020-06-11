import * as Permissions from 'expo-permissions';

import { Alert, DeviceEventEmitter, Platform } from 'react-native';

import Constants from 'expo-constants';
import { DefaultNavigationProps } from 'src/types';
import FirmCntChart from 'templates/FirmCntChart';
import GPSSearchScreen from 'screens/GPSSearchScreen';
import JBTerm from 'templates/JBTerm';
import JangbeeAdList from 'organisms/JangbeeAdList';
import { Notifications } from 'expo';
import React from 'react';
import adLocation from 'constants/AdLocation';
import colors from 'constants/Colors';
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
  const { refetchFirm } = useLoginContext();
  let _notificationSubscription;

  React.useEffect(() =>
  {
    (async () =>
    {
      addNotificationListener();
      runListener();
      checkBLListLoading();
      const firm = await refetchFirm();
      if (!firm) { setTimeout(() => { props.navigation.navigate('FirmRegister') }, 500) }
    })();

    return (): void => { _notificationSubscription.remove() };
  }, []);

  // android permissions are given on install
  const addNotificationListener = async (): Promise<void> =>
  {
    if (Constants.isDevice)
    {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted')
      {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted')
      {
        alert(`알림 설정이 거부되어 있습니다: finalStatus is ${finalStatus}`);
        return;
      }
      const token = await Notifications.getExpoPushTokenAsync();
      console.log('>>> noti token', token);
    }
    else
    {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android')
    {
      Notifications.createChannelAndroidAsync('jbcall-messages', {
        name: 'JBCall Messages',
        sound: true,
        priority: 'max',
        vibrate: [0, 250, 250, 250]
      });
    }

    _notificationSubscription = Notifications.addListener(_handleNotification);
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

export default HomeScreen;
