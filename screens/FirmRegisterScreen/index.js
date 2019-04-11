import React from 'react';
import {
  Alert, KeyboardAvoidingView, ScrollView, StyleSheet, View,
} from 'react-native';
import { ImagePicker } from 'expo';
import { validate, validatePresence } from '../../utils/Validation';
import * as api from '../../api/api';
import { withLogin } from '../../contexts/LoginProvider';
import ImagePickInput from '../../components/molecules/ImagePickInput';
import JBTextInput from '../../components/molecules/JBTextInput';
import JBErrorMessage from '../../components/organisms/JBErrorMessage';
import EquipementModal from '../../components/EquipmentModal';
import MapAddWebModal from '../../components/MapAddWebModal';
import JBActIndicatorModal from '../../components/JBActIndicatorModal';
import JBButton from '../../components/molecules/JBButton';
import colors from '../../constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {},
  cardWrap: {
    flex: 1,
    backgroundColor: colors.batangLight,
    padding: 10,
  },
  card: {
    flex: 1,
    backgroundColor: colors.cardBatang,
    padding: 5,
    borderRadius: 15,
  },
  regiFormCommWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  errorMessage: {
    color: 'red',
  },
});

class FirmRegisterScreen extends React.Component {
  static navigationOptions = {
    title: '업체정보 작성',
  };

  constructor(props) {
    super(props);
    this.state = {
      isVisibleEquiModal: false,
      isVisibleMapAddModal: false,
      isVisibleActIndiModal: false,
      fname: '',
      phoneNumber: '',
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
      imgUploadingMessage: '이미지 업로드중...',
      fnameValErrMessage: '',
      phoneNumberValErrMessage: '',
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
    const { user } = this.props;

    const localPhoneNumber = user.phoneNumber.replace('+82', '0');

    this.setState({ phoneNumber: localPhoneNumber });
  };

  createFirm = async () => {
    const { navigation, user } = this.props;
    const {
      fname,
      phoneNumber,
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
    } = this.state;
    const valResult = this.isValidateSubmit();

    if (!valResult) {
      return;
    }

    if (user.uid === null || user.uid === undefined || user.uid === '') {
      Alert.alert('요효하지 않은 사용자 입니다, 로그아웃 후 사용해 주세요');
      return;
    }
    const accountId = user.uid;

    this.setState({ isVisibleActIndiModal: true, imgUploadingMessage: '대표사진 업로드중...' });
    const uploadedThumbnailImgUrl = await this.firmImageUpload(thumbnail);
    this.setState({ imgUploadingMessage: '작업사진1 업로드중...' });
    const uploadedPhoto1ImgUrl = await this.firmImageUpload(photo1);
    this.setState({ imgUploadingMessage: '작업사진2 업로드중...' });
    const uploadedPhoto2ImgUrl = await this.firmImageUpload(photo2);
    this.setState({ imgUploadingMessage: '작업사진3 업로드중...' });
    const uploadedPhoto3ImgUrl = await this.firmImageUpload(photo3);
    this.setState({ isVisibleActIndiModal: false });

    const newFirm = {
      accountId,
      fname,
      phoneNumber,
      equiListStr,
      address,
      addressDetail,
      sidoAddr,
      sigunguAddr,
      addrLongitude,
      addrLatitude,
      introduction,
      thumbnail: uploadedThumbnailImgUrl || thumbnail,
      photo1: uploadedPhoto1ImgUrl || photo1,
      photo2: uploadedPhoto2ImgUrl || photo2,
      photo3: uploadedPhoto3ImgUrl || photo3,
      blog,
      homepage,
      sns,
    };

    api
      .createFirm(newFirm)
      .then(() => navigation.navigate('FirmMyInfo', { refresh: 'Register' }))
      .catch((error) => {
        Alert.alert(
          '업체등록에 문제가 있습니다, 재 시도해 주세요.',
          `[${error.name}] ${error.message}`,
        );
      });
  };

  /**
   * 업체정보 이미지 업로드
   */
  firmImageUpload = async (imgUri) => {
    if (imgUri === null || imgUri === undefined || imgUri === '') {
      return null;
    }

    const serverImgUrl = await this.uploadImage(imgUri);

    if (serverImgUrl === undefined) {
      Alert.alert('이미지 업로드 실패');
      return undefined;
    }

    return serverImgUrl;
  };

  /**
   * 이미지 업로드 함수
   */
  uploadImage = async (imgUri) => {
    let serverImgUrl;
    await api
      .uploadImage(imgUri)
      .then((resImgUrl) => {
        serverImgUrl = resImgUrl;
      })
      .catch((error) => {
        Alert.alert(
          '이미지 업로드에 문제가 있습니다, 재 시도해 주세요.',
          `[${error.name}] ${error.message}`,
        );
        serverImgUrl = undefined;
      });

    return serverImgUrl;
  };

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
  };

