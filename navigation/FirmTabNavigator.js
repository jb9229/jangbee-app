import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import FirmMyInfoScreen from '../screens/FirmMyInfoScreen';
import ClientEvaluScreen from '../screens/ClientEvaluScreen';
import FirmRegisterScreen from '../screens/FirmRegisterScreen';
import FirmUpdateScreen from '../screens/FirmUpdateScreen';
import AdScreen from '../screens/AdScreen';
import AdCreateScreen from '../screens/AdCreateScreen';
import OpenBankAuthWebView from '../components/OpenBankAuthWebView';
import FirmWorkListScreen from '../screens/FirmWorkListScreen';
import WorkRegisterScreen from '../screens/WorkRegisterScreen';
import JBServiceTerms from '../screens/JBServiceTerms';
import colors from '../constants/Colors';

const FirmWorkStack = createStackNavigator({
  FirmWorkList: { screen: FirmWorkListScreen, navigationOptions: { header: null } },
  WorkRegister: {
    screen: WorkRegisterScreen,
    navigationOptions: {
      title: '일감 등록하기',
      headerStyle: { marginTop: -28, backgroundColor: colors.point3_other2 },
      headerTintColor: '#fff',
    },
  },
});

FirmWorkStack.navigationOptions = {
  tabBarLabel: '일감',
  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="work" type="MaterialIcons" />,
};

const FirmMyInfoStack = createStackNavigator({
  FirmMyInfo: { screen: FirmMyInfoScreen, navigationOptions: { header: null } },
  FirmRegister: {
    screen: FirmRegisterScreen,
    navigationOptions: {
      title: '업체정보 등록',
      headerStyle: { marginTop: -28, backgroundColor: colors.point3_other2 },
      headerTintColor: '#fff',
    },
  },
  FirmUpdate: {
    screen: FirmUpdateScreen,
    navigationOptions: {
      title: '업체정보 수정',
      headerStyle: { marginTop: -28, backgroundColor: colors.point3_other2 },
      headerTintColor: '#fff',
    },
  },
  ServiceTerms: {
    screen: JBServiceTerms,
    navigationOptions: {
      title: '약관 및 회사정보',
      headerStyle: { marginTop: -28, backgroundColor: colors.point3_other2 },
      headerTintColor: '#fff',
    },
  },
});

const HomeStack = createStackNavigator({
  FirmHome: { screen: HomeScreen, navigationOptions: { header: null } },
});

HomeStack.navigationOptions = {
  tabBarLabel: '장비콜',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-call' : 'md-call'} />
  ),
};

const AdStack = createStackNavigator({
  Ad: {
    screen: AdScreen,
    navigationOptions: {
      title: '내광고 리스트',
      headerStyle: {
        backgroundColor: colors.point3_other2,
        elevation: 10,
        marginTop: -28,
      },
      headerTintColor: '#fff',
    },
  },
  AdCreate: {
    screen: AdCreateScreen,
    navigationOptions: {
      title: '내장비 홍보하기',
      headerStyle: { marginTop: -28, backgroundColor: colors.point3_other2 },
      headerTintColor: '#fff',
    },
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

const ClientEvaluStack = createStackNavigator({
  ClientEvalu: {
    screen: ClientEvaluScreen,
    navigationOptions: { header: null },
  },
});

ClientEvaluStack.navigationOptions = {
  tabBarLabel: '피해사례(악덕)',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
  ),
};

export default createBottomTabNavigator(
  {
    HomeStack,
    FirmWorkStack,
    AdStack,
    ClientEvaluStack,
    FirmMyInfoStack,
  },
  {
    tabBarOptions: {
      tabStyle: { backgroundColor: '#83868B' },
      inactiveTintColor: 'white',
      activeTintColor: colors.pointDark,
    },
  },
);
