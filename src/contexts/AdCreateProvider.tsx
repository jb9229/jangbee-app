import * as React from 'react';
import * as api from 'src/api/api';
import * as imageManager from 'common/ImageManager';
import * as yup from 'yup';

import { CreateAdDto, CreateAdDtoError } from '../types/ad';

import { AdType } from 'src/container/ad/types';
import { DefaultNavigationProps } from 'src/types';
import { JBSERVER_ADBOOKED } from 'constants/Url';
import { PHONENUMBER_REGULAR_EXPRESSION } from 'src/container/firm/types';
import { User } from 'firebase';
import createCtx from 'src/contexts/CreateCtx';
import getString from 'src/STRING';
import { noticeUserError } from 'src/container/request';
import { notifyError } from 'common/ErrorNotice';
import produce from 'immer';
import useAxios from 'axios-hooks';
import { useLoginContext } from 'src/contexts/LoginContext';

const [useCtx, Provider] = createCtx<Context>();

interface Context {
  adState: State;
  isVisibleEquiModal: boolean; isVisibleAddrModal: boolean;
  bookedAdTypeList: Array<number>;
  bookedAdLoading: boolean;
  imgUploading: boolean;

  setVisibleEquiModal: (flag: boolean) => void; setVisibleAddrModal: (flag: boolean) => void;
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

const ValidScheme = yup.object({
  adType: yup.string().required(`[adType]${getString('VALIDATION_REQUIRED')}`),
  forMonths: yup.number()
    .required(`[forMonths]${getString('VALIDATION_REQUIRED')}`)
    .min(1, `[forMonths]${getString('VALIDATION_NUMBER_INVALID')}(1 ~ 12)`)
    .max(12, `[forMonths]${getString('VALIDATION_NUMBER_INVALID')}(1 ~ 12)`),
  adTitle: yup.string()
    .required(`[adTitle]${getString('VALIDATION_REQUIRED')}`)
    .min(1, `[adTitle]${getString('VALIDATION_NUMBER_INVALID')}(1~ )`),
  adSubTitle: yup.string()
    .required(`[adSubTitle]${getString('VALIDATION_REQUIRED')}`)
    .min(1, `[adSubTitle]${getString('VALIDATION_NUMBER_INVALID')}(1~ )`),
  adTelNumber: yup.string()
    .required(`[adTelNumber]${getString('VALIDATION_REQUIRED')}`)
    .matches(PHONENUMBER_REGULAR_EXPRESSION, `[adTelNumber]${getString('VALIDATION_NUMBER_INVALID')}`),
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

const adCreateAction = (dispatch: React.Dispatch<Action>) => (dto: CreateAdDto): Promise<boolean> =>
{
  const createAdError = new CreateAdDtoError();
  return ValidScheme.validate(dto, { abortEarly: false })
    .then(() =>
    {
      // Equipment Target Ad Validation
      if (dto.adType === AdType.SEARCH_EQUIPMENT_FIRST)
      {
        api
          .existEuipTarketAd(dto.adEquipment)
          .then((dupliResult) =>
          {
            if (dupliResult)
            {
              return true;
            }
            else
            {
              notifyError(
                '타켓광고 등록 장비 중복됨',
                `죄송합니다, 이미 ${dto.adEquipment}는 [${
                  dupliResult.endDate
                }]까지 계약 되었습니다(카톡상담으로 대기 요청해 주세요)`
              );
              return false;
            }
          })
          .catch((error) =>
          {
            noticeUserError('Ad Create Provider', error.message, '장비 타켓광고 중복검사 문제');
            return false;
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
              return true;
            }
            else
            {
              notifyError(
                '타켓광고 등록 지역 중복됨',
                `죄송합니다, [${dupliResult.endDate}]까지 계약된 지역광고가 존재 합니다.`
              );
              return false;
            }
          })
          .catch((error) =>
          {
            noticeUserError('Ad Create Provider', error.message, '지역 타켓광고 중복검사 문제');
            return false;
          });
      }

      // Init Error
      dispatch({
        type: ActionType.FAIL_VALIDATION,
        payload: { createAdError }
      });

      return true;
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

      return false;
    });
};

const requestCreaAd = async (dto: CreateAdDto, user: User, navigation: DefaultNavigationProps,
  setImgUploading: (flag: boolean) => void): Promise<any> =>
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
    paymentSid: dto.paymentSid
    // paymentSid: 'S2763608410635040214'
  };
  console.log('>>> newAd:', newAd);
  api
    .createAd(newAd)
    .then(() =>
    {
      navigation.navigate('Ad', { refresh: true });
    })
    .catch((errorResponse) =>
    {
      noticeUserError('Ad Create Provider', errorResponse.message, '광고생성 실패');
    });
};

/**
 * 광고비 요청함수
 */
const getAdPrice = (adType): number =>
{
  if (adType === AdType.MAIN_FIRST)
  {
    // return 100000;
    return 100;
  }
  if (adType === AdType.MAIN_SECONDE)
  {
    // return 70000;
    return 100;
  }
  if (adType === AdType.MAIN_THIRD)
  {
    // return 50000;
    return 100;
  }
  if (adType === AdType.SEARCH_EQUIPMENT_FIRST)
  {
    // return 70000;
    return 100;
  }
  if (adType === AdType.SEARCH_REGION_FIRST)
  {
    // return 30000;
    return 100;
  }
  return 0;
};

interface Props {
  children?: React.ReactElement;
  navigation: DefaultNavigationProps;
}

const AdCreateProvider = (props: Props): React.ReactElement =>
{
  const { user, userProfile, openAdPaymentModal } = useLoginContext();
  // State
  const [isVisibleEquiModal, setVisibleEquiModal] = React.useState<boolean>(false);
  const [isVisibleAddrModal, setVisibleAddrModal] = React.useState<boolean>(false);
  const [imgUploading, setImgUploading] = React.useState<boolean>(false);
  const [adState, dispatch] = React.useReducer<Reducer>(reducer, initialState);

  // React.useEffect(() =>
  // {
  //   if (bookedAdListResponse && refetch)
  //   {
  //     refetch();
  //   }
  // }, [props.navigation.state]);

  // Server Data
  const [bookedAdListResponse, refetch] = useAxios(JBSERVER_ADBOOKED);

  let bookedAdTypeList = new Array<number>();
  if (bookedAdListResponse.data) { bookedAdTypeList = bookedAdListResponse.data };
  const bookedAdLoading = bookedAdListResponse.loading;

  // Error Notice
  if (bookedAdListResponse.error)
  {
    noticeUserError('Create Ad Error!', bookedAdListResponse.error.message, 'Create Ad Error!');
  };

  const actions = {
    setVisibleEquiModal,
    setVisibleAddrModal,
    onSubmit: (adDto: CreateAdDto): void =>
    {
      console.log('>>> adCreateAction..');
      adCreateAction(dispatch)(adDto)
        .then((result) =>
        {
          if (result)
          {
            if (!userProfile.sid)
            {
              console.log('>>> userProfile.sid:', userProfile.sid);
              openAdPaymentModal(getAdPrice(adState.createAdDto.adType), requestCreaAd, [adDto, user, props.navigation, setImgUploading]);
              return;
            }
            adDto.paymentSid = userProfile.sid;
            requestCreaAd(adDto, user, props.navigation, setImgUploading);
          }
        });
    }
  };

  return (
    <Provider value={{
      adState, ...actions,
      bookedAdLoading, imgUploading, isVisibleEquiModal, isVisibleAddrModal, bookedAdTypeList
    }}>
      {props.children}
    </Provider>
  );
};

export { useCtx as useAdCreateProvider, AdCreateProvider };

