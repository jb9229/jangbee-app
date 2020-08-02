import * as React from 'react';

import FirmHarmCaseSBProvider, { FirmHarmCaseObj } from 'storybook/provider/FirmHarmCaseSBProvider';
import { SafeAreaView, View } from 'react-native';
import { boolean, text } from '@storybook/addon-knobs';

import { Evaluation } from 'src/contexts/FirmHarmCaseContext';
import FirmHarmCaseItem from 'src/components/organisms/FirmHarmCaseItem';
import FirmHarmCaseLayout from 'src/components/templates/FirmHarmCaseLayout';
import FirmHarmCaseList from 'container/firmHarmCase/list';
import FirmHarmCaseProvider from 'src/container/firmHarmCase/FirmHarmCaseProvider';
import FirmHarmCaseSearchLayout from 'src/components/templates/FirmHarmCaseSearchLayout';
import FirmHarmCaseSearchSBProvider from 'storybook/provider/FirmHarmCaseSearchSBProvider';
import { storiesOf } from '@storybook/react-native';

const SafeZonDecorator = (storyFn): React.ReactElement => (
  <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
    {storyFn()}
  </SafeAreaView>
);

const navigation = {
  navigate: (path: string, params: object): void =>
  { if (path === 'WorkList') { alert('Success Story, Registry Work') } },
  getParam: () => { return false },
  state: {
    params: (): void => console.log('navigate() called!')
  }
};

storiesOf('업체 피해사례', module)
  .addDecorator(SafeZonDecorator)
  .add('홈', () => React.createElement(() =>
  {
    return (
      <FirmHarmCaseSBProvider navigation={navigation}>
        <FirmHarmCaseLayout />
      </FirmHarmCaseSBProvider>
    );
  }))
  .add('조회', () => React.createElement((): React.ReactElement =>
  {
    return (
      <FirmHarmCaseSearchSBProvider navigation={navigation}>
        <FirmHarmCaseSearchLayout/>
      </FirmHarmCaseSearchSBProvider>
    );
  }))
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
;
