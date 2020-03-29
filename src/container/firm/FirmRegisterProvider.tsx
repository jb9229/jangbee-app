import * as React from 'react';
import * as url from 'constants/Url';

import { FirmCreateDto, FirmCreateErrorData, FirmCreateValidScheme } from 'src/container/firm/types';

import { DefaultNavigationProps } from 'src/types';
import createCtx from 'src/contexts/CreateCtx';
import { noticeUserError } from 'src/container/request';
import useAxios from 'axios-hooks';
import { useLoginProvider } from 'src/contexts/LoginProvider';

interface Context {
  navigation: DefaultNavigationProps;
  loading: boolean;
  firmDto: FirmCreateDto;
  errorData: FirmCreateErrorData;
  onClickCreate: () => void;
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
  const [loading, setLoading] = React.useState(false);
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
    loading,
    firmDto,
    errorData
  };

  // Init Actions
  const actions = {
    onClickCreate: (): void =>
    {
      validateCreatFirmDto(firmDto, errorData)
        .then();
    }
  };

  // UI Component
  return (
    <Provider value={{ ...states, ...actions }}>{props.children}</Provider>
  );
};

// Actions
const validateCreatFirmDto = (dto: FirmCreateDto, errorData: FirmCreateErrorData): Promise<boolean> =>
{
  return FirmCreateValidScheme.validate(dto, { abortEarly: false })
    .then(() => { return true })
    .catch((err) =>
    {
      err.errors.forEach((e: string) =>
      {
        if (e.startsWith('[fname]')) { errorData.fname = (e.replace('[fname]', '')) };
        if (e.startsWith('[phoneNumber]')) { errorData.phoneNumber = (e.replace('[phoneNumber]', '')) };
        if (e.startsWith('[equiListStr]')) { errorData.equiListStr = (e.replace('[equiListStr]', '')) };
        if (e.startsWith('[modelYear]')) { errorData.modelYear = (e.replace('[modelYear]', '')) };
        if (e.startsWith('[address]')) { errorData.address = (e.replace('[address]', '')) };
        if (e.startsWith('[introduction]')) { errorData.introduction = (e.replace('[introduction]', '')) };
        if (e.startsWith('[photo1]')) { errorData.photo1 = (e.replace('[photo1]', '')) };
      });

      return false;
    });
};

export { useCtx as useFirmRegisterProvider, FirmRegisterProvider };
