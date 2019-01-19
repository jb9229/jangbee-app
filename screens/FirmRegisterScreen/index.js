import React from 'react';
import {
  Alert, Button, StyleSheet, Text, TextInput, View,
} from 'react-native';
import EquipementModal from '../../components/EquipmentModal';
import MapAddWebModal from '../../components/MapAddWebModal';
import { validate, validatePresence } from '../../utils/Validation';
import ImagePickInput from '../../components/ImagePickInput';
import FirmCreaTextInput from '../../components/FirmCreaTextInput';
import FirmCreaErrMSG from '../../components/FirmCreaErrMSG';
import * as api from '../../api/api';


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorMessage: {
    color: 'red',
  },
});

export default class FirmRegisterScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleEquiModal: false,
      isVisibleMapAddModal: false,
      fName: '',
      // phoneNumber: '',
      // password: '',
      // comfirmPassword: '',
      equiListStr: '',
      address: '',
      addressDetail: '',
      sidoAddr: '',
      sigunguAddr: '',
      addrLongitude: undefined,
      addrLatitude: undefined,
      fIntroduction: '',
      thumbnail: '',
      photo1: '',
      photo2: '',
      photo3: '',
      blog: '',
      homepage: '',
      sns: '',
      fNameValErrMessage: '',
      phoneNumberValErrMessage: '',
      passwordValErrMessage: '',
      comfirmPasswordValErrMessage: '',
      equiListStrValErrMessage: '',
      addressValErrMessage: '',
      thumbnailValErrMessage: '',
      photo1ValErrMessage: '',
    };
  }

  createFirm = () => {
    const { navigation } = this.props;
    const valResult = this.isValidateSubmit();

    if (!valResult) { return; }

    api.createFirm()
      .then(() => navigation.navigate('HOME'))
      .catch((error) => {
        Alert.alert(
          '장비명 조회에 문제가 있습니다, 재 시도해 주세요.',
          `[${error.name}] ${error.message}`);
      });
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

  /**
   * 유효성검사 에러메세지 초기화 함수
   * (사유: 두번째 유효성검사 실패시, 이전것이 지워져있지 않음)
   */
  setInitValErroMSG = () => {
    this.setState({
      fNameValErrMessage: '',
      // phoneNumberValErrMessage: '',
      // passwordValErrMessage: '',
      comfirmPasswordValErrMessage: '',
      equiListStrValErrMessage: '',
      addressValErrMessage: '',
      thumbnailValErrMessage: '',
      photo1ValErrMessage: '',
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
  isValidateSubmit = () => {
    const {
      fName, equiListStr, address, thumbnail, photo1,
      sidoAddr, sigunguAddr, addrLongitude, addrLatitude,
    } = this.state;

    // Validation Error Massage Initialize
    this.setInitValErroMSG();

    let v = validate('textMax', fName, true, 15);
    if (!v[0]) {
      this.setState({ fNameValErrMessage: v[1] });
      return false;
    }

    // v = validate('cellPhone', phoneNumber, true, 15);
    // if (!v[0]) {
    //   this.setState({ phoneNumberValErrMessage: v[1] });
    //   return false;
    // }

    // v = validate('textMin', password, true, 6);
    // if (!v[0]) {
    //   this.setState({ passwordValErrMessage: v[1] });
    //   return false;
    // }

    // if (password !== comfirmPassword) {
    //   this.setState({ comfirmPasswordValErrMessage: '비밀번호가 일치하지 않습니다' });
    //   return false;
    // }

    v = validatePresence(equiListStr);
    if (!v[0]) {
      this.setState({ equiListStrValErrMessage: v[1] });
      return false;
    }

    v = validatePresence(address);
    if (!v[0]) {
      this.setState({ addressValErrMessage: v[1] });
      return false;
    }

    v = validatePresence(sidoAddr);
    if (!v[0]) { this.setState({ addressValErrMessage: `[시도] ${v[1]}` }); return false; }

    v = validatePresence(sigunguAddr);
    if (!v[0]) { this.setState({ addressValErrMessage: `[시군] ${v[1]}` }); return false; }

    v = validatePresence(addrLongitude);
    if (!v[0]) { this.setState({ addressValErrMessage: `[경도] ${v[1]}` }); return false; }

    v = validatePresence(addrLatitude);
    if (!v[0]) { this.setState({ addressValErrMessage: `[위도] ${v[1]}` }); return false; }

    v = validatePresence(thumbnail);
    if (!v[0]) { this.setState({ thumbnailValErrMessage: v[1] }); return false; }

    v = validatePresence(photo1);
    if (!v[0]) { this.setState({ photo1ValErrMessage: v[1] }); return false; }

    return true;
  };

  render() {
    const {
      isVisibleEquiModal,
      isVisibleMapAddModal,
      fName,
      equiListStr,
      address, addressDetail,
      fIntroduction,
      thumbnail, photo1, photo2, photo3,
      blog, sns, homepage,
      fNameValErrMessage,
      phoneNumberValErrMessage,
      passwordValErrMessage,
      comfirmPasswordValErrMessage,
      equiListStrValErrMessage,
      addressValErrMessage,
      thumbnailValErrMessage,
      photo1ValErrMessage,
    } = this.state;

    return (
      <View style={styles.container}>
        <FirmCreaTextInput title="업체명*" value={fName} onChangeText={text => this.setState({ fName: text })} placeholder="업체명을 입력해 주세요" />
        <FirmCreaErrMSG errorMSG={fNameValErrMessage} />

        {/* <FirmCreaTextInput title="전화번호*" value={phoneNumber} onChangeText={text => this.setState({ phoneNumber: text })} keyboardType="phone-pad" placeholder="전화번호를 입력해 주세요" />
        <FirmCreaErrMSG errorMSG={phoneNumberValErrMessage} />

        <FirmCreaTextInput title="비밀번호*" value={password} onChangeText={text => this.setState({ password: text })} placeholder="비밀번호를 입력해 주세요" secureTextEntry />
        <FirmCreaErrMSG errorMSG={passwordValErrMessage} />

        <FirmCreaTextInput title="비밀번호 확인*" value={comfirmPassword} onChangeText={text => this.setState({ comfirmPassword: text })} placeholder="비밀번호를 재입력해 주세요" secureTextEntry />
        <FirmCreaErrMSG errorMSG={comfirmPasswordValErrMessage} /> */}

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

        <FirmCreaTextInput title="업체 상세주소" value={addressDetail} onChangeText={text => this.setState({ addressDetail: text })} placeholder="상세주소를 입력해 주세요" />

        <View style={styles.itemWrap}>
          <Text style={styles.itemTitle}>업체 소개</Text>
          <TextInput
            style={styles.itemInput}
            multiline
            numberOfLines={5}
            value={fIntroduction}
            placeholder="업체 소개를 해 주세요"
            onChangeText={text => this.setState({ fIntroduction: text })}
          />
        </View>

        <ImagePickInput itemTitle="대표사진*" imgUrl={thumbnail} setImageUrl={url => this.setState({ thumbnail: url })} itemWrapStyle={this.itemWrap} />
        <FirmCreaErrMSG errorMSG={thumbnailValErrMessage} />

        <ImagePickInput itemTitle="작업사진1*" imgUrl={photo1} setImageUrl={url => this.setState({ photo1: url })} itemWrapStyle={this.itemWrap} />
        <FirmCreaErrMSG errorMSG={photo1ValErrMessage} />

        <ImagePickInput itemTitle="작업사진2" imgUrl={photo2} setImageUrl={url => this.setState({ photo2: url })} itemWrapStyle={this.itemWrap} />

        <ImagePickInput itemTitle="작업사진3" imgUrl={photo3} setImageUrl={url => this.setState({ photo3: url })} itemWrapStyle={this.itemWrap} />

        <FirmCreaTextInput title="블로그" value={blog} onChangeText={text => this.setState({ blog: text })} placeholder="블로그 주소를 입력해 주세요" />
        <FirmCreaTextInput title="SNG" value={sns} onChangeText={text => this.setState({ sns: text })} placeholder="SNS 주소를(또는 카카오톡 친구추가) 입력해 주세요" />
        <FirmCreaTextInput title="홈페이지" value={homepage} onChangeText={text => this.setState({ homepage: text })} placeholder="홈페이지 주소를 입력해 주세요" />

        <View>
          <Button title="저장" onPress={() => this.createFirm()} />
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
