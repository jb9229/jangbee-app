import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import FirmMyInfoScreen from '../screens/FirmMyInfoScreen';
import WorkListScreen from '../screens/WorkListScreen';
import WorkRegisterScreen from '../screens/WorkRegisterScreen';
import AppliFirmList from '../components/AppliFirmList';
import AppliFirmDetail from '../components/AppliFirmDetail';

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
  AppliFirmList: {
    screen: AppliFirmList,
    navigationOptions: { title: '지원업체 리스트', headerStyle: { marginTop: -28 } },
  },
  AppliFirmDetail: {
    screen: AppliFirmDetail,
    navigationOption: { title: '지원업체 상세보기', headerStyle: { marginTop: -28 } },
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
