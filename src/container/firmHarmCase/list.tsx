import * as React from 'react';

import { FirmBottomTabParamList } from 'src/navigation/types';
import FirmHarmCaseLayout from 'src/components/templates/FirmHarmCaseLayout';
import FirmHarmCaseProvider from 'src/container/firmHarmCase/FirmHarmCaseProvider';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

interface Props {
  navigation: StackNavigationProp<FirmBottomTabParamList, 'ClientEvalu'>;
  route: RouteProp<FirmBottomTabParamList, 'ClientEvalu'>;
}
const FirmHarmCaseContainer: React.FC<Props> = ({
  navigation,
  route,
}): React.ReactElement => {
  return (
    <FirmHarmCaseProvider navigation={navigation} route={route}>
      <FirmHarmCaseLayout />
    </FirmHarmCaseProvider>
  );
};

export default FirmHarmCaseContainer;
