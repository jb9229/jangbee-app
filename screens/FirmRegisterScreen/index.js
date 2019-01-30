import React from 'react';
import {
  Alert, KeyboardAvoidingView, ScrollView, StyleSheet, TouchableHighlight, Text, View,
} from 'react-native';
import { ImagePicker } from 'expo';
import EquipementModal from '../../components/EquipmentModal';
import MapAddWebModal from '../../components/MapAddWebModal';
import { validate, validatePresence } from '../../utils/Validation';
import ImagePickInput from '../../components/ImagePickInput';
import FirmCreaTextInput from '../../components/FirmCreaTextInput';
import FirmCreaErrMSG from '../../components/FirmCreaErrMSG';
import * as api from '../../api/api';
import colors from '../../constants/Colors';
import fonsts from '../../constants/Fonts';


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 15,
    paddingTop: 5,
  },
  formWrap: {
    marginBottom: 10,
    borderWidth: 4,
    borderStyle: 'dashed',
    borderRadius: 1,
    borderColor: '#dfc247',
    shadowOffset: {
      width: 0,
      height: 11,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 10,
  },
  regiFormCommWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  regiTH: {
    padding: 10,
    paddingLeft: 40,
    paddingRight: 40,
    backgroundColor: colors.point,
    borderWidth: 1,
    borderColor: colors.point2,
    borderRadius: 5,
    alignItems: 'center',
  },
  regiCommText: {
    fontFamily: fonsts.buttonBig,
    fontSize: 24,
    color: colors.point2,
  },
  errorMessage: {
    color: 'red',
  },
});

export default class FirmRegisterScreen extends React.Component {
  static navigationOptions = {
    title: '업체정보 작성',
  };

  constructor(props) {
    super(props);
    this.state = {
      isVisibleEquiModal: false,
      isVisibleMapAddModal: false,
      fname: '',
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
      introduction: '',
      thumbnail: '',
      photo1: '',
      photo2: '',
      photo3: '',
      blog: '',
      homepage: '',
      sns: '',
      fnameValErrMessage: '',
      equiListStrValErrMessage: '',
      addressValErrMessage: '',
      introductionValErrMessage: '',
      thumbnailValErrMessage: '',
      photo1ValErrMessage: '',
      photo2ValErrMessage: '',
      photo3ValErrMessage: '',
      blogValErrMessage: '',
      homepageValErrMessage: '',
      snsValErrMessage: '',
    };
  }

  componentDidMount = () => {
    this.checkAccountId();
  }

  checkAccountId = () => {
    const { navigation } = this.props;
    const accountId = navigation.state.params.accountId;

    if (accountId === null || accountId === undefined || accountId === '') { Alert.alert('사용자정보가 없습니다, 로그아웃 후 이용해 주세요.'); }else{Alert.alert(accountId);}
  }

