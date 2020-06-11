import * as React from 'react';

import { FirmCreateDto, FirmCreateErrorData } from 'src/container/firm/types';
import { convertFirmDto, requestAddFirm, uploadImage, validateCreatFirmDto } from 'src/container/firm/action';

import { CREATE_FIRM } from 'src/api/mutations';
import { DefaultNavigationProps } from 'src/types';
import createCtx from 'src/contexts/CreateCtx';
import { noticeUserError } from 'src/container/request';
import { useLoginContext } from 'src/contexts/LoginContext';
import { useMutation } from '@apollo/client';

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
  const { user, firm, popLoading, refetchFirm } = useLoginContext();
  const [firmDto, setFirmDto] = React.useState(new FirmCreateDto());
  const [errorData, setErrorData] = React.useState<FirmCreateErrorData>(new FirmCreateErrorData());
  const [createFirmRequest, createFirmResponse] = useMutation(CREATE_FIRM, {
    onCompleted: (data) =>
    {
      if (data && data.createFirm)
      {
        requestAddFirm(user.uid, firmDto)
          .then((result) => { console.log('>>> jb requestAddFirm result:', result); if (result) { refetchFirm(); props.navigation.navigate('FirmMyInfo', { refresh: 'Register' }) } })
          .catch((err): void => { noticeUserError('FirmRegisterProvider(requestAddFirm -> error)', err?.message, user) });
      }
      else
      {
        noticeUserError('FirmRegisterProvider(requestRegisterFirm -> onCompleted)', data?.createFirm, user);
      }
    },
    onError: (err) =>
    {
      console.error(err);
      noticeUserError('FirmRegisterProvider(requestRegisterFirm -> onError)', err, user);
    }
  });

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
      console.log('>>> onClickCreate~~');
      validateCreatFirmDto(firmDto)
        .then((validResult) =>
        {
          console.log('>>> validateCreatFirmDto result: ', validResult);
          if (validResult === true)
          {
            uploadImage(firmDto, popLoading)
              .then((uploadResult) =>
              {
                console.log('>>> uploadImage result: ', uploadResult);
                const newFirmDto = convertFirmDto(user.uid, firmDto);
                createFirmRequest({ variables: { newFirm: newFirmDto } });
              })
              .catch((err) => { noticeUserError('FirmRegisterProvider(uploadImage -> error)', err?.message, user) });
          }
          else if (validResult instanceof FirmCreateErrorData) { setErrorData(validResult) }
        })
        .catch((err) => { noticeUserError('FirmRegisterProvider(validateCreatFirmDto -> error)', err?.message, user) });
    }
  };

  // UI Component
  return (
    <Provider value={{ ...states, ...actions }}>{props.children}</Provider>
  );
};

export { useCtx as useFirmRegisterProvider, FirmRegisterProvider };

