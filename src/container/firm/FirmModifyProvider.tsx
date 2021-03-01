import * as React from 'react';

import { FirmCreateErrorData, FirmEditDto } from 'src/container/firm/types';
import {
  getUpdateFirmDto,
  validateUpdateFirmDto,
} from 'src/container/firm/action';

import { DefaultNavigationProps } from 'src/types';
import { FIRM } from 'src/api/queries';
import { UPDATE_FIRM } from 'src/api/mutations';
import createCtx from 'src/contexts/CreateCtx';
import { noticeUserError } from 'src/container/request';
import { useLoginContext } from 'src/contexts/LoginContext';
import { useMutation } from '@apollo/client';

interface Context {
  navigation: DefaultNavigationProps;
  loading: boolean;
  firmDto: FirmEditDto;
  errorData: FirmCreateErrorData;
  onClickUpdate: () => void;
}

const [useCtx, Provider] = createCtx<Context>();

interface Props {
  children?: React.ReactElement;
  navigation: DefaultNavigationProps;
}

const FirmModifyProvider = (props: Props): React.ReactElement => {
  // States
  const { userProfile, firm, refetchFirm } = useLoginContext();
  const [firmDto, setFirmDto] = React.useState<FirmEditDto>(new FirmEditDto());
  const [errorData, setErrorData] = React.useState<FirmCreateErrorData>(
    new FirmCreateErrorData()
  );

  // Server Data State
  const [modifyFirmRequest, modifyFirmResponse] = useMutation(UPDATE_FIRM, {
    onCompleted: data => {
      if (data && data.updateFirm) {
        refetchFirm();
        props.navigation.navigate('FirmMyInfo', { refresh: 'update' });
      } else {
        noticeUserError(
          'FirmModifyProvider(requestModifyFirm -> error)',
          data?.updateFirm,
          user
        );
      }
    },
    onError: err => {
      noticeUserError(
        'FirmModifyProvider(requestModifyFirm -> error)',
        err?.message,
        user
      );
    },
    refetchQueries: [
      { query: FIRM, variables: { accountId: userProfile.uid } },
    ],
  });

  // Didmount/Unmount
  React.useEffect(() => {
    if (firm) {
      const updateDto = new FirmEditDto();
      updateDto.phoneNumber = firm.phoneNumber;
      updateDto.equiListStr = firm.equiListStr;
      updateDto.sidoAddr = firm.sidoAddr;
      updateDto.sigunguAddr = firm.sigunguAddr;
      updateDto.address = firm.address;
      updateDto.addrLatitude = firm.addrLatitude;
      updateDto.addrLongitude = firm.addrLongitude;
      updateDto.workAlarmSido = firm.workAlarmSido;
      updateDto.workAlarmSigungu = firm.workAlarmSigungu;
      updateDto.modelYear = firm.modelYear;
      updateDto.introduction = firm.introduction;
      updateDto.fname = firm.fname;
      updateDto.thumbnail = firm.thumbnail;
      updateDto.photo1 = firm.photo1;
      updateDto.photo2 = firm.photo2;
      updateDto.photo3 = firm.photo3;

      setFirmDto(updateDto);
    }
  }, [firm]);

  // Init States
  const states = {
    loading: modifyFirmResponse.loading,
    navigation: props.navigation,
    firmDto,
    errorData,
  };

  // Init Actions
  const actions = {
    onClickUpdate: (): void => {
      validateUpdateFirmDto(firmDto)
        .then(result => {
          console.log('>>> update firmDto:', firmDto);
          console.log('>>> update result:', result);
          if (result === true) {
            modifyFirmRequest({
              variables: {
                accountId: userProfile.uid,
                updateFirm: getUpdateFirmDto(firmDto),
              },
            });
          } else if (result instanceof FirmCreateErrorData) {
            setErrorData(result);
          }
        })
        .catch(err => {
          noticeUserError(
            'FirmModifyProvider(validateModifyFirmDto -> error)',
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

export { useCtx as useFirmModifyProvider, FirmModifyProvider };
