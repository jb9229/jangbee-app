import React from 'react';
import { Alert, createAppContainer, createSwitchNavigator } from 'react-navigation';
import { Permissions, Notifications } from 'expo';

import MainTabNavigator from './MainTabNavigator';
import FirmTabNavigator from './FirmTabNavigator';
import EquipmentModal from '../components/EquipmentModal';
import SignUpScreen from '../screens/SignUpScreen';
import LoginScreen from '../screens/LoginScreen';
import AuthLoading from '../auth/AuthLoading';

const appContainer = createAppContainer(
  createSwitchNavigator(
    {
      // You could add another route here for authentication.
      // Read more at https://reactnavigation.org/docs/en/auth-flow.html
      AuthLoading,
      ClientMain: MainTabNavigator,
      FirmMain: FirmTabNavigator,
      EquipmentModal,
      SignUp: SignUpScreen,
      Login: LoginScreen,
    },
    {
      mode: 'modal',
      headerMode: 'none',
      initialRouteName: 'AuthLoading',
    },
  ),
);

class RootNavigator extends React.Component {
  componentDidMount() {
    this.getiOSNotificationPermission();
    // this._notificationSubscription = this._listenForNotifications();
  }

  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
  }

  render() {
    return <appContainer />;
  }

  // android permissions are given on install
  async getiOSNotificationPermission() {
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    if (status !== 'granted') {
      return;
    }
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  _handleNotification = ({ origin, data, remote }) => {
    console.log(remote);
    const type = remote ? 'Push' : 'Local';
    const info = `${type} notification ${origin} with data: ${JSON.stringify(data)}`;
    setTimeout(() => Alert.alert('Notification!', info), 500);
  };
}

export default appContainer;
