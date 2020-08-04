import * as React from 'react';

import { FirmHarmCaseCreateDto, FirmHarmCaseCreateErrorDto } from './type';
import { createFirmHarmCase, validateCrateFirmHarmCase } from './createAction';

import { DefaultNavigationProps } from 'src/types';
import { Provider } from 'src/contexts/FirmHarmCaseCreateContext';
import { noticeUserError } from '../request';

interface Props {
  children?: React.ReactElement;
  navigation: DefaultNavigationProps;
}
const FirmHarmCaseCreateProvider = (props: Props): React.ReactElement =>
{
  const [createDto, setCreateDto] = React.useState(new FirmHarmCaseCreateDto());
  const [createErrorDto, setCreateErrorDto] = React.useState(new FirmHarmCaseCreateErrorDto());

  // Server api call
  // Init Actions
  // Init States
  const states = {
    createDto
  };

  const actions = {
    completeAction () {
      if (!validateCrateFirmHarmCase(createDto, createErrorDto)) { return; }

      createFirmHarmCase(createDto)
        .catch(error => noticeUserError(error.error, error.message));
    }
  };
  // UI Component
  return (
    <Provider value={{ ...states, ...actions }}>{props.children}</Provider>
  );
};
export default FirmHarmCaseCreateProvider;