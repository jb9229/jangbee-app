import * as React from 'react';

import { boolean, text } from '@storybook/addon-knobs';

import FirmHarmCaseList from 'container/firmHarmCase/list';
import { SafeAreaView } from 'react-native';
import { storiesOf } from '@storybook/react-native';

const SafeZonDecorator = (storyFn): React.ReactElement => (
  <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
    {storyFn()}
  </SafeAreaView>
);

storiesOf('업체 피해사례', module)
  .addDecorator(SafeZonDecorator)
  .add('리스트', () => React.createElement(() =>
  {
    const navigation = {
      navigate: (path: string, params: object): void =>
      { if (path === 'WorkList') { Alert.alert('Success Story, Registry Work') } },
      getParam: () => { return false },
      state: {
        params: (): void => console.log('navigate() called!')
      }
    };

    return (
      <FirmHarmCaseList navigation={navigation}/>
    );
  }))
;
