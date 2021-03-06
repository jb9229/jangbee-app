import * as React from 'react';

import { FirmHarmCaseCreateDto, FirmHarmCaseCreateErrorDto } from './type';

import { DefaultNavigationProps } from 'src/types';
import { FIRMHARMCASE_COUNT } from 'src/api/queries';
import { FIRMHARMCASE_CREATE } from 'src/api/mutations';
import { Provider } from 'src/contexts/FirmHarmCaseCreateContext';
import { noticeUserError } from '../request';
import { useLoginContext } from 'src/contexts/LoginContext';
import { useMutation } from '@apollo/client';
import { validateCrateFirmHarmCase } from './createAction';

interface Props {
  children?: React.ReactElement;
  navigation: DefaultNavigationProps;
}
const FirmHarmCaseCreateProvider = (props: Props): React.ReactElement => {
  const { userProfile } = useLoginContext();
  const [createDto, setCreateDto] = React.useState(new FirmHarmCaseCreateDto());
  const [createErrorDto, setCreateErrorDto] = React.useState(
    new FirmHarmCaseCreateErrorDto()
  );
  const [createRequest, createResponse] = useMutation(FIRMHARMCASE_CREATE, {
    onCompleted: data => {
      if (data && data.createFirmHarmCase) {
        props.navigation.replace('FirmHarmCaseSearch', {
          searchWord: createDto.telNumber,
        });
      } else {
        noticeUserError(
          'FirmHarmCaseCreateProvider(createRequest -> error)',
          data?.createFirmHarmCase,
          userProfile
        );
      }
    },
    refetchQueries: [
      { query: FIRMHARMCASE_COUNT, variables: { id: userProfile?.uid } },
    ],
    onError: err => {
      noticeUserError(
        'FirmHarmCaseCreateProvider(createRequest -> error)',
        err?.message,
        userProfile
      );
    },
  });

  // Server api call
  // Init Actions
  // Init States
  const states = {
    createDto,
    createErrorDto,
  };

  const actions = {
    onClickAdd(): void {
      const newErrorDto = new FirmHarmCaseCreateErrorDto();
      validateCrateFirmHarmCase(createDto, newErrorDto).then(result => {
        setCreateErrorDto(newErrorDto);
        if (result) {
          createRequest({
            variables: {
              firmHarmCaseCrtDto: { accountId: userProfile?.uid, ...createDto },
            },
          });
          // export const createFirmHarmCase = (accountId: string, dto: FirmHarmCaseCreateDto): Promise<object> => {
          //   console.log('>>> createDto: ', dto)
          //   return api.createClientEvaluation({accountId, ...dto, amount: `${dto.amount}`});
          // }
        }
      });
    },
  };
  // UI Component
  return (
    <Provider value={{ ...states, ...actions }}>{props.children}</Provider>
  );
};
export default FirmHarmCaseCreateProvider;
