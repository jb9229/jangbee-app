import React from 'react';
import { Alert, TouchableHighlight, Text, View } from 'react-native';
import firebase from 'firebase';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  onSignOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (e) {
      Alert.alert('로그아웃에 문제가 있습니다, 재시도해 주세요.');
    }
  };

  render() {
    return (
      <View>
        <Text>광고</Text>
        <Text>검색</Text>
        <Text>검색결과</Text>
        <TouchableHighlight onPress={() => this.onSignOut()}>
          <Text>로그아웃</Text>
        </TouchableHighlight>
      </View>
    );
  }
}
