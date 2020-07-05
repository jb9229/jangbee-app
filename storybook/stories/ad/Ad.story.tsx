import * as React from 'react';

import CreateAd from 'container/ad/create';
import { SafeAreaView } from 'react-native';
import { User } from 'firebase';
import { storiesOf } from '@storybook/react-native';
import { useLoginContext } from 'src/contexts/LoginContext';

export const SafeZonDecorator = (storyFn): React.ReactElement => (
  <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
    {storyFn()}
  </SafeAreaView>
);

storiesOf('광고', module)
  .addDecorator(SafeZonDecorator)
  .add('광고등록', () => React.createElement(() =>
  {
    const { setUser } = useLoginContext();
    React.useEffect(() =>
    {
      const user: User =
      {
        uid: 'HGrkuKNAWyXVpT8gegrcSt1oJOH2', displayName: null, email: null,
        phoneNumber: '01052023337', photoURL: '', providerId: ''
      };

      setUser(user);
    }, []);

    return (
      <CreateAd />
    );
  }))
;
