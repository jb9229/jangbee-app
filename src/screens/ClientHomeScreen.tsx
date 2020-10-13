import * as Notifications from 'expo-notifications';
import * as React from 'react';

import { Alert, BackHandler, DeviceEventEmitter, Platform } from 'react-native';

import { AdLocation } from 'src/container/ad/types';
import { DefaultNavigationProps } from 'src/types';
import FirmCntChart from 'templates/FirmCntChart';
import GPSSearchScreen from 'screens/GPSSearchScreen';
import JBTerm from 'templates/JBTerm';
import JangbeeAdList from 'organisms/JangbeeAdList';
import adLocation from 'constants/AdLocation';
import colors from 'constants/Colors';
import { onPressBackbutton } from 'src/container/action';
import registerForPushNotificationsAsync from 'src/common/registerForPushNotificationsAsync';
import styled from 'styled-components/native';
import { useLoginContext } from 'src/contexts/LoginContext';

const Container = styled.ScrollView`
  background-color: ${colors.batangLight};
`;

interface Props {
  navigation: DefaultNavigationProps;
  screenProps: any;
}
const ClientHomeScreen: React.FC<Props> = (props) =>
{
  const { refetchFirm, user } = useLoginContext();
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

    const backHandler = BackHandler.addEventListener('hardwareBackPress', onPressBackbutton);

    return (): void =>
    {
      Notifications.removeAllNotificationListeners();
      backHandler.remove();
    };
  }, []);

  // android permissions are given on install
  const addNotificationListener = async (): Promise<void> =>
  {
    // Temp code for 사용자 옛날 토큰 빨리 업그레이드 위해
    registerForPushNotificationsAsync(user.uid);

    if (Platform.OS === 'android')
    {
      Notifications.setNotificationChannelAsync('jbcall-messages', {
        name: 'JBCall Messages',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#F7AE43'
      });
    }

    Notifications.addNotificationReceivedListener(_handleNotification);

    Notifications.getPresentedNotificationsAsync()
      .then((responseArr) =>
      {
        console.log('>>> PresentedNotifications: ', responseArr);
        responseArr.forEach((response) =>
        {
          if (response?.request?.identifier)
          {
            _handleNotification(response);
            Notifications.dismissNotificationAsync(response?.request?.identifier);
          }
        });
      });
  };

  const _handleNotification = (response): void =>
  {
    if (response?.request?.content)
    {
      const notification = response.request.content;
      // Notifications.setBadgeCountAsync(0);
      // TODO Notice 확인 시, Notice 알람 제거

      if (notification.data?.notice === 'NOTI_WORK_REGISTER')
      {
        noticeCommonNavigation(notification, '일감 지원하기', () =>
          props.navigation.navigate('FirmWorkList', { refresh: true })
        );
      }
      else if (notification.data?.notice === 'NOTI_WORK_ADD_REGISTER')
      {
        noticeCommonNavigation(notification, '지원자 확인하기', () =>
          props.navigation.navigate('WorkList', { refresh: true })
        );
      }
      else if (notification.data?.notice === 'NOTI_WORK_SELECTED')
      {
        noticeCommonNavigation(notification, '배차 수락하러가기', () =>
          props.navigation.navigate('FirmWorkList', { refresh: true })
        );
      }
      else if (notification.data?.notice === 'NOTI_WORK_ABANDON')
      {
        noticeCommonNavigation(notification, '배차 다시 요청하기', () =>
          props.navigation.navigate('WorkList', { refresh: true })
        );
      }
      else if (notification.data?.notice === 'NOTI_WORK_CLOSED')
      {
        noticeCommonNavigation(notification, '업체 평가하기', () =>
          props.navigation.navigate('WorkList', { refresh: true })
        );
      }
      else if (notification.data?.notice === 'NOTI_CEVALU_REGISTER')
      {
        noticeCommonNavigation(
          notification,
          '피해사례(악덕) 조회하기',
          () => props.navigation.navigate('ClientEvalu')
        );
      }
      else
      {
        noticeCommonNavigation(notification, '확인', () => {});
      }
    }
    else
    {
      console.log('=== notification:', response);
      Alert.alert(
        '유효하지 않은 알람입니다',
        `내용: ${response}`,
        [
          {
            text: '확인',
            onPress: (): void =>
            {
              // Notifications.dismissNotificationAsync(
              //   notification.notificationId
              // );
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
              // Notifications.dismissNotificationAsync(
              //   notification.notificationId
              // );
            },
            style: 'cancel'
          },
          {
            text: actionName,
            onPress: () =>
            {
              // Notifications.dismissNotificationAsync(
              //   notification.notificationId
              // );
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
      <JangbeeAdList adLocation={AdLocation.MAIN} navigation={props.navigation} />
      <GPSSearchScreen {...props} />
      <FirmCntChart />
      <JBTerm />
    </Container>
  );
};

export default ClientHomeScreen;
