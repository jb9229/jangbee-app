import * as React from 'react';

import { FirmHarmCaseCreateDto, FirmHarmCaseCreateErrorDto } from 'src/container/firmHarmCase/type';

import { DefaultNavigationProps } from 'src/types';
import { Provider } from 'src/contexts/FirmHarmCaseCreateContext';

interface Props {
  children?: React.ReactElement;
  navigation: DefaultNavigationProps;
}
const FirmHarmCaseCreateSBProvider = (props: Props): React.ReactElement =>
{
  const [createDto, setCreateDto] = React.useState(new FirmHarmCaseCreateDto());
  const [createErrorDto, setCreateErrorDto] = React.useState(new FirmHarmCaseCreateErrorDto());
  // Server api call
  // Init Actions
  // Init States
  const states = {
    createDto, createErrorDto
  };
  const actions = {
    onClickAdd() {
      alert('피해사례 추가 액션')
    }
  };
  // UI Component
  return (
    <Provider value={{ ...states, ...actions }}>{props.children}</Provider>
  );
};
export default FirmHarmCaseCreateSBProvider;