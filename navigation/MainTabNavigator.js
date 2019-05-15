import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import ClientMyInfoScreen from '../screens/ClientMyInfoScreen';
import WorkListScreen from '../screens/WorkListScreen';
import WorkRegisterScreen from '../screens/WorkRegisterScreen';
import AppliFirmList from '../components/AppliFirmList';

const ClientHomeStack = createStackNavigator({
  ClientHome: { screen: HomeScreen, navigationOptions: { header: null } },
});

ClientHomeStack.navigationOptions = {
  tabBarLabel: '장비콜',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-call' : 'md-call'} />
  ),
};

const FirmWorkListStack = createStackNavigator({
  WorkList: { screen: WorkListScreen, navigationOptions: { header: null } },
  WorkRegister: {
    screen: WorkRegisterScreen,
    navigationOptions: { title: '일감 등록하기', headerStyle: { marginTop: -28 } },
  },
  AppliFirmList: {
    screen: AppliFirmList,
    navigationOptions: { title: '지원업체 리스트', headerStyle: { marginTop: -28 } },
  },
});

FirmWorkListStack.navigationOptions = {
  tabBarLabel: '일감등록',
  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="work" type="MaterialIcons" />,
};

const ClientInfoStack = createStackNavigator({
  ClientInfo: {
    screen: ClientMyInfoScreen,
    navigationOptions: { title: '사용자 정보', headerStyle: { marginTop: -28 } },
  },
});

ClientInfoStack.navigationOptions = {
  tabBarLabel: '내정보',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-information-circle' : 'md-information-circle'}
    />
  ),
};

export default createBottomTabNavigator({
  ClientHomeStack,
  FirmWorkListStack,
  ClientInfoStack,
});
