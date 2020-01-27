import * as React from 'react';

import { AdCreateProvider } from 'src/contexts/AdCreateProvider';
import CreateAdLayout from 'templates/CreateAdLayout';
import { withLogin } from 'src/contexts/LoginProvider';

const CreateAd: React.FC = () =>
{
  return (
    <AdCreateProvider>
      <CreateAdLayout />
    </AdCreateProvider>
  );
};

export default CreateAd;
