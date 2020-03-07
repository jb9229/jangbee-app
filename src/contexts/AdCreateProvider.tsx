import * as React from 'react';
import * as api from 'src/api/api';
import * as imageManager from 'common/ImageManager';
import * as yup from 'yup';

import { AdType, SubscriptionReadyResponse } from 'src/container/ad/types';
import { CreateAdDto, CreateAdDtoError } from '../types/ad';

import { DefaultNavigationProps } from 'src/types';
import { JBSERVER_ADBOOKED } from 'constants/Url';
import { User } from 'firebase';
import createCtx from 'src/contexts/CreateCtx';
import getString from 'src/STRING';
import { noticeUserError } from 'src/container/request';
import { notifyError } from 'common/ErrorNotice';
import produce from 'immer';
import useAxios from 'axios-hooks';

const [useCtx, Provider] = createCtx<Context>();

interface Context {
  adState: State;
  isVisibleEquiModal: boolean; isVisibleAddrModal: boolean;
  bookedAdTypeList: Array<number>;
  bookedAdLoading: boolean;
  imgUploading: boolean;
  visiblePaymentModal: boolean;
  paymentUrl: string;

  setVisibleEquiModal: (flag: boolean) => void; setVisibleAddrModal: (flag: boolean) => void; setVisiblePaymentModal: (flag: boolean) => void;
  onSubmit: (dto: CreateAdDto) => void;
}

// State
interface State {
  createAdDto: CreateAdDto;
  createAdError: CreateAdDtoError;
}

const initialState: State = {
  createAdDto: new CreateAdDto(),
  createAdError: new CreateAdDtoError()
};

// Action
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Payload {
  createAdError: CreateAdDtoError;
};
export enum ActionType {
  CREATE_AD = 'create-ad',
  FAIL_VALIDATION = 'fail-validation',
}
type Action = { type: ActionType; payload: Payload };

// Reducer
type Reducer = (state: State, action: Action) => State;

const reducer: Reducer = (state = initialState, action) =>
{
  return produce(state, (draft) =>
  {
    const { type, payload } = action;
    switch (type)
    {
      case ActionType.CREATE_AD:
      {
        break;
      }
      case ActionType.FAIL_VALIDATION:
      {
        draft.createAdError = payload.createAdError;
        break;
      }
    }
  });
};

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const ValidScheme = yup.object({
  adType: yup.string().required(`[adType]${getString('VALIDATION_REQUIRED')}`),
  forMonths: yup.number()
    .required(`[forMonths]${getString('VALIDATION_REQUIRED')}`)
    .min(1, `[forMonths]${getString('VALIDATION_NUMBER_INVALID')}(1~ )`),
  adTitle: yup.string()
    .required(`[adTitle]${getString('VALIDATION_REQUIRED')}`)
    .min(1, `[adTitle]${getString('VALIDATION_NUMBER_INVALID')}(1~ )`),
  adSubTitle: yup.string()
    .required(`[adSubTitle]${getString('VALIDATION_REQUIRED')}`)
    .min(1, `[adSubTitle]${getString('VALIDATION_NUMBER_INVALID')}(1~ )`),
  adTelNumber: yup.string()
    .required(`[adTelNumber]${getString('VALIDATION_REQUIRED')}`)
    .matches(phoneRegExp, `[adTelNumber]${getString('VALIDATION_NUMBER_INVALID')}`),
  adEquipment: yup.string()
    .when('adType', {
      is: (val) => val == AdType.SEARCH_EQUIPMENT_FIRST || val == AdType.SEARCH_REGION_FIRST,
      then: yup.string()
        .required(`[adEquipment]${getString('VALIDATION_REQUIRED')}`)
    }),
  adSido: yup.string()
    .when('adType', {
      is: (val) => val == AdType.SEARCH_REGION_FIRST,
      then: yup.string()
        .required(`[adSido]${getString('VALIDATION_REQUIRED')}`)
    }),
  adGungu: yup.string()
    .when('adType', {
      is: (val) => val == AdType.SEARCH_REGION_FIRST,
      then: yup.string()
        .required(`[adGungu]${getString('VALIDATION_REQUIRED')}`)
    })
});

