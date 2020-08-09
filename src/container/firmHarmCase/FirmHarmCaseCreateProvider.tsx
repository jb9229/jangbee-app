import * as React from 'react';

import { FirmHarmCaseCreateDto, FirmHarmCaseCreateErrorDto } from './type';
import { createFirmHarmCase, validateCrateFirmHarmCase } from './createAction';

import { DefaultNavigationProps } from 'src/types';
import { Provider } from 'src/contexts/FirmHarmCaseCreateContext';
import { noticeUserError } from '../request';
import { useLoginContext } from 'src/contexts/LoginContext';

interface Props {
  children?: React.ReactElement;
  navigation: DefaultNavigationProps;
}
const FirmHarmCaseCreateProvider = (props: Props): React.ReactElement =>
{
  const { user } = useLoginContext();
  const [createDto, setCreateDto] = React.useState(new FirmHarmCaseCreateDto());
  const [createErrorDto, setCreateErrorDto] = React.useState(new FirmHarmCaseCreateErrorDto());

  // Server api call
  // Init Actions
  // Init States
  const states = {
    createDto,
    createErrorDto
  };

  const actions = {
    onClickAdd() {
      console.log('onClick add: ', createDto);
      const newErrorDto = new FirmHarmCaseCreateErrorDto();
      validateCrateFirmHarmCase(createDto, newErrorDto)
        .then((result) => {
          setCreateErrorDto(newErrorDto);
          if (result) {
            createFirmHarmCase(user.uid, createDto)
              .then((result) => { props.navigation.navigate('FirmHarmCaseSearch', { searchWork: createDto.telNumber }) })
              .catch(error => noticeUserError(error.error, error.message));
          }
        })
    }
  };
  // UI Component
  return (
    <Provider value={{ ...states, ...actions }}>{props.children}</Provider>
  );
};
export default FirmHarmCaseCreateProvider;