import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import FirmTabNavigator from './FirmTabNavigator';
import EquipmentModal from '../components/EquipmentModal';
import SignUpScreen from '../screens/SignUpScreen';
import LoginScreen from '../screens/LoginScreen';
import AuthLoading from '../auth/AuthLoading';

const ACCOUNTTYPE = 2;
const ACCOUNTTYPE_CLIENT = 1;
const ACCOUNTTYPE_FIRM = 2;

let mainNavigator;
if (ACCOUNTTYPE === ACCOUNTTYPE_CLIENT) {
  mainNavigator = MainTabNavigator;
} else if (ACCOUNTTYPE === ACCOUNTTYPE_FIRM) {
  mainNavigator = FirmTabNavigator;
}

const appContainer = createAppContainer(
  createSwitchNavigator(
    {
      // You could add another route here for authentication.
      // Read more at https://reactnavigation.org/docs/en/auth-flow.html
      AuthLoading,
      Main: mainNavigator,
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