const onSubmit = (dispatch: React.Dispatch<Action>, user: User, navigation: DefaultNavigationProps,
  setImgUploading: (flag: boolean) => void, setVisiblePaymentModal: (flag: boolean) => void,
  setPaymentUrl: (url: string) => void) => (dto: CreateAdDto): void =>
{
  const createAdError = new CreateAdDtoError();
  ValidScheme.validate(dto, { abortEarly: false })
    .then(() =>
    {
      // Equipment Target Ad Validation
      if (dto.adType === AdType.SEARCH_EQUIPMENT_FIRST)
      {
        api
          .existEuipTarketAd(dto.adEquipment)
          .then((dupliResult) =>
          {
            if (dupliResult === null)
            {
              requestCreaAd(dto, user, navigation, setImgUploading, setVisiblePaymentModal, setPaymentUrl);
            }
            else
            {
              notifyError(
                '타켓광고 등록 장비 중복됨',
                `죄송합니다, 이미 ${dto.adEquipment}는 [${
                  dupliResult.endDate
                }]까지 계약 되었습니다(카톡상담으로 대기 요청해 주세요)`
              );
            }
          })
          .catch((error) =>
          {
            noticeUserError('Ad Create Provider', '장비 타켓광고 중복검사 문제', error.message);
          });
      }
      else if (dto.adType === AdType.SEARCH_REGION_FIRST)
      {
        // Local Target Ad Validation
        api
          .existLocalTarketAd(dto.adEquipment, dto.adSido, dto.adGungu)
          .then((dupliResult) =>
          {
            if (dupliResult === null)
            {
              requestCreaAd(dto, user, navigation, setImgUploading, setVisiblePaymentModal, setPaymentUrl);
            }
            else
            {
              notifyError(
                '타켓광고 등록 지역 중복됨',
                `죄송합니다, [${dupliResult.endDate}]까지 계약된 지역광고가 존재 합니다.`
              );
            }
          })
          .catch((error) =>
          {
            noticeUserError('Ad Create Provider', '지역 타켓광고 중복검사 문제', error.message);
          });
      }
      else
      {
        // // TODO Check Endpoint duplicate (refetch and check)
        // if (pickType !== 11 && pickType !== 21 && bookedAdTypeList.includes(pickType))
        // {
        //   Alert.alert('죄송합니다', '이미 계약된 광고 입니다');

        //   return false;
        // }
        requestCreaAd(dto, user, navigation, setImgUploading, setVisiblePaymentModal, setPaymentUrl);
      }

      // Init Error
      dispatch({
        type: ActionType.FAIL_VALIDATION,
        payload: { createAdError }
      });
    })
    .catch((err) =>
    {
      err.errors.forEach((e: string) =>
      {
        if (e.startsWith('[adType]')) { createAdError.type = (e.replace('[adType]', '')) };
        if (e.startsWith('[forMonths]')) { createAdError.forMonths = (e.replace('[forMonths]', '')) };
        if (e.startsWith('[adTitle]')) { createAdError.title = (e.replace('[adTitle]', '')) };
        if (e.startsWith('[adSubTitle]')) { createAdError.subTitle = (e.replace('[adSubTitle]', '')) };
        if (e.startsWith('[adTelNumber]')) { createAdError.telNumber = (e.replace('[adTelNumber]', '')) };
        if (e.startsWith('[adEquipment]')) { createAdError.equipment = (e.replace('[adEquipment]', '')) };
        if (e.startsWith('[adSido]')) { createAdError.local = (e.replace('[adSido]', '')) };
        if (e.startsWith('[adGungu]')) { createAdError.local = (e.replace('[adGungu]', '')) };
      });
      dispatch({
        type: ActionType.FAIL_VALIDATION,
        payload: { createAdError }
      });
    });
};

