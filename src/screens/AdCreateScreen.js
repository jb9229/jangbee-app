import * as api from 'api/api';
import * as imageManager from 'common/ImageManager';

import {
  Alert,
  KeyboardAvoidingView,
  Picker,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { validate, validatePresence } from 'utils/Validation';

import Card from 'molecules/CardUI';
import EquipementModal from 'templates/EquipmentModal';
import ImagePickInput from 'molecules/ImagePickInput';
import JBActIndicator from 'molecules/JBActIndicator';
import JBActIndicatorModal from 'templates/JBActIndicatorModal';
import JBErrorMessage from 'organisms/JBErrorMessage';
import JBTextInput from 'molecules/JBTextInput';
import MapAddWebModal from 'templates/MapAddWebModal';
import React from 'react';
import colors from 'constants/Colors';
import fonts from 'constants/Fonts';
import { notifyError } from 'common/ErrorNotice';
import pkg from '../../app.json';
import { withLogin } from 'src/contexts/LoginProvider';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  warningWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  formWrap: {},
  adTypeTitle: {
    fontFamily: fonts.titleMiddle,
    color: colors.title,
    fontSize: 15,
    marginBottom: 3
  },
  bookedAdTypeText: {
    textDecorationLine: 'line-through'
  },
  AdTypeText: {},
  accListItemTH: {},
  accItemSelTH: {
    backgroundColor: colors.point,
    color: 'white'
  },
  botCommWrap: {
    alignItems: 'center'
  },
  warningText: {
    fontFamily: fonts.batang,
    color: colors.point
  }
});

const ADTYPE_MAIN_FIRST = 1;
const ADTYPE_MAIN_SECONDE = 2;
const ADTYPE_MAIN_THIRD = 3;
const ADTYPE_EQUIPMENT_FIRST = 11;
const ADTYPE_EQUIPMENT_SECONDE = 12;
const ADTYPE_EQUIPMENT_THIRD = 13;
const ADTYPE_LOCAL_FIRST = 21;
const ADTYPE_LOCAL_SECONDE = 22;
const ADTYPE_LOCAL_THIRD = 23;
const ADTYPE_SEARCH_FIRST = 31;
const ADTYPE_SEARCH_SECONDE = 32;
const ADTYPE_SEARCH_THIRD = 33;

class AdCreateScreen extends React.Component
{
  constructor (props)
  {
    super(props);
    this.state = {
      isVisibleEquiModal: false,
      isVisibleMapAddModal: false,
      isVisibleActIndiModal: false,
      accList: [],
      bookedAdTypeList: [1, 2],
      adType: undefined,
      adTitle: '',
      adSubTitle: '',
      forMonths: '',
      adPhotoUrl: '',
      adEquipment: '',
      adSido: '',
      adGungu: '',
      adTitleValErrMessage: '',
      adSubTitleValErrMessage: '',
      adPhotoUrlValErrMessage: '',
      adTelNumberValErrMessage: '',
      adEquipmentValErrMessage: '',
      adLocalValErrMessage: '',
      imgUploadingMessage: ''
    };
  }

  componentWillReceiveProps (nextProps)
  {
    if (!nextProps.navigation) { return }
    const { params } = nextProps.navigation.state;

    if (params !== undefined && params.action === 'RELOAD')
    {
      this.setAvailableAdType();
    }
  }

  init = () =>
  {
    this.setAvailableAdType();
    this.setFirmInfo();
  }

  setAvailableAdType = () =>
  {
    api
      .getBookedAdType()
      .then((typeData) =>
      {
        this.setState({ bookedAdTypeList: typeData });
      })
      .catch((error) =>
      {
        notifyError(error.name, error.message);
      });
  };

  /**
   * 광고생성폼 유효성검사 메세지 초기화함수
   */
  setInitValErroMSG = () =>
  {
    this.setState({
      adTitleValErrMessage: '',
      adSubTitleValErrMessage: '',
      adPhotoUrlValErrMessage: '',
      adTelNumberValErrMessage: '',
      forMonthsValErrMessage: '',
      adEquipmentValErrMessage: '',
      adLocalValErrMessage: ''
    });
  };

