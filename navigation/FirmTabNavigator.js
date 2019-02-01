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
  FirmRegister: { screen: FirmRegisterScreen, navigationOptions: { title: '업체정보 등록' } },
  FirmUpdate: { screen: FirmUpdateScreen, navigationOptions: { title: '업체정보 수정' } },
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
  tabBarLabel: '블렉리스트(준비중)',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
  ),
};

export default createBottomTabNavigator({
  FirmMyInfoStack,
  SettingsStack,
});
