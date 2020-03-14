import * as React from 'react';

import { Alert, SafeAreaView, View } from 'react-native';
import { boolean, text } from '@storybook/addon-knobs';

import AppliFirmList from 'organisms/AppliFirmList';
import CountBoard from 'organisms/CountBoard';
import FirmHarmCaseHeader from 'organisms/FirmHarmCaseHeader';
import FirmOpenWorkList from 'organisms/FirmOpenWorkList';
import SettingList from 'organisms/SettingList';
import { User } from 'firebase';
import { storiesOf } from '@storybook/react-native';

const SafeZonDecorator = storyFn => (
  <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
    {storyFn()}
  </SafeAreaView>
);

storiesOf('Organisms Components', module)
  .addDecorator(SafeZonDecorator)
  .add('Setting List', () => (
    <SettingList data={DATA} title={text('title', 'xxx 리스트')} />
  ))
  .add('CountBoard', () => (
    <View style={{ width: '90%', aspectRatio: 6 }}>
      <CountBoard
        data={CntBoardData}
        onClick={i =>
        {
          Alert.alert(`action: click${i}`);
        }}
      />
    </View>
  ))
  .add('FirmHarmCaseHeader', () => <FirmHarmCaseHeader setMyClinetEvaluList={() => {}}
    onClickNewestEvaluList={() => {}}
    setVisibleCreateModal={(flag: boolean) => {}}
    searchFilterCliEvalu={() => {}}/>
  )
  .add('Firm OpenWork List', () => React.createElement(() =>
  {
    const { setUser } = useLoginProvider();
    const user: User =
    {
      uid: 'HGrkuKNAWyXVpT8gegrcSt1oJOH2', displayName: null, email: null,
      phoneNumber: '01052023337', photoURL: '', providerId: ''
    };

    React.useEffect(() =>
    {
      setUser(user);
    }, []);

    return (
      <FirmOpenWorkList
        isListEmpty={boolean('isEmpty', false)}
        list={[{ workState: text('Status1(OPEN, SELECTED)', 'OPEN'), applied: false, guarTimeExpire: 30, equipment: '거미 크레인', phoneNumber: '0102222222', startDate: '2020-02-17', endDate: '2020-03-17', period: 2, sidoAddr: '서울 중량구', sigunguAddr: '면목동', detailRequest: '첫날 현장 출입증을 발급 받아야 합니다' },
          { workState: text('Status2(OPEN, SELECTED)', 'SELECTED'), applied: false, guarTimeExpire: 30, equipment: '카고 크레인', phoneNumber: '0102222222', startDate: '2020-02-17', endDate: '2020-03-17', period: 2, sidoAddr: '서울 중량구', sigunguAddr: '면목동', detailRequest: '첫날 현장 출입증을 발급 받아야 합니다' }]}
        user={user}
        navigation={{
          navigate: (path: string, params: object): void =>
          { if (path === 'WorkList') { Alert.alert('Success Story, Registry Work') } },
          state: {
            params: (): void => console.log('navigate() called!')
          }
        }}
      />
    );
  }))
  .add('차주선택(고객)', () => React.createElement((): React.ReactElement =>
  {
    // const { setUser } = useLoginProvider();
    // const user: User =
    // {
    //   uid: 'HGrkuKNAWyXVpT8gegrcSt1oJOH2', displayName: null, email: null,
    //   phoneNumber: '01052023337', photoURL: '', providerId: ''
    // };

    // React.useEffect(() =>
    // {
    //   setUser(user);
    // }, []);

    const navigation =
    {
      navigate: (path: string, params: object): void =>
      { if (path === 'WorkList') { Alert.alert('배차 요청 성공!', '차주일감 화면에서 확인하세요') } },
      getParam: (param: string): string => { return '5' }
    };

    return (
      <AppliFirmList workId="5" navigation={navigation}/>
    );
  }))
;

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
        img: require('../../../assets/images/icon/alarm_icon.png'),
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
        switchAction: () =>
        {
          action('coffeSettingAction');
        }
      },
      { iconName: 'ios-call', switchOn: true, text: '전화사용' }
    ]
  }
];

const CntBoardData = [
  {
    title: '전체글',
    count: 12345
  },
  {
    title: '내글',
    count: 123
  }
];
