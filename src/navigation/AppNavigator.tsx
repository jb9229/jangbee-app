import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import AuthLoading from 'auth/AuthLoading';
import FirmTabNavigator from './FirmTabNavigator';
import LoginScreen from 'screens/LoginScreen';
import MainTabNavigator from './MainTabNavigator';
import React from 'react';
import SignUpScreen from 'screens/SignUpScreen';
import { useLoginContext } from 'src/contexts/LoginContext';

let AppContainer;

const AUTHPATH_COMPLETE = -1;
const AUTHPATH_AUTHING = 1;
const AUTHPATH_SIGNUP = 2;
const AUTHPATH_LOGIN = 3;

interface Props {
  blListNumber: string;
}
const RootNavigator: React.FC<Props> = props => {
  const { setUser, setUserProfile } = useLoginContext();
  const [authPath, setAuthPath] = React.useState(AUTHPATH_AUTHING);
  const [authData, setAuthData] = React.useState();

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
        setUser={setUser}
        setUserProfile={setUserProfile}
      />
    );
  }

  if (authPath === AUTHPATH_SIGNUP) {
    return (
      <SignUpScreen
        user={authData}
        completeAuth={(isClient: boolean): void =>
          completeAuth(isClient, setAuthPath)
        }
        setUser={setUser}
        setUserProfile={setUserProfile}
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
