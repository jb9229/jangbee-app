import * as React from 'react';

import CreateAdLayout from 'templates/CreateAdLayout';
import { JBSERVER_ADBOOKED } from '../../constants/Url';
import LoadingIndicator from 'molecules/LoadingIndicator';
import { notifyError } from 'common/ErrorNotice';
import useAxios from 'axios-hooks';
import { withLogin } from 'contexts/LoginProvider';

interface Props {

}
const CreateAd: React.FC<Props> = (props) =>
{
  // Init Query
  const [{ data, loading, error }, refetch] = useAxios(JBSERVER_ADBOOKED);

  if (error) { notifyError('Create Ad Error!', error.message) };

  if (data) { console.log(data) };

  return (
    <>
      <CreateAdLayout />
      <LoadingIndicator visible={loading} />
    </>
  );
};

export default withLogin(CreateAd);
