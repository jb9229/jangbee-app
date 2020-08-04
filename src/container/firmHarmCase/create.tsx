import { DefaultNavigationProps } from 'src/types';
import FirmHarmCaseCreateLayout from 'src/components/templates/FirmHarmCaseCreateLayout';
import FirmHarmCaseCreateProvider from 'src/container/firmHarmCase/FirmHarmCaseCreateProvider';
import React from 'react';

interface Props {
  navigation: DefaultNavigationProps;
}
function FirmHarmCaseCreateContainer (props): React.ReactElement
{
  return (
    <FirmHarmCaseCreateProvider navigation={props.navigation}>
      <FirmHarmCaseCreateLayout />
    </FirmHarmCaseCreateProvider>
  );
}

export default FirmHarmCaseCreateContainer;
