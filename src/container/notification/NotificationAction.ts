import * as Notifications from 'expo-notifications';

import { Platform } from 'react-native';
import registerForPushNotificationsAsync from 'src/common/registerForPushNotificationsAsync';

// android permissions are given on install
export const addNotificationListener = (uid, _handleNotification): void => {
  // Temp code for 사용자 옛날 토큰 빨리 업그레이드 위해
  registerForPushNotificationsAsync(uid);

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('jbcall-messages', {
      name: 'JBCall Messages',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#F7AE43',
    });
  }

  Notifications.addNotificationReceivedListener(_handleNotification);

  Notifications.addNotificationResponseReceivedListener(response => {
    console.log('ResponseReceived: ', response);
    alert(`ResponseReceived: ${response}`);
  });

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

// const runListener = (): void =>
// {
//   DeviceEventEmitter.addListener('blackListAppLauchEvent', function (
//     e: Event
//   )
//   {
//     // handle event and you will get a value in event object, you can log it here
//     const paramObj = e;
//     props.navigation.navigate('ClientEvalu', { search: e.telNumber });
//   });
// };

// const checkBLListLoading = (): void =>
// {
//   if (props.screenProps && props.screenProps.blListNumber)
//   {
//     props.navigation.navigate('ClientEvalu', { search: props.screenProps.blListNumber });
//   }
// };
