import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import FirmMyInfoScreen from '../screens/FirmMyInfoScreen';
import SettingsScreen from '../screens/SettingsScreen';
import FirmRegisterScreen from '../screens/FirmRegisterScreen';
import FirmUpdateScreen from '../screens/FirmUpdateScreen';
import AdScreen from '../screens/AdScreen';
import AdCreateScreen from '../screens/AdCreateScreen';
import FirmDetailScreen from '../screens/FirmDetailScreen';
import OpenBankAuthWebView from '../components/OpenBankAuthWebView';

const FirmMyInfoStack = createStackNavigator({
  FirmMyInfo: { screen: FirmMyInfoScreen, navigationOptions: { header: null } },
  FirmRegister: {
    screen: FirmRegisterScreen,
    navigationOptions: { title: '업체정보 등록', headerStyle: { marginTop: -28 } },
  },
  FirmUpdate: {
    screen: FirmUpdateScreen,
    navigationOptions: { title: '업체정보 수정', headerStyle: { marginTop: -28 } },
  },
});

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  FirmDetail: FirmDetailScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: '장비콜',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-call' : 'md-call'} />
  ),
};

const AdStack = createStackNavigator({
  Ad: { screen: AdScreen, navigationOptions: { header: null } },
  AdCreate: {
    screen: AdCreateScreen,
    navigationOptions: { title: '내장비 홍보하기', headerStyle: { marginTop: -28 } },
  },
  OpenBankAuth: { screen: OpenBankAuthWebView, navigationOptions: { header: null } },
});

AdStack.navigationOptions = {
  tabBarLabel: '광고신청',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-radio' : 'md-radio'} />
  ),
};

FirmMyInfoStack.navigationOptions = {
  tabBarLabel: '내정보',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-information-circle' : 'md-information-circle'}
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: '블랙리스트(준비중)',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  AdStack,
  FirmMyInfoStack,
  SettingsStack,
});
