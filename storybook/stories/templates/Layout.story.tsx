import * as React from 'react';

import { Alert, SafeAreaView } from 'react-native';
import { boolean, text } from '@storybook/addon-knobs';

import CreateAd from 'container/ad/create';
import FirmOpenWorkList from 'organisms/FirmOpenWorkList';
import { User } from 'firebase';
import WorkRegisterScreen from '../../../src/screens/WorkRegisterScreen';
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
  .add('Firm OpenWork List', () => React.createElement(() =>
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
      <FirmOpenWorkList
        isListEmpty={boolean('isEmpty', false)}
        list={[{ workState: text('Status1(OPEN, SELECTED)', 'OPEN'), applied: false, guarTimeExpire: 30, equipment: '거미 크레인', phoneNumber: '0102222222', startDate: '2020-02-17', endDate: '2020-03-17', period: 2, sidoAddr: '서울 중량구', sigunguAddr: '면목동', detailRequest: '첫날 현장 출입증을 발급 받아야 합니다' },
          { workState: text('Status2(OPEN, SELECTED)', 'SELECTED'), applied: false, guarTimeExpire: 30, equipment: '카고 크레인', phoneNumber: '0102222222', startDate: '2020-02-17', endDate: '2020-03-17', period: 2, sidoAddr: '서울 중량구', sigunguAddr: '면목동', detailRequest: '첫날 현장 출입증을 발급 받아야 합니다' }]}
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
;
