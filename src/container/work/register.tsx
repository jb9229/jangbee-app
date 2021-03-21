import * as React from 'react';

import { FirmBottomTabParamList } from 'src/navigation/types';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import WorkRegisterLayout from 'src/container/work/WorkRegisterLayout';
import { WorkRegisterProvider } from 'src/container/work/WorkRegisterProvider';

interface Props {
  navigation: StackNavigationProp<FirmBottomTabParamList, 'WorkList'>;
  route: RouteProp<FirmBottomTabParamList, 'WorkList'>;
}
const WorkContainer: React.FC<Props> = ({ navigation, route }) => {
  return (
    <WorkRegisterProvider navigation={navigation} route={route}>
      <WorkRegisterLayout />
    </WorkRegisterProvider>
  );
};

export default WorkContainer;
