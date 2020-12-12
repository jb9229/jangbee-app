import * as React from 'react';

import { DefaultNavigationProps } from 'src/types';
import WorkRegisterLayout from 'src/container/work/WorkRegisterLayout';
import { WorkRegisterProvider } from 'src/container/work/WorkRegisterProvider';

interface Props {
  navigation: DefaultNavigationProps;
}
const CreateAd: React.FC<Props> = (props) =>
{
  return (
    <WorkRegisterProvider navigation={props.navigation}>
      <WorkRegisterLayout />
    </WorkRegisterProvider>
  );
};

export default CreateAd;
