import React from 'react';
import { Text, View } from 'react-native';

export default class LocalSearchScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View>
        <Text>지역검색 화면</Text>
      </View>
    );
  }
}
