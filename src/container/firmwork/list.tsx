import * as React from 'react';

import { DefaultNavigationProps } from 'src/types';
import FirmWorkListLayout from 'src/components/templates/FirmWorkListLayout';
import { FirmWorkProvider } from 'src/container/firmwork/FirmWorkProvider';

interface Props {
  navigation: DefaultNavigationProps;
}
const CreateAd: React.FC<Props> = (props) =>
{
  return (
    <FirmWorkProvider navigation={props.navigation}>
      <FirmWorkListLayout navigation={props.navigation} />
    </FirmWorkProvider>
  );
};

export default CreateAd;