  /**
   * 초기값 설정을 위한 업체정보 요청 함수
   */
  setFirmInfo = () =>
  {
    const { user, navigation } = this.props;

    api
      .getFirm(user.uid)
      .then((firm) =>
      {
        if (firm)
        {
          this.setDefaultFirmValue(firm);
        }
        else
        {
          Alert.alert(
            '업체 정보가 없습니다.',
            '업체 등록하기를 먼저 진행해 주세요.',
            [{ text: '업체정보 등록하기', onPress: () => navigation.navigate('FirmMyInfo') }],
            { cancelable: false }
          );
        }
      })
      .catch((error) =>
      {
        Alert.alert(
          '업체정보 요청에 문제가 있습니다',
          `업체정보 등록을 먼저 해주세요, 또는 다시 시도해 주세요 -> [${error.name}] ${
            error.message
          }`
        );
      });
  };

  /**
   * 업체정보를 광고 초기정보에 설정하는 함수
   */
  setDefaultFirmValue = (firm) =>
  {
    this.setState({
      adTelNumber: firm.phoneNumber,
      adEquipment: firm.equiListStr,
      adSido: firm.sidoAddr,
      adGungu: firm.sigunguAddr
    });
  };

  /**
   * 광고타입 픽 이벤트 함수
   */
  onPickAdType = (pickType) =>
  {
    const { bookedAdTypeList } = this.state;

    if (pickType !== 11 && pickType !== 21 && bookedAdTypeList.includes(pickType))
    {
      Alert.alert('죄송합니다', '이미 계약된 광고 입니다');
      this.setState({ adType: undefined });
    }
    else
    {
      this.setState({ adType: pickType });
    }
  };

  /**
   * 광고생성 요청함수
   */
  requestCreaAd = async () =>
  {
    const {
      adType,
      adTitle,
      adSubTitle,
      forMonths,
      adPhotoUrl,
      adEquipment,
      adTelNumber,
      adSido,
      adGungu
    } = this.state;
    const { navigation, user, userProfile } = this.props;

    let adEquipmentTypeData = adEquipment;
    let adSidoTypeData = adSido;
    let adGunguTypeData = adGungu;
    if (adType !== ADTYPE_EQUIPMENT_FIRST && adType !== ADTYPE_LOCAL_FIRST)
    {
      adEquipmentTypeData = '';
    }

    if (adType !== ADTYPE_LOCAL_FIRST)
    {
      adSidoTypeData = '';
      adGunguTypeData = '';
    }

    // Ad Image Upload
    let serverAdImgUrl = null;
    if (adPhotoUrl)
    {
      this.setState({ isVisibleActIndiModal: true, imgUploadingMessage: '광고사진 업로드중...' });
      serverAdImgUrl = await imageManager.uploadImage(adPhotoUrl);
      this.setState({ isVisibleActIndiModal: false });
    }

    const newAd = {
      adType,
      accountId: user.uid,
      title: adTitle,
      subTitle: adSubTitle,
      forMonths,
      photoUrl: serverAdImgUrl,
      telNumber: adTelNumber,
      equiTarget: adEquipmentTypeData,
      sidoTarget: adSidoTypeData,
      gugunTarget: adGunguTypeData,
      price: this.getAdPrice(adType)
    };

    api
      .createAd(newAd)
      .then(() => navigation.navigate('Ad', { refresh: true }))
      .catch((errorResponse) =>
      {
        Alert.alert('광고생성 실패', errorResponse.message);
      });
  };

