import * as Notifications from 'expo-notifications';

import { Alert, BackHandler, ToastAndroid } from 'react-native';
import { useEffect, useRef, useState } from 'react';

import { UserType } from 'src/types';
import { addNotificationListener } from 'src/container/notification/NotificationAction';
import { useLoginContext } from 'src/contexts/LoginContext';
import { useNavigation } from '@react-navigation/native';

const useInitApp = () => {
  const navigation = useNavigation();
  const { userProfile } = useLoginContext();
  const notificationListener = useRef();
  const responseListener = useRef();
  const [hasInit, setHasInit] = useState(false);
  const [hasInitAuth, setHasInitAuth] = useState(false);
  const [backButtonCondition, setBackButtonCondition] = useState<{
    isDoubleClick: boolean;
  }>({ isDoubleClick: false });

  // actions
  const onPressBackbutton = (): boolean => {
    console.log('onPressBackbutton~~');
    if (navigation.canGoBack()) {
      navigation.goBack();
      return true;
    }

    if (backButtonCondition.isDoubleClick) {
      BackHandler.exitApp();
    } else {
      ToastAndroid.show(
        '한번 더 누르시면 앱이 종료됩니다!',
        ToastAndroid.SHORT
      );

      backButtonCondition.isDoubleClick = true;

      setTimeout(() => {
        backButtonCondition.isDoubleClick = false;
      }, 3000);

      return true;
    }

    return true;
  };

  const _handleFirmNotification = (response): void => {
    if (response?.request?.content) {
      const notification = response.request.content;
      console.log('=== notification: ', notification);
      // Notifications.setBadgeCountAsync(0);
      // TODO Notice 확인 시, Notice 알람 제거

      if (notification.data?.notice === 'NOTI_WORK_REGISTER') {
        noticeCommonNavigation(notification, '일감 지원하기', () =>
          navigation.navigate('FirmWorkList', { refresh: true })
        );
      } else if (notification.data?.notice === 'NOTI_WORK_ADD_REGISTER') {
        noticeCommonNavigation(notification, '지원자 확인하기', () =>
          navigation.navigate('WorkList', { refresh: true })
        );
      } else if (notification.data?.notice === 'NOTI_WORK_SELECTED') {
        noticeCommonNavigation(notification, '배차 수락하러가기', () =>
          navigation.navigate('FirmWorkList', { refresh: true })
        );
      } else if (notification.data?.notice === 'NOTI_WORK_ABANDON') {
        noticeCommonNavigation(notification, '배차 다시 요청하기', () =>
          navigation.navigate('WorkList', { refresh: true })
        );
      } else if (notification.data?.notice === 'NOTI_WORK_CLOSED') {
        noticeCommonNavigation(notification, '업체 평가하기', () =>
          navigation.navigate('WorkList', { refresh: true })
        );
      } else if (notification.data?.notice === 'NOTI_CEVALU_REGISTER') {
        noticeCommonNavigation(notification, '피해사례(악덕) 조회하기', () =>
          navigation.navigate('FirmHarmCaseSearch', {
            initSearch: notification.data?.initSearch,
          })
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

  const _handleClientNotification = (response): void => {
    if (response?.request?.content) {
      const notification = response.request.content;
      // Notifications.setBadgeCountAsync(0);
      // TODO Notice 확인 시, Notice 알람 제거

      if (notification.data?.notice === 'NOTI_WORK_REGISTER') {
        noticeCommonNavigation(notification, '지원자 확인하기', () =>
          navigation.navigate('WorkList', { refresh: true })
        );
      } else if (notification.data?.notice === 'NOTI_WORK_ABANDON') {
        noticeCommonNavigation(notification, '배차 다시 요청하기', () =>
          navigation.navigate('WorkList', { refresh: true })
        );
      } else if (notification.data?.notice === 'NOTI_WORK_CLOSED') {
        noticeCommonNavigation(notification, '업체 평가하기', () =>
          navigation.navigate('WorkList', { refresh: true })
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

  // useEffect
  useEffect(() => {
    console.log('navigation, useEffect');
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onPressBackbutton
    );

    return (): void => {
      return backHandler.remove();
    };
  }, [navigation.navigate]);

  useEffect(() => {
    addNotificationListener(
      userProfile?.uid,
      notificationListener,
      responseListener,
      userProfile?.userType === UserType.FIRM
        ? _handleFirmNotification
        : _handleClientNotification
    );

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, [userProfile]);

  // return state
  return { hasInit: hasInit && hasInitAuth };
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

export default useInitApp;
