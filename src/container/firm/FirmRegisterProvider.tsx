import * as React from 'react';

import { CREATE_FIRM, UPLOAD_IMAGE } from 'src/api/mutations';
import { FirmCreateDto, FirmCreateErrorData } from 'src/container/firm/types';
import {
  convertFirmDto,
  requestAddFirm,
  uploadImage,
  validateCreatFirmDto,
} from 'src/container/firm/action';
import { useLazyQuery, useMutation } from '@apollo/client';

import { DefaultNavigationProps } from 'src/types';
import { ReactNativeFile } from 'apollo-upload-client';
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

const FirmRegisterProvider = (props: Props): React.ReactElement => {
  // States
  const { userProfile, firm, popLoading, refetchFirm } = useLoginContext();
  const [firmDto, setFirmDto] = React.useState(new FirmCreateDto());
  const [errorData, setErrorData] = React.useState<FirmCreateErrorData>(
    new FirmCreateErrorData()
  );
  const [createFirmRequest, createFirmResponse] = useMutation(CREATE_FIRM, {
    onCompleted: data => {
      if (data && data.createFirm) {
        refetchFirm();
        props.navigation.navigate('FirmMyInfo', { refresh: 'Register' });
      } else {
        noticeUserError(
          'FirmRegisterProvider(requestRegisterFirm -> onCompleted)',
          data?.createFirm,
          userProfile
        );
      }
    },
    onError: err => {
      console.error(err);
      noticeUserError(
        'FirmRegisterProvider(requestRegisterFirm -> onError)',
        err,
        user
      );
    },
  });

  const [uploadImgReq, uploadImgRsp] = useMutation(UPLOAD_IMAGE, {
    onCompleted: data => {
      console.log('>>> onCompleted data: ', data);
      if (data && data.uploadFirmImage) {
        // refetchFirm(); props.navigation.navigate('FirmMyInfo', { refresh: 'Register' });
      } else {
        noticeUserError(
          'FirmRegisterProvider(requestRegisterFirm -> onCompleted)',
          data?.createFirm,
          userProfile
        );
      }
    },
    onError: err => {
      console.error(err);
      noticeUserError(
        'FirmRegisterProvider(requestRegisterFirm -> onError)',
        err,
        userProfile
      );
    },
  });

  // Server Data State

  // Didmount/Unmount
  React.useEffect(() => {}, [firm]);

  // Init States
  const states = {
    navigation: props.navigation,
    firmDto,
    errorData,
  };

  // Init Actions
  const actions = {
    onClickCreate: (): void => {
      validateCreatFirmDto(firmDto)
        .then(validResult => {
          console.log('>>> validateCreatFirmDto result: ', validResult);
          if (validResult === true) {
            const newFirmDto = convertFirmDto(userProfile?.uid, firmDto);
            console.log('>>> newFirmDto: ', newFirmDto);
            createFirmRequest({ variables: { newFirm: newFirmDto } });
          } else if (validResult instanceof FirmCreateErrorData) {
            setErrorData(validResult);
          }
        })
        .catch(err => {
          noticeUserError(
            'FirmRegisterProvider(validateCreatFirmDto -> error)',
            err?.message,
            userProfile
          );
        });
    },
  };

  // UI Component
  return (
    <Provider value={{ ...states, ...actions }}>{props.children}</Provider>
  );
};

export { useCtx as useFirmRegisterProvider, FirmRegisterProvider };
