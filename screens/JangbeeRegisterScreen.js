import React from "react";
import { Text, TextInput, View } from "react-native";

export default class JangbeeRegisterScreen extends React.Componenet {
  constractor(props) {
    super(props);
    this.state = {
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

  openSelEquipmentModal = () => {};

  render() {
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
          secureTextEntry="true"
          placeholder="비밀번호를 입력해 주세요"
          onChangeText={text => this.setState({ cName: text })}
        />
        <Text>비밀번호 확인*</Text>
        <TextInput
          style={styles.cNameTinput}
          keyboardType="phone-pad"
          secureTextEntry="true"
          placeholder="비밀번호를 재입력해 주세요"
          onChangeText={text => this.setState({ comfirmPassword: text })}
        />
        <Text>보유 장비*</Text>
        <TextInput
          style={styles.cNameTinput}
          keyboardType="phone-pad"
          secureTextEntry="true"
          onKeyPress={() => this.openSelEquipmentModal}
          placeholder="보유 장비를 선택해 주세요"
          onChangeText={text => this.setState({ comfirmPassword: text })}
        />
      </View>
    );
  }
}
