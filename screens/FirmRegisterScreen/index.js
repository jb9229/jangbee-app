import React from 'react';
import {
  StyleSheet, Text, TouchableHighlight, TextInput, View,
} from 'react-native';
import EquipementModal from '../../components/EquipmentModal';
import DaumMapAddModal from '../../components/DaumMapAddModal';
import { validate } from '../../utils/Validation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemInput: {},
  errorMessage: {
    color: 'red',
  },
  itemWrap: {
    flex: 1,
    flexDirection: 'row',
  },
});

export default class FirmRegisterScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleEquiModal: false,
      isVisibleMapAddModal: false,
      cName: '',
      phoneNumber: '',
      password: '',
      comfirmPassword: '',
      equiListStr: '',
      address: '',
      addressDetail: '',
      sidoAddr: '',
      sigunguAddr: '',
      dongriAddr: '',
      gpsLongitude: '',
      gpsLatitude: '',
      cIntroduction: '',
      photo1: '',
      photo2: '',
      photo3: '',
      photo4: '',
      photo5: '',
      homepage: '',
      blog: '',
      sns: '',
      cNameValErrMessage: '',
      phoneNumberValErrMessage: '',
      passwordValErrMessage: '',
      comfirmPasswordValErrMessage: '',
      equiListStrValErrMessage: '',
      addressValErrMessage: '',
    };
  }

  /**
   * 장비선택창 Visible 설정 함수
   *
   * @param {boolean} visible 설정 플래그
   */
  setEquiSelModalVisible = (visible) => {
    this.setState({ isVisibleEquiModal: visible });
  };

  /**
   * 업체주소창 Visible 설정 함수
   *
   * @param {boolean} visible 설정 플래그
   */
  setMapAddModalVisible = (visible) => {
    this.setState({ isVisibleMapAddModal: visible });
  };

  openSelEquipmentModal = () => {
    this.setEquiSelModalVisible(true);
  };

  openMapAddModal = () => {
    this.setMapAddModalVisible(true);
  };

  completeSelEqui = (seledEuipListStr) => {
    this.setState({ equiListStr: seledEuipListStr });
  };

  /**
   * 업체등록 유효성검사 함수
   *
   * @returns result 유효검사 결과
   */
  isValidDivAccCreaSubmit = () => {
    const {
      cName, phoneNumber, password, comfirmPassword, equiListStr,
    } = this.state;

    let v = validate('textMax', cName, true, 15);
    if (!v[0]) {
      this.setState({ cNameValErrMessage: v[1] });
      return false;
    }

    v = validate('cellPhone', phoneNumber, true, 15);
    if (!v[0]) {
      this.setState({ phoneNumberValErrMessage: v[1] });
      return false;
    }

    v = validate('textMin', password, true, 6);
    if (!v[0]) {
      this.setState({ passwordValErrMessage: v[1] });
      return false;
    }

    if (password !== comfirmPassword) {
      this.setState({ comfirmPasswordValErrMessage: '비밀번호가 일치하지 않습니다' });
      return false;
    }

    v = validate('textMax', equiListStr, true, 150);
    if (!v[0]) {
      this.setState({ passwordValErrMessage: v[1] });
      return false;
    }

    return true;
  };

  render() {
    const {
      isVisibleEquiModal,
      isVisibleMapAddModal,
      equiListStr,
      cName,
      comfirmPassword,
      phoneNumber,
      password,
      cNameValErrMessage,
      phoneNumberValErrMessage,
      passwordValErrMessage,
      comfirmPasswordValErrMessage,
      equiListStrValErrMessage,
    } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.itemWrap}>
          <Text style={styles.itemTitle}>업체명*</Text>
          <TextInput
            style={styles.itemInput}
            value={cName}
            placeholder="업체명을 입력해 주세요"
            onChangeText={text => this.setState({ cName: text })}
          />
        </View>
        <View>
          <Text style={styles.errorMessage}>{cNameValErrMessage}</Text>
        </View>
        <View style={styles.itemWrap}>
          <Text style={styles.itemTitle}>전화번호*</Text>
          <TextInput
            style={styles.itemInput}
            value={phoneNumber}
            keyboardType="phone-pad"
            placeholder="전화번호를 입력해 주세요"
            onChangeText={text => this.setState({ phoneNumber: text })}
          />
        </View>
        <View>
          <Text style={styles.errorMessage}>{phoneNumberValErrMessage}</Text>
        </View>

        <View style={styles.itemWrap}>
          <Text style={styles.itemTitle}>비밀번호*</Text>
          <TextInput
            style={styles.itemInput}
            value={password}
            secureTextEntry
            placeholder="비밀번호를 입력해 주세요"
            onChangeText={text => this.setState({ password: text })}
          />
        </View>
        <View>
          <Text style={styles.errorMessage}>{passwordValErrMessage}</Text>
        </View>

        <View style={styles.itemWrap}>
          <Text style={styles.itemTitle}>비밀번호 확인*</Text>
          <TextInput
            style={styles.itemInput}
            value={comfirmPassword}
            keyboardType="phone-pad"
            secureTextEntry
            placeholder="비밀번호를 재입력해 주세요"
            onChangeText={text => this.setState({ comfirmPassword: text })}
          />
        </View>
        <View>
          <Text style={styles.errorMessage}>{comfirmPasswordValErrMessage}</Text>
        </View>

        <View style={styles.itemWrap}>
          <Text style={styles.itemTitle}>보유 장비*</Text>
          <TextInput
            style={styles.itemInput}
            value={equiListStr}
            placeholder="보유 장비를 선택해 주세요"
            onFocus={() => this.openSelEquipmentModal()}
            onChangeText={text => this.setState({ equiListStr: text })}
          />
        </View>
        <View>
          <Text style={styles.errorMessage}>{equiListStrValErrMessage}</Text>
        </View>

        <View style={styles.itemWrap}>
          <Text style={styles.itemTitle}>업체주소(고객검색시 거리계산 기준이됨)</Text>
          <TextInput
            style={styles.itemInput}
            value={equiListStr}
            placeholder="주소를 선택 해주세요"
            onFocus={() => this.openMapAddModal()}
            onChangeText={text => this.setState({ equiListStr: text })}
          />
        </View>
        <View>
          <Text style={styles.errorMessage}>{equiListStrValErrMessage}</Text>
        </View>

        <EquipementModal
          isVisibleEquiModal={isVisibleEquiModal}
          setEquiSelModalVisible={this.setEquiSelModalVisible}
          seledEquipmentStr={equiListStr}
          completeSelEqui={this.completeSelEqui}
        />
        <DaumMapAddModal
          isVisibleMapAddModal={isVisibleMapAddModal}
          setMapAddModalVisible={this.setMapAddModalVisible}
        />
      </View>
    );
  }
}
