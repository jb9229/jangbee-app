import React from 'react';
import {
  Button, StyleSheet, Text, ImagePicker, TextInput, View,
} from 'react-native';
import EquipementModal from '../../components/EquipmentModal';
import MapAddWebModal from '../../components/MapAddWebModal';
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
      fName: '',
      phoneNumber: '',
      password: '',
      comfirmPassword: '',
      equiListStr: '',
      address: '',
      addressDetail: '',
      sidoAddr: '',
      sigunguAddr: '',
      dongriAddr: '',
      addrLongitude: '',
      addrLatitude: '',
      fIntroduction: '',
      photo1: '',
      photo2: '',
      photo3: '',
      photo4: '',
      photo5: '',
      homepage: '',
      blog: '',
      sns: '',
      fNameValErrMessage: '',
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

  /**
   * 웹에서 받은 주소정보 기입 함수
   */
  saveAddrInfo = (addrData) => {
    this.setState({
      address: addrData.address,
      sidoAddr: addrData.sidoAddr,
      sigunguAddr: addrData.sigunguAddr,
      addrLongitude: addrData.addrLongitude,
      addrLatitude: addrData.addrLatitude,

    });
  }

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
      this.setState({ fNameValErrMessage: v[1] });
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
      fName,
      comfirmPassword,
      phoneNumber,
      password,
      address,
      addressDetail,
      fIntroduction,
      fNameValErrMessage,
      phoneNumberValErrMessage,
      passwordValErrMessage,
      comfirmPasswordValErrMessage,
      equiListStrValErrMessage,
      addressValErrMessage,
    } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.itemWrap}>
          <Text style={styles.itemTitle}>업체명*</Text>
          <TextInput
            style={styles.itemInput}
            value={fName}
            placeholder="업체명을 입력해 주세요"
            onChangeText={text => this.setState({ fName: text })}
          />
        </View>
        <View>
          <Text style={styles.errorMessage}>{fNameValErrMessage}</Text>
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
            value={address}
            placeholder="주소를 선택 해주세요"
            onFocus={() => this.openMapAddModal()}
            onChangeText={text => this.setState({ address: text })}
          />
        </View>
        <View>
          <Text style={styles.errorMessage}>{addressValErrMessage}</Text>
        </View>

        <View style={styles.itemWrap}>
          <Text style={styles.itemTitle}>업체 상세주소</Text>
          <TextInput
            style={styles.itemInput}
            value={addressDetail}
            placeholder="상세주소를 입력해 주세요"
            onChangeText={text => this.setState({ addressDetail: text })}
          />
        </View>

        <View style={styles.itemWrap}>
          <Text style={styles.itemTitle}>업체 소개</Text>
          <TextInput
            style={styles.itemInput}
            multiline={true}
            numberOfLines={5}
            value={fIntroduction}
            placeholder="업체 소개를 해 주세요"
            onChangeText={text => this.setState({ fIntroduction: text })}
          />
        </View>
        <View>
          <Button primary onPress={() => this._pickImage(LOCATION_LIVINGROOM)} >
              <Text>대표사진(검색리스트 작은사진)</Text>
          </Button>

          {this.state.isLoadLrPhoto ? (<Text> {this.state.photoData.lrPhoto} </Text>) : null}
        </View>
        <View>
          <Button primary onPress={() => this._pickImage(LOCATION_LIVINGROOM)} >
              <Text>작업사진1</Text>
          </Button>

          {this.state.isLoadLrPhoto ? (<Text> {this.state.photoData.lrPhoto} </Text>) : null}
        </View>

        <EquipementModal
          isVisibleEquiModal={isVisibleEquiModal}
          setEquiSelModalVisible={this.setEquiSelModalVisible}
          seledEquipmentStr={equiListStr}
          completeSelEqui={this.completeSelEqui}
        />
        <MapAddWebModal
          isVisibleMapAddModal={isVisibleMapAddModal}
          setMapAddModalVisible={this.setMapAddModalVisible}
          saveAddrInfo={this.saveAddrInfo}
        />
      </View>
    );
  }
}
