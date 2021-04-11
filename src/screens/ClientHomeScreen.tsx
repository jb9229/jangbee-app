import * as Notifications from 'expo-notifications';
import * as React from 'react';

import { Alert, BackHandler, DeviceEventEmitter, Platform } from 'react-native';

import { AdLocation } from 'src/container/ad/types';
import { ClientBottomTabParamList } from 'src/navigation/types';
import FirmCntChart from 'templates/FirmCntChart';
import GPSSearchScreen from 'screens/GPSSearchScreen';
import JBTerm from 'templates/JBTerm';
import JangbeeAdList from 'organisms/JangbeeAdList';
import { StackNavigationProp } from '@react-navigation/stack';
import { Subscription } from 'src/apollo/generated';
import colors from 'constants/Colors';
import registerForPushNotificationsAsync from 'src/common/registerForPushNotificationsAsync';
import styled from 'styled-components/native';
import { useLoginContext } from 'src/contexts/LoginContext';

const Container = styled.ScrollView`
  background-color: ${colors.batangLight};
`;

interface Props {
  navigation: StackNavigationProp<ClientBottomTabParamList, 'ClientHome'>;
  screenProps: any;
}
const ClientHomeScreen: React.FC<Props> = props => {
  let notificationListener: Subscription;
  const { userProfile } = useLoginContext();
  React.useEffect(() => {
    (async () => {
      addNotificationListener();
    })();

    return (): void => {
      notificationListener &&
        Notifications.removeNotificationSubscription(notificationListener);
    };
  }, []);

  // android permissions are given on install
  const addNotificationListener = async (): Promise<void> => {
    // Temp code for 사용자 옛날 토큰 빨리 업그레이드 위해
    registerForPushNotificationsAsync(userProfile?.uid);

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('jbcall-messages', {
        name: 'JBCall Messages',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#F7AE43',
      });
    }

    notificationListener = Notifications.addNotificationReceivedListener(
      _handleNotification
    );

    Notifications.getPresentedNotificationsAsync().then(responseArr => {
      console.log('>>> PresentedNotifications: ', responseArr);
      responseArr.forEach(response => {
        if (response?.request?.identifier) {
          _handleNotification(response);
          Notifications.dismissNotificationAsync(response?.request?.identifier);
        }
      });
    });
  };

  const _handleNotification = (response): void => {
    if (response?.request?.content) {
      const notification = response.request.content;
      // Notifications.setBadgeCountAsync(0);
      // TODO Notice 확인 시, Notice 알람 제거

      if (notification.data?.notice === 'NOTI_WORK_REGISTER') {
        noticeCommonNavigation(notification, '지원자 확인하기', () =>
          props.navigation.navigate('WorkList', { refresh: true })
        );
      } else if (notification.data?.notice === 'NOTI_WORK_ABANDON') {
        noticeCommonNavigation(notification, '배차 다시 요청하기', () =>
          props.navigation.navigate('WorkList', { refresh: true })
        );
      } else if (notification.data?.notice === 'NOTI_WORK_CLOSED') {
        noticeCommonNavigation(notification, '업체 평가하기', () =>
          props.navigation.navigate('WorkList', { refresh: true })
        );
      } else {
        noticeCommonNavigation(notification, '확인', () => {});
      }
    } else {
      console.log('=== notification:', response);
      Alert.alert(
        '유효하지 않은 알람입니다',
        `내용: ${response}`,
        [
          {
            text: '확인',
            onPress: (): void => {
              // Notifications.dismissNotificationAsync(
              //   notification.notificationId
              // );
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  const noticeCommonNavigation = (notification, actionName, action): void => {
    setTimeout(() => {
      Alert.alert(
        notification.data.title,
        notification.data.body,
        [
          {
            text: '취소',
            onPress: () => {
              // Notifications.dismissNotificationAsync(
              //   notification.notificationId
              // );
            },
            style: 'cancel',
          },
          {
            text: actionName,
            onPress: () => {
              // Notifications.dismissNotificationAsync(
              //   notification.notificationId
              // );
              action();
            },
          },
        ],
        { cancelable: false }
      );
    }, 1000);
  };

  return (
    <Container>
      <JangbeeAdList
        adLocation={AdLocation.MAIN}
        navigation={props.navigation}
      />
      <GPSSearchScreen {...props} />
      <FirmCntChart />
      <JBTerm />
    </Container>
  );
};

export default ClientHomeScreen;
