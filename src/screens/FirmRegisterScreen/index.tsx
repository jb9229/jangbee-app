import * as api from 'api/api';
import * as imageManager from 'common/ImageManager';

import {
  Alert,
  KeyboardAvoidingView,
  Picker,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { validate, validatePresence } from 'utils/Validation';

import Card from 'molecules/CardUI';
import { DefaultNavigationProps } from 'src/types';
import EquipementModal from 'templates/EquipmentModal';
import ImagePickInput from 'molecules/ImagePickInput';
import JBActIndicatorModal from 'templates/JBActIndicatorModal';
import JBButton from 'molecules/JBButton';
import JBErrorMessage from 'organisms/JBErrorMessage';
import JBPicker from 'molecules/JBPicker';
import JBTextInput from 'molecules/JBTextInput';
import LocalSelModal from 'templates/LocalSelModal';
import MapAddWebModal from 'templates/MapAddWebModal';
import React from 'react';
import { useLoginProvider } from 'src/contexts/LoginProvider';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {},
  equiWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  regiFormCommWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  errorMessage: {
    color: 'red'
  }
});

const initialState: State = {
  createAdDto: new CreateAdDto(),
  createAdError: new CreateAdDtoError()
};

interface Props {
  navigation: DefaultNavigationProps;
}

