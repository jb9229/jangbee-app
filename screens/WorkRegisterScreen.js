import React from 'react';
import { Text, View, DatePickerAndroid } from 'react-native';
import { Button } from 'react-native-elements';
import EquipementModal from '../components/EquipmentModal';

export default class WorkRegisterScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleEquiModal: false,
      equiSelected: '',
    };
  }

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
    const { isVisibleEquiModal, equiSelected } = this.state;

    return (
      <View>
        <EquipementModal
          isVisibleEquiModal={isVisibleEquiModal}
          closeModal={() => this.setState({ isVisibleEquiModal: false })}
          selEquipmentStr={equiSelected}
          completeSelEqui={seledEuipListStr => this.setState({ equiSelected: seledEuipListStr })}
          depth={2}
        />
        <Text>일감등록 화면</Text>
        <Button title="시작일 선택" onPress={this.openStartWorkDatePicker} />
        <Button title="호출장비 선택" onPress={() => this.setState({ isVisibleEquiModal: true })} />
      </View>
    );
  }
}
