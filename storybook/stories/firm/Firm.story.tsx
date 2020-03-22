import * as React from 'react';

import { Alert, SafeAreaView } from 'react-native';
import { boolean, text } from '@storybook/addon-knobs';

import FirmRegisterScreen from '../../../src/container/firm/create';
import { User } from 'firebase';
import { storiesOf } from '@storybook/react-native';
import { useLoginProvider } from 'src/contexts/LoginProvider';

const SafeZonDecorator = (storyFn): React.ReactElement => (
  <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
    {storyFn()}
  </SafeAreaView>
);

storiesOf('업체', module)
  .addDecorator(SafeZonDecorator)
  .add('등록', () => React.createElement(() =>
  {
    const { setUser, setUserProfile } = useLoginProvider();
    const user: User =
    {
      uid: 'HGrkuKNAWyXVpT8gegrcSt1oJOH2', displayName: null, email: null,
      phoneNumber: '01052023337', photoURL: '', providerId: ''
    };

    React.useEffect(() =>
    {
      setUser(user);
      setUserProfile({ userType: 2, sid: undefined });
    }, []);

    return (
      <FirmRegisterScreen
        navigation={{
          navigate: (path: string, params: object): void =>
          { if (path === 'WorkList') { Alert.alert('Success Story, Registry Work') } },
          state: {
            params: (): void => console.log('navigate() called!')
          }
        }}
      />
    );
  }));
