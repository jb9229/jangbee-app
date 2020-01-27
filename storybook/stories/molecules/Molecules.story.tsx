import * as React from 'react';

import EditText from 'molecules/EditText';
import { SafeAreaView } from 'react-native';
import { storiesOf } from '@storybook/react-native';

const SafeZonDecorator = (storyFn) => (
  <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
    {storyFn()}
  </SafeAreaView>
);

storiesOf('Molecules Component', module)
  .addDecorator(SafeZonDecorator)
  .add('EditText', () => React.createElement(() =>
  {
    const [text, setText] = React.useState();

    return (
      <EditText label="제목" subLabel="(필수, 2자이상)" text={text} onChangeText={(text) => setText(text)} />
    );
  })
  );
