import * as React from 'react';

import { Alert, SafeAreaView } from 'react-native';

import { Firm } from 'src/apollo/generated';
import FirmWorkListScreen from 'container/firmwork/list';
import { User } from 'firebase';
import { UserProfile } from 'src/types';
import WorkListScreen from '../../../src/screens/WorkListScreen';
import WorkRegisterScreen from '../../../src/container/work/register';
import { storiesOf } from '@storybook/react-native';
import { useLoginContext } from 'src/contexts/LoginContext';

const SafeZonDecorator = (storyFn): React.ReactElement => (
  <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
    {storyFn()}
  </SafeAreaView>
);

storiesOf('일감', module)
  .addDecorator(SafeZonDecorator)
  .add('일감등록', () =>
    React.createElement(() => {
      return (
        <WorkRegisterScreen
          user={user}
          navigation={{
            navigate: (path: string, params: object): void => {
              if (path === 'WorkList') {
                Alert.alert('Success Story, Registry Work');
              }
            },
            getParam: () => {
              return false;
            },
            state: {
              params: (): void => console.log('navigate() called!'),
            },
          }}
        />
      );
    })
  )
  .add('차주일감', () =>
    React.createElement(() => {
      const { setUserProfile } = useLoginContext();
      const user: User = {
        uid: 'HGrkuKNAWyXVpT8gegrcSt1oJOH2',
        displayName: null,
        email: null,
        phoneNumber: '01052023337',
        photoURL: '',
        providerId: '',
      };

      const firm: Firm = {
        id: '123321',
        accountId: 'HGrkuKNAWyXVpT8gegrcSt1oJOH2',
        fname: 'jangbeecall',
        equiListStr: '2톤 거미크레인',
        thumbnail: '',
        phoneNumber: '0102222222',
      };

      React.useEffect(() => {
        setUserProfile({ ...user });
      }, []);

      return (
        <FirmWorkListScreen
          user={user}
          navigation={{
            navigate: (path: string, params: object): void => {
              if (path === 'WorkList') {
                Alert.alert('Success Story, Registry Work');
              }
            },
            state: {
              params: (): void => console.log('navigate() called!'),
            },
          }}
        />
      );
    })
  )
  .add('고객일감', () =>
    React.createElement(() => {
      const { setUserProfile } = useLoginContext();
      const user: UserProfile = {
        uid: 'HGrkuKNAWyXVpT8gegrcSt1oJOH2',
        phoneNumber: '01052023337',
      };

      React.useEffect(() => {
        setUserProfile(user);
      }, []);

      return (
        <WorkListScreen
          user={user}
          navigation={{
            navigate: (path: string, params: object): void => {
              if (path === 'AppliFirmList') {
                Alert.alert('차주선택(고객) 스토리에서 해주세요!');
              }
            },
            state: {
              params: (): void => console.log('navigate() called!'),
            },
          }}
        />
      );
    })
  );
