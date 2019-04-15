import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import FirmMyInfoScreen from '../screens/FirmMyInfoScreen';
import WorkListScreen from '../screens/WorkListScreen';
import WorkRegisterScreen from '../screens/WorkRegisterScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

const WorkListStack = createStackNavigator({
  WorkList: { screen: WorkListScreen, navigationOptions: { header: null } },
  WorkRegister: {
    screen: WorkRegisterScreen,
    navigationOptions: { title: '일감 등록하기', headerStyle: { marginTop: -28 } },
  },
});

WorkListStack.navigationOptions = {
  tabBarLabel: '일감등록',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-information-circle' : 'md-information-circle'}
    />
  ),
};

const ClientInfosStack = createStackNavigator({
  Links: FirmMyInfoScreen,
});

ClientInfosStack.navigationOptions = {
  tabBarLabel: '내정보',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-information-circle' : 'md-information-circle'}
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  WorkListStack,
  ClientInfosStack,
});
