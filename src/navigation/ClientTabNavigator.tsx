import { ClientBottomTabParamList, ClientWorkParamList } from './types';

import AppliFirmList from 'organisms/AppliFirmList';
import ClientHomeScreen from 'screens/ClientHomeScreen';
import ClientMyInfoScreen from 'screens/ClientMyInfoScreen';
import { Platform } from 'react-native';
import React from 'react';
import TabBarIcon from 'atoms/TabBarIcon';
import WorkListScreen from 'screens/WorkListScreen';
import WorkRegisterScreen from 'container/work/register';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

const ClientBottomTab = createBottomTabNavigator<ClientBottomTabParamList>();
const ClientWorkStack = createStackNavigator<ClientWorkParamList>();

const ClientBottomTabNavigator: React.FC = () => {
  return (
    <ClientBottomTab.Navigator>
      <ClientBottomTab.Screen
        name="ClientHome"
        component={ClientHomeScreen}
        options={{
          tabBarLabel: '장비 콜',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              name={Platform.OS === 'ios' ? 'ios-call' : 'md-call'}
            />
          ),
        }}
      />
      <ClientBottomTab.Screen
        name="WorkList"
        component={FirmWork}
        options={{
          tabBarLabel: '일감등록',
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabBarIcon focused={focused} name="work" type="MaterialIcons" />
          ),
        }}
      />
      <ClientBottomTab.Screen
        name="ClientInfo"
        component={ClientMyInfoScreen}
        options={{
          title: '사용자 정보',
          tabBarLabel: '내 정보',
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabBarIcon
              focused={focused}
              name={
                Platform.OS === 'ios'
                  ? 'ios-information-circle'
                  : 'md-information-circle'
              }
            />
          ),
        }}
      />
    </ClientBottomTab.Navigator>
  );
};

const FirmWork: React.FC = () => {
  return (
    <ClientWorkStack.Navigator>
      <ClientWorkStack.Screen
        name="WorkList"
        component={WorkListScreen}
        options={{ title: '일감' }}
      />
      <ClientWorkStack.Screen
        name="WorkRegister"
        component={WorkRegisterScreen}
        options={{ title: '일감 등록하기' }}
      />
      <ClientWorkStack.Screen
        name="AppliFirmList"
        component={AppliFirmList}
        options={{ title: '지원업체 리스트' }}
      />
    </ClientWorkStack.Navigator>
  );
};

export default ClientBottomTabNavigator;
