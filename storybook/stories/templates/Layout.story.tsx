import * as React from 'react';

import { Alert, SafeAreaView, View } from 'react-native';
import CreateAdLayout, { AdType } from '../../../src/components/templates/CreateAdLayout';
import { boolean, number, text } from '@storybook/addon-knobs';

import { AdCreateProvider } from 'src/contexts/AdCreateProvider';
import FirmHarmCaseLayout from '../../../src/components/templates/FirmHarmCaseLayout';
import { storiesOf } from '@storybook/react-native';

const SafeZonDecorator = storyFn => (
  <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
    {storyFn()}
  </SafeAreaView>
);

storiesOf('Layout Components', module)
  .addDecorator(SafeZonDecorator)
  .add('Create Ad Layout', () => React.createElement(() =>
  {
    const [adType, setAdType] = React.useState<AdType>();
    const bookedAdList = [1, 2];
    return (
      <AdCreateProvider>
        <CreateAdLayout />
      </AdCreateProvider>
    );
  }));

const CntBoardData = [
  {
    title: '전체글',
    count: 12345,
    onClick: i =>
    {
      Alert.alert(`action: click${i}`);
    }
  },
  {
    title: '내글',
    count: 123,
    onClick: i =>
    {
      Alert.alert(`action: click${i}`);
    }
  }
];
