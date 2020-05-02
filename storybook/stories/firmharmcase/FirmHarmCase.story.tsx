import * as React from 'react';

import FirmHarmCaseSBProvider, { FirmHarmCaseObj } from 'storybook/stories/firmharmcase/FirmHarmCaseSBProvider';
import { SafeAreaView, View } from 'react-native';
import { boolean, text } from '@storybook/addon-knobs';

import { Evaluation } from 'src/contexts/FirmHarmCaseContext';
import FirmHarmCaseItem from 'src/components/organisms/FirmHarmCaseItem';
import FirmHarmCaseLayout from 'src/components/templates/FirmHarmCaseLayout';
import FirmHarmCaseList from 'container/firmHarmCase/list';
import FirmHarmCaseProvider from 'src/container/firmHarmCase/FirmHarmCaseProvider';
import { storiesOf } from '@storybook/react-native';

const SafeZonDecorator = (storyFn): React.ReactElement => (
  <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
    {storyFn()}
  </SafeAreaView>
);

storiesOf('업체 피해사례', module)
  .addDecorator(SafeZonDecorator)
  .add('사례 아이템', () => (
    <View style={{ width: '90%', aspectRatio: 6 }}>
      <FirmHarmCaseItem
        item={FirmHarmCaseObj}
        accountId="testm account"
        updateCliEvalu={(item: Evaluation) => {}}
        deleteCliEvalu={(id: string) => {}}
        openCliEvaluLikeModal={(item: Evaluation, mine: boolean) => {}}
        openDetailModal={(item: Evaluation) => {}}
        searchTime="2020.05.02"
      />
    </View>
  ))
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
      <FirmHarmCaseSBProvider navigation={navigation}>
        <FirmHarmCaseLayout />
      </FirmHarmCaseSBProvider>
    );
  }))
;
