import {
  createBottomTabNavigator,
  createStackNavigator
} from 'react-navigation';

import AppliFirmList from 'organisms/AppliFirmList';
import ClientMyInfoScreen from 'screens/ClientMyInfoScreen';
import HomeScreen from 'screens/HomeScreen';
import JBServiceTerms from 'screens/JBServiceTerms';
import { Platform } from 'react-native';
import React from 'react';
import TabBarIcon from 'atoms/TabBarIcon';
import WorkListScreen from 'screens/WorkListScreen';
import WorkRegisterScreen from 'container/work/register';
import colors from 'constants/Colors';

const ClientHomeStack = createStackNavigator({
  ClientHome: { screen: HomeScreen, navigationOptions: { header: null } }
});

ClientHomeStack.navigationOptions = {
  tabBarLabel: '장비콜',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-call' : 'md-call'}
    />
  )
};

const FirmWorkListStack = createStackNavigator({
  WorkList: { screen: WorkListScreen, navigationOptions: { header: null } },
  WorkRegister: {
    screen: WorkRegisterScreen,
    navigationOptions: {
      title: '일감 등록하기'
    }
  },
  AppliFirmList: {
    screen: AppliFirmList,
    navigationOptions: {
      title: '지원업체 리스트'
    }
  }
});

FirmWorkListStack.navigationOptions = {
  tabBarLabel: '일감등록',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name="work" type="MaterialIcons" />
  )
};

const ClientInfoStack = createStackNavigator({
  ClientInfo: {
    screen: ClientMyInfoScreen,
    navigationOptions: { title: '사용자 정보' }
  },
  ServiceTerms: {
    screen: JBServiceTerms,
    navigationOptions: {
      title: '약관 및 회사정보'
    }
  }
});

ClientInfoStack.navigationOptions = {
  tabBarLabel: '내정보',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? 'ios-information-circle'
          : 'md-information-circle'
      }
    />
  )
};

export default createBottomTabNavigator(
  {
    ClientHomeStack,
    FirmWorkListStack,
    ClientInfoStack
  },
  {
    tabBarOptions: {
      tabStyle: { backgroundColor: '#83868B' },
      inactiveTintColor: 'white',
      activeTintColor: colors.pointDark
    }
  }
);
