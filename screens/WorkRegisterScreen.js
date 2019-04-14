import React from 'react';
import { Text, View, DatePickerAndroid } from 'react-native';
import { Button } from 'react-native-elements';

export default class WorkRegisterScreen extends React.Component {
  openStartWorkDatePicker = async () => {
    try {
      const {
        action, year, month, day,
      } = await DatePickerAndroid.open({
        // Use `new Date()` for current date.
        // May 25 2020. Month 0 is January.
        date: new Date(2020, 4, 25),
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        // Selected year, month (0-11), day
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  };

  render() {
    return (
      <View>
        <Text>일감등록 화면</Text>
        <Button title="시작일 선택" onPress={this.openStartWorkDatePicker} />
      </View>
    );
  }
}
