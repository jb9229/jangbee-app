import * as React from 'react';

import { Alert, SafeAreaView, View } from 'react-native';
import { boolean, text } from '@storybook/addon-knobs';

import FirmHarmCaseLayout from '../../../src/components/templates/FirmHarmCaseLayout';
import { storiesOf } from '@storybook/react-native';

const SafeZonDecorator = storyFn => (
  <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
    {storyFn()}
  </SafeAreaView>
);

storiesOf('Layout Components', module)
  .addDecorator(SafeZonDecorator)
  .add('FirmHarmCase Layout', () => (
    <FirmHarmCaseLayout
      isLoading={boolean('isLoading', false)}
      counter={CntBoardData}
      list={[]}
      onClick={i => {
        Alert.alert(`action: click${i}`);
      }}
      setMyClinetEvaluList={() => {}}
      onClickNewestEvaluList={() => {}}
      setVisibleCreateModal={(flag: boolean) => {}}
      searchFilterCliEvalu={() => {}}
    />
  ));

const CntBoardData = [
  {
    title: '전체글',
    count: 12345,
    onClick: i => {
      Alert.alert(`action: click${i}`);
    }
  },
  {
    title: '내글',
    count: 123,
    onClick: i => {
      Alert.alert(`action: click${i}`);
    }
  }
];
