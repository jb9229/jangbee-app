import { BackHandler, ToastAndroid } from 'react-native';
import React, { useEffect, useState } from 'react';

import AuthLoading from 'auth/AuthLoading';
import { AuthStackParamList } from './types';
import ClientBottomTabNavigator from './ClientTabNavigator';
import FirmBottomTabNavigator from './FirmTabNavigator';
import LoginScreen from 'screens/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import SignUpScreen from 'screens/SignUpScreen';
import { UserType } from 'src/types';
import { alarmSettingModalStat } from 'src/container/firmHarmCase/store';
import { createStackNavigator } from '@react-navigation/stack';
import { updateFirmInfo } from 'src/container/login/action';
import { useLoginContext } from 'src/contexts/LoginContext';
import { useScanAppVersionQuery } from 'src/apollo/generated';
import { useSetRecoilState } from 'recoil';

const AuthStack = createStackNavigator<AuthStackParamList>();

interface Props {
  blListNumber: string;
}
const Navigator: React.FC<Props> = () => {
  // states
  const { userProfile, setFirm } = useLoginContext();
  const setAlarmSettingModal = useSetRecoilState(alarmSettingModalStat);
  const [backButtonCondition, setBackButtonCondition] = useState<{
    isDoubleClick: boolean;
  }>({ isDoubleClick: false });

  // server datas
  const scanAppVersionRsp = useScanAppVersionQuery();

  // actions
  const onPressBackbutton = (): boolean => {
    console.log('onPressBackbutton~~');
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

  // component life cycle
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onPressBackbutton
    );

    return (): void => {
      console.log('backHandler.remove~~');
      return backHandler.remove();
    };
  }, []);
  useEffect(() => {
    if (
      userProfile?.scanAppVersion &&
      userProfile?.scanAppVersion.length > 1 &&
      scanAppVersionRsp.data?.scanAppVersion?.version &&
      userProfile?.scanAppVersion !==
        scanAppVersionRsp.data.scanAppVersion.version
    ) {
      setAlarmSettingModal({
        visible: true,
        newVersion: scanAppVersionRsp.data.scanAppVersion.version,
      });
    }

    if (userProfile?.userType === UserType.FIRM) {
      updateFirmInfo(userProfile, setFirm);
    }
  }, [userProfile]);

  // return <AppContainer screenProps={{ blListNumber: props.blListNumber }} />;
  return (
    <NavigationContainer>
      {!userProfile ? (
        <AuthStack.Navigator
          screenOptions={{ headerShown: false }}
          mode="modal"
          initialRouteName={'AuthLoading'}
        >
          <AuthStack.Screen name="AuthLoading" component={AuthLoading} />
          <AuthStack.Screen name="SignIn" component={LoginScreen} />
          <AuthStack.Screen name="Signup" component={SignUpScreen} />
        </AuthStack.Navigator>
      ) : userProfile.userType === UserType.CLIENT ? (
        <ClientBottomTabNavigator />
      ) : (
        <FirmBottomTabNavigator />
      )}
    </NavigationContainer>
  );
};

export default Navigator;
