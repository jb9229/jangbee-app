import * as React from 'react';

import { DefaultNavigationProps } from 'src/types';
import FirmHarmCaseLayout from 'src/components/templates/FirmHarmCaseLayout';
import FirmHarmCaseProvider from 'src/container/firmHarmCase/FirmHarmCaseProvider';

interface Props {
  navigation: DefaultNavigationProps;
}
function FirmHarmCaseContainer (props): React.ReactElement
{
  return (
    <FirmHarmCaseProvider navigation={props.navigation}>
      <FirmHarmCaseLayout />
    </FirmHarmCaseProvider>
  );
}

FirmHarmCaseContainer.navigationOptions = ({ navigation }) => ({
  title: '피해사례 고객'
});

export default FirmHarmCaseContainer;
