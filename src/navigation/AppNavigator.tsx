import React, { useEffect } from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import AuthLoading from 'auth/AuthLoading';
import FirmTabNavigator from './FirmTabNavigator';
import LoginScreen from 'screens/LoginScreen';
import MainTabNavigator from './MainTabNavigator';
import SignUpScreen from 'screens/SignUpScreen';
import { alarmSettingModalStat } from 'src/container/firmHarmCase/store';
import { useLoginContext } from 'src/contexts/LoginContext';
import { useScanAppVersionQuery } from 'src/apollo/generated';
import { useSetRecoilState } from 'recoil';

let AppContainer;

const AUTHPATH_COMPLETE = -1;
const AUTHPATH_AUTHING = 1;
const AUTHPATH_SIGNUP = 2;
const AUTHPATH_LOGIN = 3;

interface Props {
  blListNumber: string;
}
const RootNavigator: React.FC<Props> = props => {
  // states
  const { userProfile } = useLoginContext();
  const [authPath, setAuthPath] = React.useState(AUTHPATH_AUTHING);
  const [authData, setAuthData] = React.useState();
  const setAlarmSettingModal = useSetRecoilState(alarmSettingModalStat);

  // server datas
  const scanAppVersionRsp = useScanAppVersionQuery();

  // component life cycle
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
  }, [userProfile]);

  if (authPath === AUTHPATH_AUTHING) {
    return (
      <AuthLoading
        completeAuth={(isClient: boolean): void =>
          completeAuth(isClient, setAuthPath)
        }
        changeAuthPath={(path, data): void => {
          setAuthPath(path);
          setAuthData(data);
        }}
      />
    );
  }

  if (authPath === AUTHPATH_SIGNUP) {
    return (
      <SignUpScreen
        completeAuth={(isClient: boolean): void =>
          completeAuth(isClient, setAuthPath)
        }
      />
    );
  }

  if (authPath === AUTHPATH_LOGIN) {
    return (
      <LoginScreen
        changeAuthPath={(path: number, data: object): void => {
          setAuthPath(path);
          setAuthData(data);
        }}
      />
    );
  }

  return <AppContainer screenProps={{ blListNumber: props.blListNumber }} />;
};

const completeAuth = (
  isClient: boolean,
  setAuthPath: (path: number) => void
): void => {
  AppContainer = createAppContainer(
    createSwitchNavigator(
      {
        // You could add another route here for authentication.
        // Read more at https://reactnavigation.org/docs/en/auth-flow.html
        Main: isClient ? MainTabNavigator : FirmTabNavigator,
      },
      {
        mode: 'modal',
        headerMode: 'none',
        initialRouteName: 'Main',
      }
    )
  );

  setAuthPath(AUTHPATH_COMPLETE);
};

export default RootNavigator;
