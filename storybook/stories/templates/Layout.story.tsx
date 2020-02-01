import * as React from 'react';

import CreateAd from 'container/ad/create';
import { SafeAreaView } from 'react-native';
import { User } from 'firebase';
import { storiesOf } from '@storybook/react-native';
import { useLoginProvider } from 'src/contexts/LoginProvider';

const SafeZonDecorator = (storyFn): React.ReactElement => (
  <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
    {storyFn()}
  </SafeAreaView>
);

storiesOf('Layout Components', module)
  .addDecorator(SafeZonDecorator)
  .add('Create Ad Layout', () => React.createElement(() =>
  {
    const { setUser } = useLoginProvider();
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
  }));