  /**
   * 유효성검사 에러메세지 초기화 함수
   * (사유: 두번째 유효성검사 실패시, 이전것이 지워져있지 않음)
   */
  setInitValErroMSG = () => {
    this.setState({
      fnameValErrMessage: '',
      phoneNumberValErrMessage: '',
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
  };

  openSelEquipmentModal = () => {
    this.setEquiSelModalVisible(true);
  };

  openMapAddModal = () => {
    this.setMapAddModalVisible(true);
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
      fname,
      phoneNumber,
      equiListStr,
      address,
      addressDetail,
      thumbnail,
      photo1,
      photo2,
      photo3,
      sidoAddr,
      sigunguAddr,
      addrLongitude,
      addrLatitude,
      introduction,
      blog,
      homepage,
      sns,
    } = this.state;

    // Validation Error Massage Initialize
    this.setInitValErroMSG();

    let v = validate('textMax', fname, true, 15);
    if (!v[0]) {
      this.setState({ fnameValErrMessage: v[1] });
      return false;
    }

    v = validate('cellPhone', phoneNumber, true);
    if (!v[0]) {
      this.setState({ phoneNumberValErrMessage: v[1] });
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
    if (!v[0]) {
      this.setState({ addressValErrMessage: `[시도] ${v[1]}` });
      return false;
    }

    v = validatePresence(sigunguAddr);
    if (!v[0]) {
      this.setState({ addressValErrMessage: `[시군] ${v[1]}` });
      return false;
    }

    v = validatePresence(addrLongitude);
    if (!v[0]) {
      this.setState({ addressValErrMessage: `[경도] ${v[1]}` });
      return false;
    }

    v = validatePresence(addrLatitude);
    if (!v[0]) {
      this.setState({ addressValErrMessage: `[위도] ${v[1]}` });
      return false;
    }

    v = validate('textMax', introduction, true, 1000);
    if (!v[0]) {
      this.setState({ introductionValErrMessage: v[1] });
      return false;
    }

    v = validate('textMax', thumbnail, true, 250);
    if (!v[0]) {
      this.setState({ thumbnailValErrMessage: v[1] });
      return false;
    }

    v = validate('textMax', photo1, true, 250);
    if (!v[0]) {
      this.setState({ photo1ValErrMessage: v[1] });
      return false;
    }

    v = validate('textMax', photo2, false, 250);
    if (!v[0]) {
      this.setState({ photo2ValErrMessage: v[1] });
      return false;
    }

    v = validate('textMax', photo3, false, 250);
    if (!v[0]) {
      this.setState({ photo3ValErrMessage: v[1] });
      return false;
    }

    v = validate('textMax', blog, false, 250);
    if (!v[0]) {
      this.setState({ blogValErrMessage: v[1] });
      return false;
    }

    v = validate('textMax', homepage, false, 250);
    if (!v[0]) {
      this.setState({ homepageValErrMessage: v[1] });
      return false;
    }

    v = validate('textMax', sns, false, 250);
    if (!v[0]) {
      this.setState({ snsValErrMessage: v[1] });
      return false;
    }

    return true;
  };

  cancelFirm = () => {
    const { navigation } = this.props;

    navigation.navigate('FirmMyInfo');
  };

  render() {
    const {
      isVisibleEquiModal,
      isVisibleMapAddModal,
      isVisibleActIndiModal,
      fname,
      phoneNumber,
      equiListStr,
      address,
      addressDetail,
      introduction,
      thumbnail,
      photo1,
      photo2,
      photo3,
      blog,
      sns,
      homepage,
      imgUploadingMessage,
      fnameValErrMessage,
      phoneNumberValErrMessage,
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
        <KeyboardAvoidingView>
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={styles.cardWrap}>
              <View style={styles.card}>
                <JBTextInput
                  title="업체명*"
                  value={fname}
                  onChangeText={text => this.setState({ fname: text })}
                  placeholder="업체명을 입력해 주세요"
                  refer={(input) => {
                    this.fnameTextInput = input;
                  }}
                />
                <JBErrorMessage errorMSG={fnameValErrMessage} />

                <JBTextInput
                  title="전화번호*"
                  value={phoneNumber}
                  onChangeText={text => this.setState({ phoneNumber: text })}
                  placeholder="전화번호를 입력해 주세요"
                  keyboardType="phone-pad"
                  refer={(input) => {
                    this.telTextInput = input;
                  }}
                />
                <JBErrorMessage errorMSG={phoneNumberValErrMessage} />

                <JBTextInput
                  title="보유 장비*"
                  value={equiListStr}
                  onChangeText={text => this.setState({ equiListStr: text })}
                  onFocus={() => this.openSelEquipmentModal()}
                  placeholder="보유 장비를 선택해 주세요"
                />
                <JBErrorMessage errorMSG={equiListStrValErrMessage} />

                <JBTextInput
                  title="업체주소(고객검색시 거리계산 기준이됨)*"
                  value={address}
                  tiRefer={(input) => {
                    this.addrTextInput = input;
                  }}
                  onChangeText={text => this.setState({ address: text })}
                  onFocus={() => this.openMapAddModal()}
                  placeholder="주소를 검색해주세요"
                />
                <JBErrorMessage errorMSG={addressValErrMessage} />

                <JBTextInput
                  title="업체 상세주소"
                  value={addressDetail}
                  tiRefer={(input) => {
                    this.addrDetTextInput = input;
                  }}
                  onChangeText={text => this.setState({ addressDetail: text })}
                  placeholder="상세주소를 입력해 주세요"
                />

                <JBTextInput
                  title="업체 소개"
                  value={introduction}
                  onChangeText={text => this.setState({ introduction: text })}
                  placeholder="업체 소개를 해 주세요"
                  multiline
                  numberOfLines={5}
                />
                <JBErrorMessage errorMSG={introductionValErrMessage} />

                <ImagePickInput
                  itemTitle="대표사진*"
                  imgUrl={thumbnail}
                  aspect={[1, 1]}
                  setImageUrl={url => this.setState({ thumbnail: url })}
                />
                <JBErrorMessage errorMSG={thumbnailValErrMessage} />

                <ImagePickInput
                  itemTitle="작업사진1*"
                  imgUrl={photo1}
                  setImageUrl={url => this.setState({ photo1: url })}
                />
                <JBErrorMessage errorMSG={photo1ValErrMessage} />

                <ImagePickInput
                  itemTitle="작업사진2"
                  imgUrl={photo2}
                  setImageUrl={url => this.setState({ photo2: url })}
                />
                <JBErrorMessage errorMSG={photo2ValErrMessage} />

                <ImagePickInput
                  itemTitle="작업사진3"
                  imgUrl={photo3}
                  setImageUrl={url => this.setState({ photo3: url })}
                />
                <JBErrorMessage errorMSG={photo3ValErrMessage} />

                <JBTextInput
                  title="블로그"
                  value={blog}
                  onChangeText={text => this.setState({ blog: text })}
                  placeholder="블로그 주소를 입력해 주세요"
                />
                <JBErrorMessage errorMSG={blogValErrMessage} />

                <JBTextInput
                  title="SNG"
                  value={sns}
                  onChangeText={text => this.setState({ sns: text })}
                  placeholder="SNS 주소를(또는 카카오톡 친구추가) 입력해 주세요"
                />
                <JBErrorMessage errorMSG={snsValErrMessage} />

                <JBTextInput
                  title="홈페이지"
                  value={homepage}
                  onChangeText={text => this.setState({ homepage: text })}
                  placeholder="홈페이지 주소를 입력해 주세요"
                />
                <JBErrorMessage errorMSG={homepageValErrMessage} />
              </View>

              <View style={styles.regiFormCommWrap}>
                <JBButton
                  title="업체등록하기"
                  onPress={() => this.createFirm()}
                  size="full"
                  Primary
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <EquipementModal
          isVisibleEquiModal={isVisibleEquiModal}
          closeModal={() => this.setState({ isVisibleEquiModal: false })}
          selEquipmentStr={equiListStr}
          completeSelEqui={seledEuipListStr => this.setState({ equiListStr: seledEuipListStr })}
          nextFocus={() => this.addrTextInput.focus()}
        />
        <MapAddWebModal
          isVisibleMapAddModal={isVisibleMapAddModal}
          setMapAddModalVisible={this.setMapAddModalVisible}
          saveAddrInfo={this.saveAddrInfo}
          nextFocus={() => this.addrDetTextInput.focus()}
        />
        <JBActIndicatorModal
          isVisibleModal={isVisibleActIndiModal}
          message={imgUploadingMessage}
          size="large"
        />
      </View>
    );
  }
}

export default withLogin(FirmRegisterScreen);
