import * as React from 'react';
import * as url from 'constants/Url';

import { FirmCreateDto, FirmCreateErrorData } from 'src/container/firm/types';
import { requestModifyFirm, uploadImage, validateCreatFirmDto } from 'src/container/firm/action';

import { DefaultNavigationProps } from 'src/types';
import { Firm } from 'src/provider/LoginProvider';
import createCtx from 'src/contexts/CreateCtx';
import { noticeUserError } from 'src/container/request';
import useAxios from 'axios-hooks';
import { useLoginContext } from 'src/contexts/LoginContext';

interface Context {
  navigation: DefaultNavigationProps;
  loading: boolean;
  firm: Firm | undefined;
  firmDto: FirmCreateDto;
  errorData: FirmCreateErrorData;
  onClickUpdate: () => void;
}

const [useCtx, Provider] = createCtx<Context>();

interface Props {
  children?: React.ReactElement;
  navigation: DefaultNavigationProps;
}

const FirmModifyProvider = (props: Props): React.ReactElement =>
{
  // States
  const { user, firm, popLoading } = useLoginContext();
  const [firmDto, setFirmDto] = React.useState(new FirmCreateDto());
  const [errorData, setErrorData] = React.useState<FirmCreateErrorData>(new FirmCreateErrorData());

  // Server Data State
  const [firmResponse, firmRequest] = useAxios(`${url.JBSERVER_FIRM}?accountId=${user?.uid}`);

  // Didmount/Unmount
  React.useEffect(() =>
  {
  }, [firm]);
  console.log('>>> firmResponse.data', firmResponse.data);
  // Init States
  const states = {
    loading: firmResponse.loading,
    navigation: props.navigation,
    firm: firmResponse.data || undefined,
    firmDto,
    errorData
  };

  // Init Actions
  const actions = {
    onClickUpdate: (): void =>
    {
      validateCreatFirmDto(firmDto)
        .then((result) =>
        {
          if (result === true)
          {
            uploadImage(firmDto, popLoading)
              .then((result) =>
              {
                requestModifyFirm(user.uid, firmResponse.data.id, firmDto)
                  .then((result) => { if (result) { props.navigation.navigate('FirmMyInfo', { refresh: 'update' }) } })
                  .catch((err): void => { noticeUserError('FirmModifyProvider(requestModifyFirm -> error)', err?.message) });
              })
              .catch((err) => { noticeUserError('FirmModifyProvider(uploadImage -> error)', err?.message) });
          }
          else if (result instanceof FirmCreateErrorData) { setErrorData(result) }
        })
        .catch((err) => { noticeUserError('FirmModifyProvider(validateModifyFirmDto -> error)', err?.message) });
    }
  };

  // UI Component
  return (
    <Provider value={{ ...states, ...actions }}>{props.children}</Provider>
  );
};

export { useCtx as useFirmModifyProvider, FirmModifyProvider };
