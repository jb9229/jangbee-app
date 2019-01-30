import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

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

export default appContainer;
// }
