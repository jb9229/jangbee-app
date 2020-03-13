import * as React from 'react';

import { Alert, SafeAreaView } from 'react-native';
import { Firm, useLoginProvider } from 'src/contexts/LoginProvider';
import { boolean, text } from '@storybook/addon-knobs';

import CreateAd from 'container/ad/create';
import FirmWorkListScreen from 'container/firmwork/list';
import { User } from 'firebase';
import WorkListScreen from '../../../src/screens/WorkListScreen';
import WorkRegisterScreen from '../../../src/screens/WorkRegisterScreen';
import { storiesOf } from '@storybook/react-native';

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
  }))
  .add('Register Work', () => React.createElement(() =>
  {
    const { setUser } = useLoginProvider();
    const user: User =
    {
      uid: 'HGrkuKNAWyXVpT8gegrcSt1oJOH2', displayName: null, email: null,
      phoneNumber: '01052023337', photoURL: '', providerId: ''
    };

    React.useEffect(() =>
    {
      setUser(user);
    }, []);

    return (
      <WorkRegisterScreen
        user={user}
        navigation={{
          navigate: (path: string, params: object): void =>
          { if (path === 'WorkList') { Alert.alert('Success Story, Registry Work') } },
          state: {
            params: (): void => console.log('navigate() called!')
          }
        }}
      />
    );
  }))
  .add('FirmWorkListLayout', () => React.createElement(() =>
  {
    const { setUser, setFirm } = useLoginProvider();
    const user: User =
    {
      uid: 'HGrkuKNAWyXVpT8gegrcSt1oJOH2', displayName: null, email: null,
      phoneNumber: '01052023337', photoURL: '', providerId: ''
    };

    const firm: Firm =
    {
      id: '123321', accountId: 'HGrkuKNAWyXVpT8gegrcSt1oJOH2', fname: 'jangbeecall',
      equiListStr: '2톤 거미크레인', thumbnail: '', phoneNumber: '0102222222'
    };

    React.useEffect(() =>
    {
      setUser(user);
      setFirm(firm);
    }, []);

    return (
      <FirmWorkListScreen
        user={user}
        navigation={{
          navigate: (path: string, params: object): void =>
          { if (path === 'WorkList') { Alert.alert('Success Story, Registry Work') } },
          state: {
            params: (): void => console.log('navigate() called!')
          }
        }}
      />
    );
  }))
  .add('ClientWorkListLayout', () => React.createElement(() =>
  {
    const { setUser, setFirm } = useLoginProvider();
    const user: User =
    {
      uid: 'HGrkuKNAWyXVpT8gegrcSt1oJOH2', displayName: null, email: null,
      phoneNumber: '01052023337', photoURL: '', providerId: ''
    };

    React.useEffect(() =>
    {
      setUser(user);
    }, []);

    return (
      <WorkListScreen
        user={user}
        navigation={{
          navigate: (path: string, params: object): void =>
          { if (path === 'AppliFirmList') { Alert.alert('Move to Apply Firm List') } },
          state: {
            params: (): void => console.log('navigate() called!')
          }
        }}
      />
    );
  }))
;
