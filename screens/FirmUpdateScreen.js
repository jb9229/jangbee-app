// @flow
import React from 'react';
import {
  Alert, ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView, StyleSheet,
  Text, View,
} from 'react-native';
import EquipementModal from '../components/EquipmentModal';
import MapAddWebModal from '../components/MapAddWebModal';
import { validate, validatePresence } from '../utils/Validation';
import ImagePickInput from '../components/ImagePickInput';
import FirmCreaTextInput from '../components/FirmCreaTextInput';
import FirmCreaErrMSG from '../components/FirmCreaErrMSG';
import * as api from '../api/api';
import JBButton from '../components/molecules/JBButton';
import { withLogin } from '../contexts/LoginProvider';
import JBActIndicatorModal from '../components/JBActIndicatorModal';
import colors from '../constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
  },
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

type Props = {

}
type State = {
  preThumbnail: string, prePhoto1: string, prePhoto2: string, prePhoto3: string,
}
class FirmUpdateScreen extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingComplete: false,
      id: undefined,
      isVisibleEquiModal: false,
      isVisibleMapAddModal: false,
      isVisibleActIndiModal: false,
      fname: '',
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
    this.setMyFirmInfo();
  };

  setMyFirmInfo = () => {
    const { user } = this.props;

    api
      .getFirm(user.uid)
      .then(res => res.json())
      .then((firm) => {
        this.setUpdateFirmData(firm);
        this.setState({ isLoadingComplete: true });
      })
      .catch((error) => {
        this.setState({ isLoadingComplete: true });
        Alert.alert(
          `내 업체정보 요청에 문제가 있습니다, 다시 시도해 주세요\n[${error.name}] ${
            error.message
          }`,
        );
      });
  };

  updateFirm = async () => {
    const { navigation, user } = this.props;
    const {
      id,
      fname,
      equiListStr,
      address,
      addressDetail,
      sidoAddr,
      sigunguAddr,
      addrLongitude,
      addrLatitude,
      introduction,
      thumbnail, photo1, photo2, photo3,
      blog,
      homepage,
      sns,
      preThumbnail, prePhoto1, prePhoto2, prePhoto3,
    } = this.state;
    const valResult = this.isValidateSubmit();

    if (!valResult) {
      return;
    }

    this.setState({ isVisibleActIndiModal: true, imgUploadingMessage: '대표사진 업로드중...' });
    const uploadedThumbnailImgUrl = await this.firmImageUpload(thumbnail, preThumbnail);
    this.setState({ imgUploadingMessage: '작업사진1 업로드중...' });
    const uploadedPhoto1ImgUrl = await this.firmImageUpload(photo1, prePhoto1);
    this.setState({ imgUploadingMessage: '작업사진2 업로드중...' });
    const uploadedPhoto2ImgUrl = await this.firmImageUpload(photo2, prePhoto2);
    this.setState({ imgUploadingMessage: '작업사진3 업로드중...' });
    const uploadedPhoto3ImgUrl = await this.firmImageUpload(photo3, prePhoto3);
    this.setState({ isVisibleActIndiModal: false });

    const updateFirm = {
      id,
      accountId: user.uid,
      fname,
      equiListStr,
      address,
      addressDetail,
      sidoAddr,
      sigunguAddr,
      addrLongitude,
      addrLatitude,
      introduction,
      thumbnail: uploadedThumbnailImgUrl ? uploadedThumbnailImgUrl : thumbnail,
      photo1: uploadedPhoto1ImgUrl ? uploadedPhoto1ImgUrl: photo1,
      photo2: uploadedPhoto2ImgUrl ? uploadedPhoto2ImgUrl: photo2,
      photo3: uploadedPhoto3ImgUrl ? uploadedPhoto3ImgUrl: photo3,
      blog,
      homepage,
      sns,
    };

    api
      .updateFirm(updateFirm)
      .then(() => navigation.navigate('FirmMyInfo', { refresh: 'update' }))
      .catch((error) => {
        Alert.alert(
          '업체정보 수정에 문제가 있습니다, 재 시도해 주세요.',
          `[${error.name}] ${error.message}`,
        );
      });
  };

  /**
   * 업체정보 이미지 업로드
   */
  firmImageUpload = async (imgUri, preImg) => {
    // No change
    if (imgUri === preImg) { return null; }

    // Current Image Delete and New Image Null
    if (preImg !== '' && preImg !== undefined) {
      console.log(`preImg delete: ${imgUri} / ${preImg}`);
      const result = await this.removeFirmImage(preImg);
      if (!result) { return undefined; }
    }

    // Current image null, new image upload
    if (imgUri !== null && imgUri !== '') {
      const serverImgUrl = await this.uploadImage(imgUri);

      if (serverImgUrl === undefined) { Alert.alert('이미지 업로드 실패'); return undefined; }

      return serverImgUrl;
    }

    return null;
  }

  /**
   * 이미지 업로드 함수
   */
  uploadImage = async (imgUri) => {
    let serverImgUrl;
    await api.uploadImage(imgUri)
      .then((resImgUrl) => { serverImgUrl = resImgUrl; })
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
   * 이미지 삭제 함수
   */
  removeFirmImage = async (imgUri) => {
    let result;
    await api.removeImage(imgUri)
      .then((res) => { result = res; })
      .catch((error) => {
        Alert.alert(
          '이미지 삭제에 문제가 있습니다, 재 시도해 주세요.',
          `[${error.name}] ${error.message}`,
        );
        result = false;
      });
console.log(`image delete result: ${result}`)
    return result;
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
  };

  openSelEquipmentModal = () => {
    this.setEquiSelModalVisible(true);
  };

  openMapAddModal = () => {
    this.setMapAddModalVisible(true);
  };

  /**
   * 업체등록 유효성검사 함수
   *
   * @returns result 유효검사 결과
   */
  isValidateSubmit = () => {
    const {
      fname,
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

  setUpdateFirmData = (firm) => {
    this.setState({
      id: firm.id,
      fname: firm.fname,
      equiListStr: firm.equiListStr,
      address: firm.address,
      addressDetail: firm.addressDetail,
      sidoAddr: firm.sidoAddr,
      sigunguAddr: firm.sigunguAddr,
      addrLongitude: firm.addrLongitude,
      addrLatitude: firm.addrLatitude,
      introduction: firm.introduction,
      thumbnail: firm.thumbnail,
      photo1: firm.photo1,
      photo2: firm.photo2,
      photo3: firm.photo3,
      preThumbnail: firm.thumbnail, prePhoto1: firm.photo1, prePhoto2: firm.photo2, prePhoto3: firm.photo3,
      blog: firm.blog,
      homepage: firm.homepage,
      sns: firm.sns,
    });
  };

  render() {
    const {
      isLoadingComplete,
      isVisibleEquiModal, isVisibleMapAddModal, isVisibleActIndiModal,
      fname,
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
      homepage,prePhoto1,prePhoto2,
      imgUploadingMessage, fnameValErrMessage, equiListStrValErrMessage,
      addressValErrMessage, introductionValErrMessage, thumbnailValErrMessage,
      photo1ValErrMessage, photo2ValErrMessage, photo3ValErrMessage,
      blogValErrMessage, homepageValErrMessage, snsValErrMessage,
    } = this.state;

    if (!isLoadingComplete) {
      return (
        <View style={styles.container}>
          <Text>업체정보 불러오는중...</Text>
          <ActivityIndicator size="large" color={colors.indicator} />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView behavior="padding" enabled>
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={styles.cardWrap}>
              <View style={styles.card}>
                <FirmCreaTextInput
                  title="업체명*"
                  value={fname}
                  onChangeText={text => this.setState({ fname: text })}
                  placeholder="업체명을 입력해 주세요"
                  refer={(input) => {
                    this.fnameTextInput = input;
                  }}
                />
                <FirmCreaErrMSG errorMSG={fnameValErrMessage} />

                <FirmCreaTextInput
                  title="보유 장비*"
                  value={equiListStr}
                  onChangeText={text => this.setState({ equiListStr: text })}
                  onFocus={() => this.openSelEquipmentModal()}
                  placeholder="보유 장비를 선택해 주세요"
                />
                <FirmCreaErrMSG errorMSG={equiListStrValErrMessage} />

                <FirmCreaTextInput
                  title="업체주소(고객검색시 거리계산 기준이됨)*"
                  value={address}
                  tiRefer={(input) => { this.addrTextInput = input; }}
                  onChangeText={text => this.setState({ address: text })}
                  onFocus={() => this.openMapAddModal()}
                  placeholder="주소를 검색해주세요"
                />
                <FirmCreaErrMSG errorMSG={addressValErrMessage} />

                <FirmCreaTextInput
                  title="업체 상세주소"
                  value={addressDetail}
                  tiRefer={(input) => { this.addrDetTextInput = input; }}
                  onChangeText={text => this.setState({ addressDetail: text })}
                  placeholder="상세주소를 입력해 주세요"
                />

                <FirmCreaTextInput
                  title="업체 소개"
                  value={introduction}
                  onChangeText={text => this.setState({ introduction: text })}
                  placeholder="업체 소개를 해 주세요"
                  multiline
                  numberOfLines={5}
                />
                <FirmCreaErrMSG errorMSG={introductionValErrMessage} />

                <ImagePickInput
                  itemTitle="대표사진*"
                  imgUrl={thumbnail}
                  aspect={[1, 1]}
                  setImageUrl={url => this.setState({ thumbnail: url })}
                />
                <FirmCreaErrMSG errorMSG={thumbnailValErrMessage} />

                <ImagePickInput
                  itemTitle="작업사진1*"
                  imgUrl={photo1}
                  setImageUrl={url => this.setState({ photo1: url })}
                />
                <FirmCreaErrMSG errorMSG={photo1ValErrMessage} />

                <ImagePickInput
                  itemTitle="작업사진2"
                  imgUrl={photo2}
                  setImageUrl={url => this.setState({ photo2: url })}
                />
                <FirmCreaErrMSG errorMSG={photo2ValErrMessage} />

                <ImagePickInput
                  itemTitle="작업사진3"
                  imgUrl={photo3}
                  setImageUrl={url => this.setState({ photo3: url })}
                />
                <FirmCreaErrMSG errorMSG={photo3ValErrMessage} />

                <FirmCreaTextInput
                  title="블로그"
                  value={blog}
                  onChangeText={text => this.setState({ blog: text })}
                  placeholder="블로그 주소를 입력해 주세요"
                />
                <FirmCreaErrMSG errorMSG={blogValErrMessage} />

                <FirmCreaTextInput
                  title="SNG"
                  value={sns}
                  onChangeText={text => this.setState({ sns: text })}
                  placeholder="SNS 주소를(또는 카카오톡 친구추가) 입력해 주세요"
                />
                <FirmCreaErrMSG errorMSG={snsValErrMessage} />

                <FirmCreaTextInput
                  title="홈페이지"
                  value={homepage}
                  onChangeText={text => this.setState({ homepage: text })}
                  placeholder="홈페이지 주소를 입력해 주세요"
                />
                <FirmCreaErrMSG errorMSG={homepageValErrMessage} />
              </View>

              <View style={styles.regiFormCommWrap}>
                <JBButton title="업체정보 수정하기" onPress={() => this.updateFirm()} />
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
        <JBActIndicatorModal isVisibleModal={isVisibleActIndiModal} message={imgUploadingMessage} size="large" />
      </View>
    );
  }
}

export default withLogin(FirmUpdateScreen);