const requestCreaAd = async (dto: CreateAdDto, user: User, navigation: DefaultNavigationProps,
  setImgUploading: (flag: boolean) => void, setVisiblePaymentModal: (flag: boolean) => void,
  setPaymentUrl: (url: string) => void): Promise<any> =>
{
  // Ad Image Upload
  let serverAdImgUrl = null;
  if (dto.adPhotoUrl)
  {
    setImgUploading(true);
    // this.setState({ isVisibleActIndiModal: true, imgUploadingMessage: '광고사진 업로드중...' });
    serverAdImgUrl = await imageManager.uploadImage(dto.adPhotoUrl);
    setImgUploading(false);
  }

  const adPrice = getAdPrice(dto.adType);

  // Request AD Fee Payment
  api
    .requestAdPayment(adPrice)
    .then((result: SubscriptionReadyResponse) =>
    {
      console.log(result);
      if (result && result.next_redirect_mobile_url)
      {
        setPaymentUrl(result.next_redirect_mobile_url);
        // setVisiblePaymentModal(true);
      }
    })
    .catch((err) =>
    {
      noticeUserError('Ad Create Provider', '광고비 결제 요청 실패', err.message);
    });

  // return null;
  const newAd = {
    adType: dto.adType,
    accountId: user.uid,
    title: dto.adTitle,
    subTitle: dto.adSubTitle,
    forMonths: dto.forMonths,
    photoUrl: serverAdImgUrl,
    telNumber: dto.adTelNumber,
    equiTarget: dto.adEquipment,
    sidoTarget: dto.adSido,
    gugunTarget: dto.adGungu,
    price: adPrice,
    fintechUseNum: 'temp_fintechusenum', // it will be delete
    obAccessToken: 'temp_obAccessToken' // it will be delete
  };

  api
    .createAd(newAd)
    .then(() =>
    {
      setVisiblePaymentModal(true);
      // navigation.navigate('Ad', { refresh: true });
    })
    .catch((errorResponse) =>
    {
      noticeUserError('Ad Create Provider', '광고생성 실패', errorResponse.message);
    });
};

/**
 * 광고비 요청함수
 */
const getAdPrice = (adType): number =>
{
  if (adType === AdType.MAIN_FIRST)
  {
    return 100000;
  }
  if (adType === AdType.MAIN_SECONDE)
  {
    return 70000;
  }
  if (adType === AdType.MAIN_THIRD)
  {
    return 50000;
  }
  if (adType === AdType.SEARCH_EQUIPMENT_FIRST)
  {
    return 70000;
  }
  if (adType === AdType.SEARCH_REGION_FIRST)
  {
    return 30000;
  }
  return 0;
};

interface Props {
  children?: React.ReactElement;
  navigation: DefaultNavigationProps;
  user: User;
}

const AdCreateProvider = (props: Props): React.ReactElement =>
{
  // State
  const [isVisibleEquiModal, setVisibleEquiModal] = React.useState<boolean>(false);
  const [isVisibleAddrModal, setVisibleAddrModal] = React.useState<boolean>(false);
  const [visiblePaymentModal, setVisiblePaymentModal] = React.useState(false);
  const [paymentUrl, setPaymentUrl] = React.useState<string>();
  const [imgUploading, setImgUploading] = React.useState<boolean>(false);
  const [adState, dispatch] = React.useReducer<Reducer>(reducer, initialState);

  // Server Data
  const [bookedAdListResponse, refetch] = useAxios(JBSERVER_ADBOOKED);

  let bookedAdTypeList = new Array<number>();
  if (bookedAdListResponse.data) { bookedAdTypeList = bookedAdListResponse.data };
  const bookedAdLoading = bookedAdListResponse.loading;

  // Error Notice
  if (bookedAdListResponse.error)
  {
    noticeUserError('Create Ad Error!', 'Create Ad Error!', bookedAdListResponse.error.message);
  };

  const actions = {
    setVisibleEquiModal, setVisibleAddrModal, setVisiblePaymentModal,
    onSubmit: onSubmit(dispatch, props.user, props.navigation, setImgUploading, setVisiblePaymentModal, setPaymentUrl)
  };

  return (
    <Provider value={{
      adState, ...actions,
      bookedAdLoading, imgUploading, isVisibleEquiModal, isVisibleAddrModal, bookedAdTypeList,
      paymentUrl, visiblePaymentModal
    }}>
      {props.children}
    </Provider>
  );
};

export { useCtx as useAdCreateProvider, AdCreateProvider };
