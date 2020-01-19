import * as React from 'react';
import * as yup from 'yup';

import { CreateAdDto, CreateAdDtoError } from '../types/ad';

import createCtx from 'src/contexts/CreateCtx';
import getString from 'src/STRING';
import produce from 'immer';

const [useCtx, Provider] = createCtx<Context>();

interface Context {
  adState: State;
  isVisibleEquiModal: boolean; isVisibleAddrModal: boolean;
  bookedAdTypeList: Array<number>;

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
  title: yup.string()
    .required(`[title]${getString('VALIDATION_REQUIRED')}`)
    .min(1, `[title]${getString('VALIDATION_STRING_EXCEED')}(1~10 Character)`)
    .max(10, `[title]${getString('VALIDATION_STRING_EXCEED')}(1~10 Character)`)
});

const onSubmit = (dispatch: React.Dispatch<Action>) => (dto: CreateAdDto): void =>
{
  ValidScheme.validate(dto)
    .then(() =>
    {
      // requestCreate(createAdDto);
    })
    .catch((err) =>
    {
      const createAdError = new CreateAdDtoError();
      err.errors.forEach((e: string) =>
      {
        if (e.startsWith('[comment]')) { createAdError.title = (e.replace('[comment]', '')) };
      });

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
  const [isVisibleEquiModal, setVisibleEquiModal] = React.useState<boolean>(false);
  const [isVisibleAddrModal, setVisibleAddrModal] = React.useState<boolean>(false);
  const [adState, dispatch] = React.useReducer<Reducer>(reducer, initialState);

  const bookedAdTypeList = new Array<number>();

  const actions = {
    setVisibleEquiModal, setVisibleAddrModal,
    onSubmit: onSubmit(dispatch)
  };

  return (
    <Provider value={{ adState, ...actions, isVisibleEquiModal, isVisibleAddrModal, bookedAdTypeList }}>
      {props.children}
    </Provider>
  );
};

export { useCtx as useAdCreateProvider, AdCreateProvider };
