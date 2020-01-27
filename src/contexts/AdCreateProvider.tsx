import * as React from 'react';
import * as yup from 'yup';

import { CreateAdDto, CreateAdDtoError } from '../types/ad';

import { AdType } from 'src/components/templates/CreateAdLayout';
import { JBSERVER_ADBOOKED } from 'constants/Url';
import createCtx from 'src/contexts/CreateCtx';
import getString from 'src/STRING';
import { noticeUserError } from 'src/container/request';
import produce from 'immer';
import useAxios from 'axios-hooks';

const [useCtx, Provider] = createCtx<Context>();

interface Context {
  adState: State;
  isVisibleEquiModal: boolean; isVisibleAddrModal: boolean;
  bookedAdTypeList: Array<number>;
  bookedAdLoading: boolean;

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

const onSubmit = (dispatch: React.Dispatch<Action>) => (dto: CreateAdDto): void =>
{
  console.log(dto);
  const createAdError = new CreateAdDtoError();
  ValidScheme.validate(dto, { abortEarly: false })
    .then(() =>
    {
      // requestCreate(createAdDto);
      // Init Error
      dispatch({
        type: ActionType.FAIL_VALIDATION,
        payload: { createAdError }
      });
    })
    .catch((err) =>
    {
      console.log(err.errors);
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
      console.log(createAdError);
      dispatch({
        type: ActionType.FAIL_VALIDATION,
        payload: { createAdError }
      });
    });
};

interface Props {
  children?: React.ReactElement;
  // navigation: DefaultNavigationProps;
}

const AdCreateProvider = (props: Props): React.ReactElement =>
{
  // State
  const [isVisibleEquiModal, setVisibleEquiModal] = React.useState<boolean>(false);
  const [isVisibleAddrModal, setVisibleAddrModal] = React.useState<boolean>(false);
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
    setVisibleEquiModal, setVisibleAddrModal,
    onSubmit: onSubmit(dispatch)
  };

  return (
    <Provider value={{
      adState, ...actions,
      bookedAdLoading, isVisibleEquiModal, isVisibleAddrModal, bookedAdTypeList
    }}>
      {props.children}
    </Provider>
  );
};

export { useCtx as useAdCreateProvider, AdCreateProvider };
