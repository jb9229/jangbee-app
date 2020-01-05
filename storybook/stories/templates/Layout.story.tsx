import * as React from 'react';

import { Alert, SafeAreaView, View } from 'react-native';
import CreateAdLayout, { AdType } from '../../../src/components/templates/CreateAdLayout';
import { boolean, number, text } from '@storybook/addon-knobs';

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
      onClick={(i): void =>
      {
        Alert.alert(`action: click${i}`);
      }}
      setMyClinetEvaluList={(): void => {}}
      onClickNewestEvaluList={(): void => {}}
      setVisibleCreateModal={(): void => {}}
      searchFilterCliEvalu={(): void => {}}
    />
  ))
  .add('Create Ad Layout', () => React.createElement(() =>
  {
    const [adType, setAdType] = React.useState<AdType>();
    const bookedAdList = [1, 2];
    return (
      <CreateAdLayout
        isVisibleEquiModal={false}
        isVisibleMapAddModal={false}
        bookedAdTypeList={bookedAdList}
        adSido=''
        adGungu=''
        adEquipment=''
        adType={adType}
        forMonths={1}
        adTitle=''
        adSubTitle=''
        adPhotoUrl=''
        adTelNumber=''
        imgUploadingMessage=''
        adLocalValErrMessage=''
        adEquipmentValErrMessage=''
        adTelNumberValErrMessage=''
        adPhotoUrlValErrMessage=''
        adSubTitleValErrMessage=''
        adTitleValErrMessage=''
        forMonthsValErrMessage=''
        setAdSido={(sido: string) => {}}
        setAdGungu={(gungu: string) => {}}
        setForMonths={(month: number) => {}}
        setAdTitle={(title: string) => {}}
        setAdSubTitle={(title: string) => {}}
        setAdPhotoUrl={(url: string) => {}}
        setAdTelnumber={(tel: string) => {}}
        setAdEquipment={(equi: string) => {}}
        setVisibleEquiModal={(flag: boolean) => {}}
        setVisibleMapAddModal={(flag: boolean) => {}}
        setSelectEuipment={(equipment: string) => {}}
        isVisibleActIndiModal={(flag: boolean) => {}}
        onPickAdType={(type: AdType): void =>
        {
          if (bookedAdList.includes(type)) { Alert.alert('죄송합니다, 이미 계약된 광고입니다', '자세한 문의는 카톡 상담 부탁 드립니다.'); return }
          setAdType(type);
        }}
      />
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
