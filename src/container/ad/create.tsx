import * as React from 'react';

import AdCreateLayout from 'src/components/templates/AdCreateLayout';
import { AdCreateProvider } from 'src/contexts/AdCreateProvider';
import { DefaultNavigationProps } from 'src/types';

interface Props {
  navigation: DefaultNavigationProps;
}
const CreateAd: React.FC<Props> = (props) =>
{
  return (
    <AdCreateProvider navigation={props.navigation}>
      <AdCreateLayout />
    </AdCreateProvider>
  );
};

export default CreateAd;
