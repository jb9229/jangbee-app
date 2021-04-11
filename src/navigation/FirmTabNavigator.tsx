import {
  AdParamList,
  ClientEvaluParamList,
  FirmBottomTabParamList,
  FirmSettingParamList,
  FirmWorkParamList,
} from './types';

import AdCreateScreen from 'container/ad/create';
import AdScreen from 'screens/AdScreen';
import CallLogContainerScreen from 'container/calllog';
import CashBackContainer from 'src/container/cashback';
import ClientHomeModalScreen from 'container/clientHome/modal';
import FirmHarmCaseContainer from 'container/firmHarmCase/list';
import FirmHarmCaseCreateContainer from 'container/firmHarmCase/create';
import FirmHarmCaseSearchContainer from 'container/firmHarmCase/search';
import FirmHarmCaseUpdateContainer from 'container/firmHarmCase/update';
import FirmMyInfoScreen from 'screens/FirmMyInfoScreen';
import FirmRegisterScreen from 'container/firm/create';
import FirmSettingScreen from 'screens/FirmSettingScreen';
import FirmUpdateScreen from 'container/firm/modify';
import FirmWorkListScreen from 'container/firmwork/list';
import HomeScreen from 'screens/HomeScreen';
import JBServiceTerms from 'screens/JBServiceTerms';
import { Platform } from 'react-native';
import React from 'react';
import TabBarIcon from 'atoms/TabBarIcon';
import WorkRegisterScreen from 'container/work/register';
import colors from 'constants/Colors';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useLoginContext } from 'src/contexts/LoginContext';

const FirmBottomTab = createBottomTabNavigator<FirmBottomTabParamList>();
const FirmWorkStack = createStackNavigator<FirmWorkParamList>();
const FirmSettingStack = createStackNavigator<FirmSettingParamList>();
const AdStack = createStackNavigator<AdParamList>();
const ClientEvaluStack = createStackNavigator<ClientEvaluParamList>();

const FirmBottomTabNavigator: React.FC = () => {
  const { firm } = useLoginContext();
  return (
    <FirmBottomTab.Navigator
      initialRouteName={firm ? 'FirmHome' : 'FirmSetting'}
      tabBarOptions={{
        tabStyle: { backgroundColor: '#83868B' },
        inactiveTintColor: 'white',
        activeTintColor: colors.pointDark,
      }}
    >
      <FirmBottomTab.Screen
        name="FirmHome"
        component={HomeScreen}
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
      <FirmBottomTab.Screen
        name="WorkList"
        component={FirmWork}
        options={{
          tabBarLabel: '일감',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="work" type="MaterialIcons" />
          ),
        }}
      />
      <FirmBottomTab.Screen
        name="Ad"
        component={Ad}
        options={{
          tabBarLabel: '광고신청',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              name={Platform.OS === 'ios' ? 'ios-radio' : 'md-radio'}
            />
          ),
        }}
      />
      <FirmBottomTab.Screen
        name="ClientEvalu"
        component={ClientEvalu}
        options={{
          tabBarLabel: '수금 피해사례',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              type="SimpleLineIcons"
              name={Platform.OS === 'ios' ? 'magnifier' : 'magnifier'}
            />
          ),
        }}
      />
      <FirmBottomTab.Screen
        name="FirmSetting"
        component={FirmSetting}
        options={{
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
          ),
        }}
      />
    </FirmBottomTab.Navigator>
  );
};

const FirmWork: React.FC = () => {
  return (
    <FirmWorkStack.Navigator>
      <FirmWorkStack.Screen
        name="WorkList"
        component={FirmWorkListScreen}
        options={{ title: '일감 등록하기' }}
      />
      <FirmWorkStack.Screen
        name="WorkRegister"
        component={WorkRegisterScreen}
        options={{ title: '일감 등록하기' }}
        initialParams={{ firmRegister: true }}
      />
    </FirmWorkStack.Navigator>
  );
};

const FirmSetting: React.FC = () => {
  return (
    <FirmSettingStack.Navigator>
      <FirmSettingStack.Screen
        name="FirmSetting"
        component={FirmSettingScreen}
        options={{
          title: '내 정보',
        }}
      />
      <FirmSettingStack.Screen
        name="FirmMyInfo"
        component={FirmMyInfoScreen}
        options={{
          headerShown: false,
        }}
      />
      <FirmSettingStack.Screen
        name="FirmRegister"
        component={FirmRegisterScreen}
        options={{
          title: '내 장비 등록',
          headerStyle: { backgroundColor: colors.point3_other },
        }}
      />
      <FirmSettingStack.Screen
        name="FirmUpdate"
        component={FirmUpdateScreen}
        options={{
          title: '내 장비 수정',
          headerStyle: { backgroundColor: colors.point3_other2 },
        }}
      />
      <FirmSettingStack.Screen
        name="ServiceTerms"
        component={JBServiceTerms}
        options={{
          title: '약관 및 회사정보',
          headerStyle: { backgroundColor: colors.point3_other2 },
        }}
      />
      <FirmSettingStack.Screen
        name="Cashback"
        component={CashBackContainer}
        options={{ title: '보유 자산' }}
      />
      <FirmSettingStack.Screen
        name="ClientHomeModal"
        component={ClientHomeModalScreen}
      />
      <FirmSettingStack.Screen
        name="CallLog"
        component={CallLogContainerScreen}
        options={{
          title: '콜 이력',
          headerStyle: { backgroundColor: colors.point3_other2 },
        }}
      />
    </FirmSettingStack.Navigator>
  );
};

const Ad: React.FC = () => {
  return (
    <AdStack.Navigator>
      <AdStack.Screen
        name="Ad"
        component={AdScreen}
        options={{
          title: '내장비 홍보하기',
          headerStyle: { backgroundColor: colors.point3_other2 },
        }}
      />
      <AdStack.Screen
        name="AdCreate"
        component={AdCreateScreen}
        options={{
          title: '내장비 홍보하기',
          headerStyle: { backgroundColor: colors.point3_other2 },
        }}
      />
    </AdStack.Navigator>
  );
};

const ClientEvalu: React.FC = () => {
  return (
    <ClientEvaluStack.Navigator>
      <ClientEvaluStack.Screen
        name="ClientEvalu"
        component={FirmHarmCaseContainer}
        initialParams={{ search: undefined }}
        options={{
          title: '수금 피해사례',
          headerStyle: { backgroundColor: '#3E3936', elevation: 10 },
          headerTintColor: 'rgb(247, 174, 67)',
        }}
      />
      <ClientEvaluStack.Screen
        name="FirmHarmCaseCreate"
        component={FirmHarmCaseCreateContainer}
        options={{
          title: '피해사례 등록',
          headerStyle: { backgroundColor: '#3E3936', elevation: 10 },
          headerTintColor: 'rgb(247, 174, 67)',
        }}
      />
      <ClientEvaluStack.Screen
        name="FirmHarmCaseUpdate"
        component={FirmHarmCaseUpdateContainer}
      />
      <ClientEvaluStack.Screen
        name="FirmHarmCaseSearch"
        component={FirmHarmCaseSearchContainer}
        options={{
          title: '피해사례 조회',
          headerStyle: { backgroundColor: '#3E3936', elevation: 10 },
          headerTintColor: 'rgb(247, 174, 67)',
        }}
      />
    </ClientEvaluStack.Navigator>
  );
};

export default FirmBottomTabNavigator;
