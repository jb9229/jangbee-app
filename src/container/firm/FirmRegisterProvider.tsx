import * as React from 'react';
import * as url from 'constants/Url';

import { FirmCreateDto, FirmCreateErrorData } from 'src/container/firm/types';

import { DefaultNavigationProps } from 'src/types';
import createCtx from 'src/contexts/CreateCtx';
import { noticeUserError } from 'src/container/request';
import useAxios from 'axios-hooks';
import { useLoginProvider } from 'src/contexts/LoginProvider';

interface Context {
  navigation: DefaultNavigationProps;
  firmDto: FirmCreateDto;
  errorData: FirmCreateErrorData;
}

const [useCtx, Provider] = createCtx<Context>();

interface Props {
  children?: React.ReactElement;
  navigation: DefaultNavigationProps;
}

const FirmRegisterProvider = (props: Props): React.ReactElement =>
{
  // States
  const { user, firm } = useLoginProvider();
  const [firmDto, setFirmDto] = React.useState(new FirmCreateDto());
  const [errorData, setErrorData] = React.useState(new FirmCreateErrorData());

  // Server Data State

  // Didmount/Unmount
  React.useEffect(() =>
  {
  }, [firm]);

  // Init States
  const states = {
    navigation: props.navigation,
    firmDto,
    errorData
  };

  // Init Actions
  const actions = {
  };

  // UI Component
  return (
    <Provider value={{ ...states, ...actions }}>{props.children}</Provider>
  );
};

export { useCtx as useFirmRegisterProvider, FirmRegisterProvider };
