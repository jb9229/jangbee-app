import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  TextInput,
  View,
} from 'react-native';
import EquipementModal from '../../components/EquipmentModal';

const styles = StyleSheet.create({
  container: {},
  cNameTinput: {},
});

export default class FirmRegisterScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleEquiModal: false,
      equiListStr: '',
      cName: "",
      phoneNumber: "",
      password: "",
      comfirmPassword: "",
      equipmentList: [],
      sidoAddr: "",
      sigunguAddr: "",
      dongriAddr: "",
      addressDetail: "",
      gpsLongitude: "",
      gpsLatitude: "",
      cIntroduction: "",
      photo1: "",
      photo2: "",
      photo3: "",
      photo4: "",
      photo5: "",
      homepage: "",
      blog: "",
      sns: ""
    };
  }

  /**
   * 장비선택창 Visible 설정 함수
   *
   * @param {boolean} visible 설정 플래그
   */
  setEquiSelModalVisible = visible => {
    this.setState({ isVisibleEquiModal: visible });
  };

  openSelEquipmentModal = () => {
    console.log("start openSelEquipmentModal");

    this.setEquiSelModalVisible(true);
  };

  completeSelEqui = (seledEuipListStr) => {
    this.setState({equiListStr: seledEuipListStr})
  }

  render() {
    const { isVisibleEquiModal, equiListStr } = this.state;

    return (
      <View style={styles.container}>
        <Text>업체명*</Text>
        <TextInput
          style={styles.cNameTinput}
          placeholder="업체명을 입력해 주세요"
          onChangeText={text => this.setState({ cName: text })}
        />
        <Text>전화번호*</Text>
        <TextInput
          style={styles.cNameTinput}
          keyboardType="phone-pad"
          placeholder="전화번호를 입력해 주세요"
          onChangeText={text => this.setState({ cName: text })}
        />
        <Text>비밀번호*</Text>
        <TextInput
          style={styles.cNameTinput}
          keyboardType="phone-pad"
          secureTextEntry={true}
          placeholder="비밀번호를 입력해 주세요"
          onChangeText={text => this.setState({ cName: text })}
        />
        <Text>비밀번호 확인*</Text>
        <TextInput
          style={styles.cNameTinput}
          keyboardType="phone-pad"
          secureTextEntry={true}
          placeholder="비밀번호를 재입력해 주세요"
          onChangeText={text => this.setState({ comfirmPassword: text })}
        />
        <Text>보유 장비*</Text>
        <TouchableHighlight onPress={() => this.openSelEquipmentModal()}>
          <TextInput
            style={styles.cNameTinput}
            value={equiListStr}
            placeholder="보유 장비를 선택해 주세요"
            onFocus={() => this.openSelEquipmentModal()}
            onChangeText={text => this.setState({ equiListStr: text })}
          />
        </TouchableHighlight>

        <EquipementModal
          isVisibleEquiModal={isVisibleEquiModal}
          setEquiSelModalVisible={this.setEquiSelModalVisible}
          seledEquipmentStr={equiListStr}
          completeSelEqui={this.completeSelEqui}
        />
      </View>
    );
  }
}
