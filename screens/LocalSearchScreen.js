import React from 'react';
import {
  Button, TextInput, Text, View,
} from 'react-native';

export default class LocalSearchScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { navigation } = this.props;

    return (
      <View>
        <Text>광고신청 화면</Text>
        <Text>결제 기능(월 정기결제)</Text>
        <View>
          <Text>초기 나누기 통장 별칭: </Text>
          <TextInput
            value="입력할 항목"
            onChangeText={text => this.setState({})}
            placeholder="입력 받아야 할 내용"
          />
        </View>

        <View>
          <Button
            onPress={() => navigation.navigate('OpenBankAuth', { type: 'ADD_ACCOUNT' })}
            title="통장 계좌이체"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
          />
          <Button
            onPress={() => navigation.navigate('OpenBankAuth', { type: 'REAUTH' })}
            title="등록 통장 계좌이체"
            accessibilityLabel="Re Authorizition"
          />
        </View>
      </View>
    );
  }
}
