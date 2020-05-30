import * as React from 'react';

import { SafeAreaView, Text, View } from 'react-native';

import pkg from 'app.json';
import { storiesOf } from '@storybook/react-native';

const SafeZonDecorator = (storyFn): React.ReactElement => (
  <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
    {storyFn()}
  </SafeAreaView>
);

storiesOf('일감', module)
  .addDecorator(SafeZonDecorator)
  .add('Welcome', () => React.createElement(() =>
  {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{`${pkg.mode}_${pkg.expo.version}`}</Text>
      </View>
    );
  }))
;
