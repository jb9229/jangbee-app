import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import FirmMyInfoScreen from '../screens/FirmMyInfoScreen';
import SettingsScreen from '../screens/SettingsScreen';
import FirmRegisterScreen from '../screens/FirmRegisterScreen';
import FirmUpdateScreen from '../screens/FirmUpdateScreen';

const FirmMyInfoStack = createStackNavigator({
  FirmMyInfo: { screen: FirmMyInfoScreen, navigationOptions: { header: null } },
  FirmRegister: FirmRegisterScreen,
  FirmUpdate: FirmUpdateScreen,
});

FirmMyInfoStack.navigationOptions = {
  tabBarLabel: '업체정보',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: '콜이력',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
  ),
};

export default createBottomTabNavigator({
  FirmMyInfoStack,
  SettingsStack,
});
