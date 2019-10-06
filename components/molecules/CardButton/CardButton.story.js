import React from 'react';
import { storiesOf } from '@storybook/react-native';
import CardButton from './CardButton';

storiesOf('CardButton', module).add('Default Story', () => (
  <CardButton
    title="전체 글"
    value="5000"
    action="최신 피해사례 조회하기"
    onPress={() => console.log('onPress CardButton')}
  />
));
