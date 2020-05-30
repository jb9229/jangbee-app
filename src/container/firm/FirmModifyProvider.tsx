import * as React from 'react';
import * as url from 'constants/Url';

import { FirmCreateDto, FirmCreateErrorData } from 'src/container/firm/types';
import { getUpdateFirmDto, requestModifyFirm, uploadImage, validateCreatFirmDto } from 'src/container/firm/action';
import { useLazyQuery, useMutation } from '@apollo/client';

import { DefaultNavigationProps } from 'src/types';
import { Firm } from 'src/provider/LoginProvider';
import { UPDATE_FIRM } from 'src/api/mutations';
import createCtx from 'src/contexts/CreateCtx';
import { noticeUserError } from 'src/container/request';
import useAxios from 'axios-hooks';
import { useLoginContext } from 'src/contexts/LoginContext';

interface Context {
  navigation: DefaultNavigationProps;
  loading: boolean;
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
  const { user, firm, popLoading, refetchFirm } = useLoginContext();
  const [firmDto, setFirmDto] = React.useState(new FirmCreateDto());
  const [errorData, setErrorData] = React.useState<FirmCreateErrorData>(new FirmCreateErrorData());

  // Server Data State
  const [firmResponse, firmRequest] = useAxios(`${url.JBSERVER_FIRM}?accountId=${user?.uid}`);
  const [modifyFirmRequest, modifyFirmResponse] = useMutation(UPDATE_FIRM, {
    onCompleted: (data) =>
    {
      if (data && data.updateFirm)
      {
        requestModifyFirm(user.uid, firmResponse.data.id, firmDto)
          .then((result) => { if (result) { refetchFirm(); props.navigation.navigate('FirmMyInfo', { refresh: 'update' }) } })
          .catch((err): void => { noticeUserError('FirmModifyProvider(requestModifyFirmAtOldServer -> error)', err?.message) });
      }
      else
      {
        noticeUserError('FirmModifyProvider(requestModifyFirm -> error)', data?.updateFirm);
      }
    },
    onError: (err) =>
    {
      noticeUserError('FirmModifyProvider(requestModifyFirm -> error)', err?.message);
    }
  });

  // Didmount/Unmount
  React.useEffect(() =>
  {
  }, [firm]);

  // Init States
  const states = {
    loading: firmResponse.loading,
    navigation: props.navigation,
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
                modifyFirmRequest({ variables: { account_id: user.uid, updateFirm: getUpdateFirmDto(firmDto) } });
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