  createFirm = () => {
    const { navigation } = this.props;
    const {
      fname, equiListStr, address, addressDetail, sidoAddr,
      sigunguAddr, addrLongitude, addrLatitude, introduction, thumbnail,
      photo1, photo2, photo3, blog, homepage, sns,
    } = this.state;
    const valResult = this.isValidateSubmit();
    const { accountId } = navigation.state.params;

    if (!valResult) { return; }

    const newFirm = {
      accountId,
      fname,
      equiListStr,
      address,
      addressDetail,
      sidoAddr,
      sigunguAddr,
      addrLongitude,
      addrLatitude,
      introduction,
      thumbnail,
      photo1,
      photo2,
      photo3,
      blog,
      homepage,
      sns,
    };

    api.createFirm(newFirm)
      .then(() => navigation.navigate('HOME'))
      .catch((error) => {
        Alert.alert(
          '업체등록에 문제가 있습니다, 재 시도해 주세요.',
          `[${error.name}] ${error.message}`);
      });

    navigation.navigate('FirmMyInfo');
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
      fnameValErrMessage: '',
      // phoneNumberValErrMessage: '',
      // passwordValErrMessage: '',
      equiListStrValErrMessage: '',
      addressValErrMessage: '',
      thumbnailValErrMessage: '',
      photo1ValErrMessage: '',
      photo2ValErrMessage: '',
      photo3ValErrMessage: '',
      introductionValErrMessage: '',
      blogValErrMessage: '',
      homepageValErrMessage: '',
      snsValErrMessage: '',
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

  pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.cancelled) {
      this.handleImagePicked(result.uri);
    }
  };

  handleImagePicked = (imgUri) => {
    const { setImageUrl } = this.props;

    api
      .uploadImage(imgUri)
      .then((resImgUrl) => {
        setImageUrl(resImgUrl);

        this.setState({
          isUploaded: true,
        });
      })
      .catch((error) => {
        Alert.alert(
          '이미지 업로드에 문제가 있습니다, 재 시도해 주세요.',
          `[${error.name}] ${error.message}`,
        );

        return undefined;
      });
  };

  /**
   * 업체등록 유효성검사 함수
   *
   * @returns result 유효검사 결과
   */
  isValidateSubmit = () => {
    const {
      fname, equiListStr, address, addressDetail, thumbnail, photo1, photo2, photo3,
      sidoAddr, sigunguAddr, addrLongitude, addrLatitude, introduction, blog, homepage, sns,
    } = this.state;

    // Validation Error Massage Initialize
    this.setInitValErroMSG();

    let v = validate('textMax', fname, true, 15);
    if (!v[0]) {
      this.setState({ fnameValErrMessage: v[1] });
      return false;
    }

    v = validatePresence(equiListStr);
    if (!v[0]) {
      this.setState({ equiListStrValErrMessage: v[1] });
      this.fnameTextInput.focus();
      return false;
    }

    v = validatePresence(address);
    if (!v[0]) {
      this.setState({ addressValErrMessage: v[1] });
      return false;
    }

    v = validate('textMax', addressDetail, false, 45);
    if (!v[0]) {
      this.setState({ addressValErrMessage: `[상세주소] ${v[1]}` });
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

    v = validate('textMax', introduction, true, 1000);
    if (!v[0]) {
      this.setState({ introductionValErrMessage: v[1] });
      return false;
    }

    v = validate('textMax', thumbnail, true, 250);
    if (!v[0]) { this.setState({ thumbnailValErrMessage: v[1] }); return false; }

    v = validate('textMax', photo1, true, 250);
    if (!v[0]) { this.setState({ photo1ValErrMessage: v[1] }); return false; }

    v = validate('textMax', photo2, false, 250);
    if (!v[0]) { this.setState({ photo2ValErrMessage: v[1] }); return false; }

    v = validate('textMax', photo3, false, 250);
    if (!v[0]) { this.setState({ photo3ValErrMessage: v[1] }); return false; }

    v = validate('textMax', blog, false, 250);
    if (!v[0]) { this.setState({ blogValErrMessage: v[1] }); return false; }

    v = validate('textMax', homepage, false, 250);
    if (!v[0]) { this.setState({ homepageValErrMessage: v[1] }); return false; }

    v = validate('textMax', sns, false, 250);
    if (!v[0]) { this.setState({ snsValErrMessage: v[1] }); return false; }

    return true;
  };

  cancelFirm = () => {
    const { navigation } = this.props;

    navigation.navigate('FirmMyInfo');
  }

  render() {
    const {
      isVisibleEquiModal,
      isVisibleMapAddModal,
      fname,
      equiListStr,
      address, addressDetail,
      introduction,
      thumbnail, photo1, photo2, photo3,
      blog, sns, homepage,
      fnameValErrMessage,
      equiListStrValErrMessage,
      addressValErrMessage,
      introductionValErrMessage,
      thumbnailValErrMessage,
      photo1ValErrMessage,
      photo2ValErrMessage,
      photo3ValErrMessage,
      blogValErrMessage,
      homepageValErrMessage,
      snsValErrMessage,
    } = this.state;

    return (
      <View style={styles.container}>
        <KeyboardAvoidingView behavior="padding" enabled>
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={styles.formWrap}>
              <FirmCreaTextInput title="업체명*" value={fname} onChangeText={text => this.setState({ fname: text })} placeholder="업체명을 입력해 주세요" refer={(input) => { this.fnameTextInput = input; }}/>
              <FirmCreaErrMSG errorMSG={fnameValErrMessage} />

              {/* <FirmCreaTextInput title="전화번호*" value={phoneNumber} onChangeText={text => this.setState({ phoneNumber: text })} keyboardType="phone-pad" placeholder="전화번호를 입력해 주세요" />
              <FirmCreaErrMSG errorMSG={phoneNumberValErrMessage} />

              <FirmCreaTextInput title="비밀번호*" value={password} onChangeText={text => this.setState({ password: text })} placeholder="비밀번호를 입력해 주세요" secureTextEntry />
              <FirmCreaErrMSG errorMSG={passwordValErrMessage} />

              <FirmCreaTextInput title="비밀번호 확인*" value={comfirmPassword} onChangeText={text => this.setState({ comfirmPassword: text })} placeholder="비밀번호를 재입력해 주세요" secureTextEntry />
              <FirmCreaErrMSG errorMSG={comfirmPasswordValErrMessage} /> */}

              <FirmCreaTextInput title="보유 장비*" value={equiListStr} onChangeText={text => this.setState({ equiListStr: text })} onFocus={() => this.openSelEquipmentModal()} placeholder="보유 장비를 선택해 주세요" />
              <FirmCreaErrMSG errorMSG={equiListStrValErrMessage} />

              <FirmCreaTextInput title="업체주소(고객검색시 거리계산 기준이됨)*" value={address} onChangeText={text => this.setState({ address: text })} onFocus={() => this.openMapAddModal()} placeholder="주소를 검색해주세요" />
              <FirmCreaErrMSG errorMSG={addressValErrMessage} />

              <FirmCreaTextInput title="업체 상세주소" value={addressDetail} onChangeText={text => this.setState({ addressDetail: text })} placeholder="상세주소를 입력해 주세요" />

              <FirmCreaTextInput title="업체 소개" value={introduction} onChangeText={text => this.setState({ introduction: text })} placeholder="업체 소개를 해 주세요" multiline numberOfLines={5} />
              <FirmCreaErrMSG errorMSG={introductionValErrMessage} />

              <ImagePickInput itemTitle="대표사진*" imgUrl={thumbnail} setImageUrl={url => this.setState({ thumbnail: url })} />
              <FirmCreaErrMSG errorMSG={thumbnailValErrMessage} />

              <ImagePickInput itemTitle="작업사진1*" imgUrl={photo1} setImageUrl={url => this.setState({ photo1: url })} />
              <FirmCreaErrMSG errorMSG={photo1ValErrMessage} />

              <ImagePickInput itemTitle="작업사진2" imgUrl={photo2} setImageUrl={url => this.setState({ photo2: url })} />
              <FirmCreaErrMSG errorMSG={photo2ValErrMessage} />

              <ImagePickInput itemTitle="작업사진3" imgUrl={photo3} setImageUrl={url => this.setState({ photo3: url })} />
              <FirmCreaErrMSG errorMSG={photo3ValErrMessage} />

              <FirmCreaTextInput title="블로그" value={blog} onChangeText={text => this.setState({ blog: text })} placeholder="블로그 주소를 입력해 주세요" />
              <FirmCreaErrMSG errorMSG={blogValErrMessage} />

              <FirmCreaTextInput title="SNG" value={sns} onChangeText={text => this.setState({ sns: text })} placeholder="SNS 주소를(또는 카카오톡 친구추가) 입력해 주세요" />
              <FirmCreaErrMSG errorMSG={snsValErrMessage} />

              <FirmCreaTextInput title="홈페이지" value={homepage} onChangeText={text => this.setState({ homepage: text })} placeholder="홈페이지 주소를 입력해 주세요" />
              <FirmCreaErrMSG errorMSG={homepageValErrMessage} />
            </View>

            <View style={styles.regiFormCommWrap}>
              <TouchableHighlight onPress={() => this.cancelFirm()} style={styles.regiTH}>
                <Text style={styles.regiCommText}>취소</Text>
              </TouchableHighlight>
              <TouchableHighlight onPress={() => this.createFirm()} style={styles.regiTH}>
                <Text style={styles.regiCommText}>저장</Text>
              </TouchableHighlight>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
