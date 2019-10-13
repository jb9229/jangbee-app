import * as React from 'react';
import { SafeAreaView } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import SettingList from 'organisms/SettingList';
import { action } from '@storybook/addon-actions';
import { text, boolean } from '@storybook/addon-knobs';

const SafeZonDecorator = storyFn => <SafeAreaView>{storyFn()}</SafeAreaView>;

storiesOf('Organisms Components', module)
  .addDecorator(SafeZonDecorator)
  .add('Setting List', () => (
    <SettingList data={DATA} title={text('title', 'xxx 리스트')} />
  ));

const DATA = [
  {
    title: 'Main dishes',
    data: [
      {
        iconName: 'food',
        iconType: 'MaterialCommunityIcons',
        switchOn: false,
        text: '수제 햄버거'
      },
      {
        img: require('assets/images/icon/alarm_icon.png'),
        switchOn: false,
        text: '주방장 추천 오늘의 요리'
      }
    ]
  },
  {
    title: 'Sides',
    data: [
      {
        iconName: 'ios-cafe',
        switchOn: false,
        text: '이디야 커피',
        switchAction: () => {
          action('coffeSettingAction');
        }
      },
      { iconName: 'ios-call', switchOn: true, text: '전화사용' }
    ]
  }
];
