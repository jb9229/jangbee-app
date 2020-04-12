import * as React from 'react';

import { FirmCreateDto, FirmCreateErrorData } from 'src/container/firm/types';
import { requestAddFirm, uploadImage, validateCreatFirmDto } from 'src/container/firm/action';

import { DefaultNavigationProps } from 'src/types';
import createCtx from 'src/contexts/CreateCtx';
import { noticeUserError } from 'src/container/request';
import { useLoginContext } from 'src/contexts/LoginContext';

interface Context {
  navigation: DefaultNavigationProps;
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
  const { user, firm, popLoading } = useLoginContext();
  const [firmDto, setFirmDto] = React.useState(new FirmCreateDto());
  const [errorData, setErrorData] = React.useState<FirmCreateErrorData>(new FirmCreateErrorData());

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
    onClickCreate: (): void =>
    {
      validateCreatFirmDto(firmDto)
        .then((result) =>
        {
          if (result === true)
          {
            uploadImage(firmDto, popLoading)
              .then((result) =>
              {
                requestAddFirm(user.uid, firmDto)
                  .then((result) => { if (result) { props.navigation.navigate('FirmMyInfo', { refresh: 'Register' }) } })
                  .catch((err): void => { noticeUserError('FirmRegisterProvider(requestAddFirm -> error)', err?.message) });
              })
              .catch((err) => { noticeUserError('FirmRegisterProvider(uploadImage -> error)', err?.message) });
          }
          else if (result instanceof FirmCreateErrorData) { setErrorData(result) }
        })
        .catch((err) => { noticeUserError('FirmRegisterProvider(validateCreatFirmDto -> error)', err?.message) });
    }
  };

  // UI Component
  return (
    <Provider value={{ ...states, ...actions }}>{props.children}</Provider>
  );
};

export { useCtx as useFirmRegisterProvider, FirmRegisterProvider };