const FirmRegisterScreen = (props) =>
{
  const { user } = useLoginProvider();
  const [isVisibleEquiModal, setVisibleEquiModal] = React.useState(false);
  const [isVisibleMapAddModal, setVisibleMapAddModal] = React.useState(false);
  const [isVisibleActIndiModal, setVisibleActIndiModal] = React.useState(false);
  const [isVisibleLocalModal, setVisibleLocalModal] = React.useState(false);
  const [fname, setFname] = React.useState(false);
  const [phoneNumber, setPhoneNumber] = React.useState(false);
  const [equiListStr, setEquiListStr] = React.useState(false);
  const [modelYear, setModelYear] = React.useState(false);
  const [address, setAddress] = React.useState(false);

  //     addressDetail: '',
  //     sidoAddr: '',
  //     sigunguAddr: '',
  //     addrLongitude: undefined,
  //     addrLatitude: undefined,
  //     workAlarmSido: '',
  //     workAlarmSigungu: '',
  //     introduction: '',
  //     thumbnail: '',
  //     photo1: '',
  //     photo2: '',
  //     photo3: '',
  //     blog: '',
  //     homepage: '',
  //     sns: '',
  //     imgUploadingMessage: '이미지 업로드중...',
  //     fnameValErrMessage: '',
  //     phoneNumberValErrMessage: '',
  //     equiListStrValErrMessage: '',
  //     addressValErrMessage: '',
  //     addressDetailValErrMessage: '',
  //     introductionValErrMessage: '',
  //     thumbnailValErrMessage: '',
  //     photo1ValErrMessage: '',
  //     photo2ValErrMessage: '',
  //     photo3ValErrMessage: '',
  //     blogValErrMessage: '',
  //     homepageValErrMessage: '',
  //     snsValErrMessage: ''
  //   };
  // }

  React.useEffect(() =>
  {
    const localPhoneNumber = user.phoneNumber.replace('+82', '0');

    this.setState({ phoneNumber: localPhoneNumber });
  }, []);

  const createFirm = async () =>
  {
    const valResult = this.isValidateSubmit();

    if (!valResult)
    {
      return;
    }

    if (user.uid === null || user.uid === undefined || user.uid === '')
    {
      Alert.alert('요효하지 않은 사용자 입니다, 로그아웃 후 사용해 주세요');
      return;
    }
    const accountId = user.uid;

    this.setState({
      isVisibleActIndiModal: true,
      imgUploadingMessage: '대표사진 업로드중...'
    });
    const uploadedThumbnailImgUrl = await imageManager.uploadImage(thumbnail);
    this.setState({ imgUploadingMessage: '작업사진1 업로드중...' });
    const uploadedPhoto1ImgUrl = await imageManager.uploadImage(photo1);
    this.setState({ imgUploadingMessage: '작업사진2 업로드중...' });
    const uploadedPhoto2ImgUrl = await imageManager.uploadImage(photo2);
    this.setState({ imgUploadingMessage: '작업사진3 업로드중...' });
    const uploadedPhoto3ImgUrl = await imageManager.uploadImage(photo3);
    this.setState({ isVisibleActIndiModal: false });

    const newFirm = {
      accountId,
      fname,
      phoneNumber,
      equiListStr,
      modelYear,
      address,
      addressDetail,
      sidoAddr,
      sigunguAddr,
      addrLongitude,
      addrLatitude,
      workAlarmSido,
      workAlarmSigungu,
      introduction,
      thumbnail: uploadedThumbnailImgUrl,
      photo1: uploadedPhoto1ImgUrl,
      photo2: uploadedPhoto2ImgUrl,
      photo3: uploadedPhoto3ImgUrl,
      blog,
      homepage,
      sns
    };

    api
      .createFirm(newFirm)
      .then(() => props.navigation.navigate('FirmMyInfo', { refresh: 'Register' }))
      .catch(error =>
      {
        Alert.alert(
          '업체등록에 문제가 있습니다, 재 시도해 주세요.',
          `[${error.name}] ${error.message}`
        );
      });
  };

  /**
   * 장비선택창 Visible 설정 함수
   *
   * @param {boolean} visible 설정 플래그
   */
  const setEquiSelModalVisible = (visible) =>
  {
    this.setState({ isVisibleEquiModal: visible });
  };

  /**
   * 업체주소창 Visible 설정 함수
   *
   * @param {boolean} visible 설정 플래그
   */
  const setMapAddModalVisible = (visible): void =>
  {
    setVisibleMapAddModal(visible);
  };

  /**
   * 웹에서 받은 주소정보 기입 함수
   */
  const saveAddrInfo = (addrData): void =>
  {
    this.setState({
      address: addrData.address,
      sidoAddr: addrData.sidoAddr,
      sigunguAddr: addrData.sigunguAddr,
      addrLongitude: addrData.addrLongitude,
      addrLatitude: addrData.addrLatitude
    });
  };

  /**
   * 유효성검사 에러메세지 초기화 함수
   * (사유: 두번째 유효성검사 실패시, 이전것이 지워져있지 않음)
   */
  const setInitValErroMSG = (): void =>
  {
    this.setState({
      fnameValErrMessage: '',
      phoneNumberValErrMessage: '',
      equiListStrValErrMessage: '',
      addressValErrMessage: '',
      addressDetailValErrMessage: '',
      thumbnailValErrMessage: '',
      photo1ValErrMessage: '',
      photo2ValErrMessage: '',
      photo3ValErrMessage: '',
      workAlarmValErrMessage: '',
      introductionValErrMessage: '',
      blogValErrMessage: '',
      homepageValErrMessage: '',
      snsValErrMessage: ''
    });
  };

  const openSelEquipmentModal = (): void =>
  {
    setEquiSelModalVisible(true);
  };

  const openMapAddModal = (): void =>
  {
    setMapAddModalVisible(true);
  };

  /**
   * 업체등록 유효성검사 함수
   *
   * @returns result 유효검사 결과
   */
  const isValidateSubmit = (): boolean =>
  {
    // Validation Error Massage Initialize
    this.setInitValErroMSG();

    let v = validate('textMax', fname, true, 15);
    if (!v[0])
    {
      this.setState({ fnameValErrMessage: v[1] });
      Alert.alert('[업체명] 다시 확인해 주세요!', v[1]);
      return false;
    }

    v = validate('cellPhone', phoneNumber, true);
    if (!v[0])
    {
      this.setState({ phoneNumberValErrMessage: v[1] });
      Alert.alert('[전화번호] 다시 확인해 주세요!', v[1]);
      return false;
    }

    v = validatePresence(equiListStr);
    if (!v[0])
    {
      this.setState({ equiListStrValErrMessage: v[1] });
      Alert.alert('[선택 장비] 다시 확인해 주세요!', v[1]);
      this.fnameTextInput.focus();
      return false;
    }

    v = validatePresence(modelYear);
    if (!v[0])
    {
      this.setState({ equiListStrValErrMessage: v[1] });
      Alert.alert('[장비 년식] 다시 확인해 주세요!', v[1]);
      return false;
    }

    v = validatePresence(address);
    if (!v[0])
    {
      this.setState({ addressValErrMessage: v[1] });
      Alert.alert('[장비 년식] 다시 확인해 주세요!', v[1]);
      return false;
    }

    v = validate('textMax', addressDetail, false, 45);
    if (!v[0])
    {
      this.setState({ addressDetailValErrMessage: `[상세주소] ${v[1]}` });
      Alert.alert('[상세주소] 다시 확인해 주세요!', v[1]);
      return false;
    }

    v = validatePresence(sidoAddr);
    if (!v[0])
    {
      this.setState({ addressValErrMessage: `[시도] ${v[1]}` });
      Alert.alert('[주소 선택] 다시 확인해 주세요!', v[1]);
      return false;
    }

    v = validatePresence(sigunguAddr);
    if (!v[0])
    {
      this.setState({ addressValErrMessage: `[시군] ${v[1]}` });
      Alert.alert('[주소 선택] 다시 확인해 주세요!', v[1]);
      return false;
    }

    v = validatePresence(addrLongitude);
    if (!v[0])
    {
      this.setState({ addressValErrMessage: `[경도] ${v[1]}` });
      Alert.alert('[주소 선택] 다시 확인해 주세요!', v[1]);
      return false;
    }

    v = validatePresence(addrLatitude);
    if (!v[0])
    {
      this.setState({ addressValErrMessage: `[위도] ${v[1]}` });
      Alert.alert('[주소 선택] 다시 확인해 주세요!', v[1]);
      return false;
    }

    if (!workAlarmSido && !workAlarmSigungu)
    {
      this.setState({
        workAlarmValErrMessage: '일감알람을 받을 지역을 선택해 주세요'
      });
      Alert.alert('[일감 알람지역] 다시 확인해 주세요!', v[1]);
      return false;
    }

    v = validate('textMax', workAlarmSido, false, 100);
    if (!v[0])
    {
      this.setState({ workAlarmValErrMessage: v[1] });
      Alert.alert('[일감 알람지역] 다시 확인해 주세요!', v[1]);
      return false;
    }

    v = validate('textMax', workAlarmSigungu, false, 300);
    if (!v[0])
    {
      this.setState({ workAlarmValErrMessage: v[1] });
      Alert.alert('[일감 알람지역] 다시 확인해 주세요!', v[1]);
      return false;
    }

    v = validate('textMax', introduction, true, 1000);
    if (!v[0])
    {
      this.setState({ introductionValErrMessage: v[1] });
      Alert.alert('[업체 소개] 다시 확인해 주세요!', v[1]);
      return false;
    }

    v = validate('textMax', thumbnail, true, 250);
    if (!v[0])
    {
      this.setState({ thumbnailValErrMessage: v[1] });
      Alert.alert('[대표사진] 다시 확인해 주세요!', v[1]);
      return false;
    }

    v = validate('textMax', photo1, true, 250);
    if (!v[0])
    {
      this.setState({ photo1ValErrMessage: v[1] });
      Alert.alert('[작업사진 1] 다시 확인해 주세요!', v[1]);
      return false;
    }

    v = validate('textMax', photo2, false, 250);
    if (!v[0])
    {
      this.setState({ photo2ValErrMessage: v[1] });
      Alert.alert('[작업사진 2] 다시 확인해 주세요!', v[1]);
      return false;
    }

    v = validate('textMax', photo3, false, 250);
    if (!v[0])
    {
      this.setState({ photo3ValErrMessage: v[1] });
      Alert.alert('[작업사진 3] 다시 확인해 주세요!', v[1]);
      return false;
    }

    v = validate('textMax', blog, false, 250);
    if (!v[0])
    {
      this.setState({ blogValErrMessage: v[1] });
      Alert.alert('[블로그] 다시 확인해 주세요!', v[1]);
      return false;
    }

    v = validate('textMax', homepage, false, 250);
    if (!v[0])
    {
      this.setState({ homepageValErrMessage: v[1] });
      Alert.alert('[홈페이지] 다시 확인해 주세요!', v[1]);
      return false;
    }

    v = validate('textMax', sns, false, 250);
    if (!v[0])
    {
      this.setState({ snsValErrMessage: v[1] });
      Alert.alert('[SNS] 다시 확인해 주세요!', v[1]);
      return false;
    }

    return true;
  };

export default FirmRegisterScreen;
