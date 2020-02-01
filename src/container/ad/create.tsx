import * as React from 'react';

import { AdCreateProvider } from 'src/contexts/AdCreateProvider';
import CreateAdLayout from 'templates/CreateAdLayout';
import { DefaultNavigationProps } from 'src/types';
import { useLoginProvider } from 'src/contexts/LoginProvider';

interface Props {
  navigation: DefaultNavigationProps;
}
const CreateAd: React.FC<Props> = (props) =>
{
  const { user } = useLoginProvider();
  return (
    <AdCreateProvider navigation={props.navigation} user={user}>
      <CreateAdLayout />
    </AdCreateProvider>
  );
};

export default CreateAd;
