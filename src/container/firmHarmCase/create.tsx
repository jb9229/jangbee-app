import * as React from 'react';

import { DefaultNavigationProps } from 'src/types';
import FirmHarmCaseCreateLayout from 'src/components/templates/FirmHarmCaseCreateLayout';
import FirmHarmCaseCreateProvider from 'src/container/firmHarmCase/FirmHarmCaseCreateProvider';

interface Props {
  navigation: DefaultNavigationProps;
}
const FirmHarmCaseCreateContainer = (props): React.ReactElement =>
{
  return (
    <FirmHarmCaseCreateProvider navigation={props.navigation}>
      <FirmHarmCaseCreateLayout />
    </FirmHarmCaseCreateProvider>
  );
}

export default FirmHarmCaseCreateContainer;
