import * as React from 'react';

import { AdCreateProvider } from 'src/contexts/AdCreateProvider';
import CreateAdLayout from 'templates/CreateAdLayout';
import { DefaultNavigationProps } from 'src/types';

interface Props {
  navigation: DefaultNavigationProps;
}
const CreateAd: React.FC<Props> = (props) =>
{
  return (
    <AdCreateProvider navigation={props.navigation}>
      <CreateAdLayout />
    </AdCreateProvider>
  );
};

export default CreateAd;
