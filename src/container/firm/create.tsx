import * as React from 'react';

import { DefaultNavigationProps } from 'src/types';
import FirmRegisterLayout from 'src/container/firm/FirmRegisterLayout';
import { FirmRegisterProvider } from 'src/container/firm/FirmRegisterProvider';

interface Props {
  navigation: DefaultNavigationProps;
}
const CreateAd: React.FC<Props> = (props) =>
{
  return (
    <FirmRegisterProvider navigation={props.navigation}>
      <FirmRegisterLayout />
    </FirmRegisterProvider>
  );
};

export default CreateAd;
