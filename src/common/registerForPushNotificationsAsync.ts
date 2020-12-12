import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

import Constants from 'expo-constants';
import firebase from 'firebase';

export default async function registerForPushNotificationsAsync(uid): Promise<void>
{
  if (Constants.isDevice)
  {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted')
    {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted')
    {
      alert('알림 권한 획득 실패, 장비 콜 알림을 받을 수 없습니다(카톡상담 문의 필요)');
      return;
    }
    // console.log('>>> Constants.manifest: ', Constants.manifest)
    // console.log('>>> Updates.manifest: ', Updates.manifest)
    // Get the token that uniquely identifies this device
    const token = (await Notifications.getExpoPushTokenAsync({ experienceId: '@jb9229/jangbeecall' })).data;
    console.log('=== notification token: ', token);
    // Save Expo Push Token at DB
    await firebase
      .database()
      .ref(`users/${uid}`)
      .update({
        expoPushToken: token
      });

    /**
     * ide Expo Team jwhscholten Sep '17
     * With a Expo, the Expo push token never changes for as long as an app is installed.
     * If the user uninstalls and reinstalls an app they will get a new Expo push token.
     * On Android, if they clear the app’s data they will get a new Expo push token.
     */
  }
  else
  {
    console.log('Must use physical device for Push Notifications');
  }
}
