import * as React from 'react';

import FirmWorkListLayout from 'src/components/templates/FirmWorkListLayout';
import { FirmWorkParamList } from 'src/navigation/types';
import { FirmWorkProvider } from 'src/container/firmwork/FirmWorkProvider';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

interface Props {
  navigation: StackNavigationProp<FirmWorkParamList, 'WorkList'>;
  route: RouteProp<FirmWorkParamList, 'WorkList'>;
}
const CreateAd: React.FC<Props> = props => {
  return (
    <FirmWorkProvider navigation={props.navigation} route={props.route}>
      <FirmWorkListLayout navigation={props.navigation} />
    </FirmWorkProvider>
  );
};

export default CreateAd;
