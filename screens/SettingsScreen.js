import React from 'react';
import { Text, View } from 'react-native';
import { ExpoConfigView } from '@expo/samples';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'app.json',
  };

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return (
      <View>
        <Text>블랙리스트 고객 정보를 공유하는 기능을 계획 중입니다.</Text>
        <Text>일정: 계횢중</Text>
        <ExpoConfigView />
      </View>
    );
  }
}
