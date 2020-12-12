import * as React from 'react';

import { DefaultNavigationProps } from 'src/types';
import FirmModifyLayout from 'src/container/firm/FirmModifyLayout';
import { FirmModifyProvider } from 'src/container/firm/FirmModifyProvider';

interface Props {
  navigation: DefaultNavigationProps;
}
const CreateAd: React.FC<Props> = (props) =>
{
  return (
    <FirmModifyProvider navigation={props.navigation}>
      <FirmModifyLayout />
    </FirmModifyProvider>
  );
};

export default CreateAd;