  /**
   * 광고생성 유효성검사 함수
   */
  validateCreaAd = () =>
  {
    const {
      adType, adEquipment, adSido, adGungu
    } = this.state;

    // Check Validation Create Ad Form Item
    if (!this.valiCreAdForm())
    {
      return;
    }

    // Equipment Target Ad Validation
    if (adType === ADTYPE_EQUIPMENT_FIRST && this.validateEquipTarAdForm())
    {
      api
        .existEuipTarketAd(adEquipment)
        .then((dupliResult) =>
        {
          if (dupliResult === null)
          {
            if (pkg.mode === 'BETA')
            {
              this.requestCreaAd();
            }
            else if (pkg.mode === 'OPENBANK')
            {
              this.withdrawDispatchFee(); // (오픈뱅크 심사용)
            }
          }
          else
          {
            notifyError(
              '장비 타켓광고 중복검사 실패',
              `죄송합니다, 해당 ${adSido} ${adGungu}는 [${
                dupliResult.endDate
              }]까지 계약된 광고가 존재 합니다.`
            );
          }
        })
        .catch((error) =>
        {
          notifyError('장비 타켓광고 중복검사 문제', error.message);
        });
    }
    else if (adType === ADTYPE_LOCAL_FIRST && this.validateLocTarAdForm())
    {
      // Local Target Ad Validation
      api
        .existLocalTarketAd(adEquipment, adSido, adGungu)
        .then((dupliResult) =>
        {
          if (dupliResult === null)
          {
            if (pkg.mode === 'BETA')
            {
              this.requestCreaAd();
            }
            else if (pkg.mode === 'OPENBANK')
            {
              this.withdrawDispatchFee(); // (오픈뱅크 심사용)
            }
          }
          else
          {
            notifyError(
              '지역 타켓광고 중복 확인 실패',
              `죄송합니다, [${dupliResult.endDate}]까지 계약된 광고가 존재 합니다.`
            );
          }
        })
        .catch((error) =>
        {
          notifyError('지역 타켓광고 중복검사 문제', error.message);
        });
    }
    else if (pkg.mode === 'BETA')
    {
      this.requestCreaAd();
    }
    else if (pkg.mode === 'OPENBANK')
    {
      this.withdrawDispatchFee(); // (오픈뱅크 심사용)
    }
  };

  /**
   * 광고생성 폼 유효성검사 함수
   */
  valiCreAdForm = () =>
  {
    const {
      adType,
      adTitle,
      adSubTitle,
      forMonths,
      adPhotoUrl,
      adTelNumber
    } = this.state;
    const { user, userProfile } = this.props;

    // Validation Error Massage Initialize
    this.setInitValErroMSG();

    if (adType === undefined)
    {
      Alert.alert('유효성검사 에러', '광고타입을 선택해 주세요.');
      return false;
    }
    if (user === undefined || user === null || user.uid === undefined || user.uid === null)
    {
      Alert.alert('유효성검사 에러', '사용자정보를 찾지 못했습니다, 재로그인해 주세요');
      return false;
    }

    let v = validate('decimalMin', forMonths, true, 1);
    if (!v[0])
    {
      this.setState({ forMonthsValErrMessage: v[1] });
      return false;
    }

    v = validate('textMax', adTitle, true, 15);
    if (!v[0])
    {
      this.setState({ adTitleValErrMessage: v[1] });
      return false;
    }

    v = validate('textMax', adSubTitle, true, 20);
    if (!v[0])
    {
      this.setState({ adSubTitleValErrMessage: v[1] });
      return false;
    }

    v = validate('textMax', adPhotoUrl, false, 250);
    if (!v[0])
    {
      this.setState({ adPhotoUrlValErrMessage: v[1] });
      return false;
    }

    v = validate('cellPhone', adTelNumber, false);
    if (!v[0])
    {
      this.setState({ adTelNumberValErrMessage: v[1] });
      return false;
    }

    return true;
  };

  /**
   * 장비 타켓 광고 Validation 체크
   */
  validateEquipTarAdForm = () =>
  {
    const { adEquipment } = this.state;

    const v = validatePresence(adEquipment);
    if (!v[0])
    {
      this.setState({ adEquipmentValErrMessage: v[1] });
      return false;
    }

    return true;
  };

  /**
   * 지역 타켓 광고 Validation 체크
   */
  validateLocTarAdForm = () =>
  {
    const { adEquipment, adSido, adGungu } = this.state;

    let v = validatePresence(adEquipment);
    if (!v[0])
    {
      this.setState({ adEquipmentValErrMessage: v[1] });
      return false;
    }

    v = validatePresence(adSido);
    if (!v[0])
    {
      this.setState({ adLocalValErrMessage: v[1] });
      return false;
    }

    v = validatePresence(adGungu);
    if (!v[0])
    {
      this.setState({ adLocalValErrMessage: v[1] });
      return false;
    }

    return true;
  };

  render ()
  {
    if (true)
    {
      return <JBActIndicator title="통장 리스트 불러오는중..." size={35} />;
    }
  }
}

export default AdCreateScreen;
