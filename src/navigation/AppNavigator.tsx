import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import AuthLoading from 'auth/AuthLoading';
import FirmTabNavigator from './FirmTabNavigator';
import LoginScreen from 'screens/LoginScreen';
import MainTabNavigator from './MainTabNavigator';
import React from 'react';
import SignUpScreen from 'screens/SignUpScreen';
import { useLoginProvider } from 'src/contexts/LoginProvider';

let AppContainer;

const AUTHPATH_COMPLETE = -1;
const AUTHPATH_AUTHING = 1;
const AUTHPATH_SIGNUP = 2;
const AUTHPATH_LOGIN = 3;

interface Props {
  blListNumber: string;
}
const RootNavigator: React.FC<Props> = (props) =>
{
  const { setUser, setUserProfile } = useLoginProvider();
  const [authPath, setAuthPath] = React.useState(AUTHPATH_AUTHING);
  const [authData, setAuthData] = React.useState();

  const completeAuth = (isClient): void =>
  {
    AppContainer = createAppContainer(
      createSwitchNavigator(
        {
          // You could add another route here for authentication.
          // Read more at https://reactnavigation.org/docs/en/auth-flow.html
          Main: isClient ? MainTabNavigator : FirmTabNavigator
        },
        {
          mode: 'modal',
          headerMode: 'none',
          initialRouteName: 'Main'
        }
      )
    );

    setAuthPath(AUTHPATH_COMPLETE);
  };

  if (authPath === AUTHPATH_AUTHING)
  {
    return (
      <AuthLoading
        completeAuth={this.completeAuth}
        changeAuthPath={(path, data): void => { setAuthPath(path); setAuthData(data) }}
        setUser={setUser}
        setUserProfile={setUserProfile}
      />
    );
  }

  if (authPath === AUTHPATH_SIGNUP)
  {
    return <SignUpScreen user={authData} completeAuth={completeAuth} />;
  }

  if (authPath === AUTHPATH_LOGIN)
  {
    return (
      <LoginScreen
        changeAuthPath={(path, data): void => { setAuthPath(path); setAuthData(data) }}
      />
    );
  }

  return <AppContainer screenProps={{ blListNumber: props.blListNumber }} />;
};

export default RootNavigator;
