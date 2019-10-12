import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import SignUpScreen from 'screens/SignUpScreen';
import LoginScreen from 'screens/LoginScreen';
import AuthLoading from 'auth/AuthLoading';
import FirmTabNavigator from './FirmTabNavigator';
import MainTabNavigator from './MainTabNavigator';

let AppContainer;

const AUTHPATH_COMPLETE = -1;
const AUTHPATH_AUTHING = 1;
const AUTHPATH_SIGNUP = 2;
const AUTHPATH_LOGIN = 3;
export default class RootNavigator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      authPath: AUTHPATH_AUTHING
    };
  }

  componentDidMount() {}

  completeAuth = isClient => {
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

    this.setState({ authPath: AUTHPATH_COMPLETE });
  };

  render() {
    const { authPath, authData } = this.state;

    if (authPath === AUTHPATH_AUTHING) {
      return (
        <AuthLoading
          completeAuth={this.completeAuth}
          changeAuthPath={(path, data) =>
            this.setState({ authPath: path, authData: data })
          }
        />
      );
    }

    if (authPath === AUTHPATH_SIGNUP) {
      return <SignUpScreen user={authData} completeAuth={this.completeAuth} />;
    }

    if (authPath === AUTHPATH_LOGIN) {
      return (
        <LoginScreen
          changeAuthPath={(path, data) =>
            this.setState({ authPath: path, authData: data })
          }
        />
      );
    }

    return <AppContainer />;
  }
}
