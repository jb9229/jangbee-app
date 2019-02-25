import React from 'react';
import { Linking, Text, View } from 'react-native';
import { ExpoConfigView } from '@expo/samples';
import JBButton from '../components/molecules/JBButton';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: '블랙리스트 고객',
    headerStyle: {
      marginTop: -28,
    },
  };

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return (
      <View>
        <Text>블랙리스트 고객 정보를 공유하는 기능을 계획 중입니다.</Text>
        <Text>일감이 들어왔을 때, 블랙리스트 고객의 정보를 알 수 있습니다.</Text>
        <Text>더 좋은 서비스를 만들기 위해, 의견 있으시면 부탁 드립니다</Text>
        <Text>일정: 2018년 3월경 일정산출 예정</Text>
        <JBButton
          title="메일로 의견보내기"
          onPress={() => Linking.openURL('mailto:jb9229@gmail.com')}
        />
      </View>
    );
  }
}
