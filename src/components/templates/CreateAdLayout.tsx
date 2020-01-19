import * as React from 'react';

import Card from 'molecules/CardUI';
import EditText from 'molecules/EditText';
import EquipementModal from 'templates/EquipmentModal';
import ImagePickInput from 'molecules/ImagePickInput';
import JBErrorMessage from 'organisms/JBErrorMessage';
import MapAddWebModal from 'templates/MapAddWebModal';
import colors from 'constants/Colors';
import fonts from 'constants/Fonts';
import styled from 'styled-components/native';
import { useAdCreateProvider } from 'src/contexts/AdCreateProvider';

export enum AdType {
  MAIN_FIRST = 1,
  MAIN_SECONDE = 2,
  MAIN_THIRD = 3,
  SEARCH_EQUIPMENT_FIRST = 4,
  SEARCH_REGION_FIRST = 5,
}

export const getAdTypeStr = (type: AdType): string =>
{
  switch (type)
  {
    case AdType.MAIN_FIRST: return '메인광고_첫번째 (월 7만원)';
    case AdType.MAIN_SECONDE: return '메인광고_두번째 (월 5만원)';
    case AdType.MAIN_THIRD: return '메인광고_세번째 (월 3만원)';
    case AdType.SEARCH_EQUIPMENT_FIRST: return '장비 검색광고 (월 3만원)';
    case AdType.SEARCH_REGION_FIRST: return '지역 검색광고 (월 2만원)';
    default: throw new Error('Unknow Advertisement Type!');
  }
};

const Container = styled.View`
  flex: 1;
`;
const KeyboardAvoidingView = styled.KeyboardAvoidingView`flex: 1;`;
const ScrollView = styled.ScrollView.attrs({
  contentContainerStyle: {
    margin: 10,
    marginBottom: 8
  }
})``;
const AdTypeWrap = styled.View``;
const AdTypeTitle = styled.Text`
    font-family: ${fonts.titleMiddle};
    color: ${colors.title};
    font-size: 15;
    margin-bottom: 3;
`;
const Picker = styled.Picker``;

interface Props {
  imgUploadingMessage: string;
}
const CreateAdLayout: React.FC<Props> = (props) =>
{
  const {
    adState, isVisibleEquiModal, isVisibleAddrModal, bookedAdTypeList,
    setVisibleEquiModal, setVisibleAddrModal
  } = useAdCreateProvider();

  // const [adType, setAdType] = React.useState<AdType>(adState.createAdDto.adType);
  // const [forMonths, setForMonths] = React.useState<number>(adState.createAdDto.forMonths);
  // const [adTitle, setAdTitle] = React.useState<string>(adState.createAdDto.adTitle);
  // const [adSubTitle, setAdSubTitle] = React.useState<string>(adState.createAdDto.adSubTitle);
  // const [adPhotoUrl, setAdPhotoUrl] = React.useState<string>(adState.createAdDto.adPhotoUrl);
  // const [adTelNumber, setAdTelNumber] = React.useState<string>(adState.createAdDto.adTelNumber);
  // const [adSido, setAdSido] = React.useState<string>(adState.createAdDto.adSido);
  // const [adGungu, setAdGungu] = React.useState<string>(adState.createAdDto.adGungu);
  // const [adEquipment, setAdEquipment] = React.useState<string>(adState.createAdDto.adEquipment);

  return (
    <Container>
      <Card>
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={50}>
          <ScrollView>
            <AdTypeWrap>
              <AdTypeTitle>광고타입*</AdTypeTitle>
              <Picker
                selectedValue={adState.createAdDto.adType}
                onValueChange={(itemValue): void => { adState.createAdDto.adType = itemValue }}
              >
                <Picker.Item label="=== 광고타입 선택 ===" value={undefined} />
                {renderAdTypeList(AdType.MAIN_FIRST, bookedAdTypeList)}
                {renderAdTypeList(AdType.MAIN_SECONDE, bookedAdTypeList)}
                {renderAdTypeList(AdType.MAIN_THIRD, bookedAdTypeList)}
                <Picker.Item
                  label={getAdTypeStr(AdType.SEARCH_EQUIPMENT_FIRST)}
                  value={AdType.SEARCH_EQUIPMENT_FIRST}
                />
                <Picker.Item label={getAdTypeStr(AdType.SEARCH_REGION_FIRST)} value={AdType.SEARCH_REGION_FIRST} />
              </Picker>
            </AdTypeWrap>
            <EditText
              label="계약기간"
              subLabel="(월, 필수)"
              text={`${adState.createAdDto.forMonths}`}
              onChangeText={(text: string): void => { const month = Number.parseInt(text); if (month && !isNaN(month)) { adState.createAdDto.forMonths = month } }}
              placeholder="몇개월간 홍보하시겠습니까?"
              keyboardType="numeric"
            />
            <JBErrorMessage errorMSG={adState.createAdError.forMonths} />
            <EditText
              label="광고 타이틀"
              subLabel="(10자까지, 필수)"
              text={adState.createAdDto.adTitle}
              onChangeText={(text): void => { adState.createAdDto.adTitle = text }}
              placeholder="광고상단 문구를 입력하세요(최대 10자)"
            />
            <JBErrorMessage errorMSG={adState.createAdError.title} />
            <EditText
              label="광고 슬로건"
              subLabel="(20자까지, 필수)"
              text={adState.createAdDto.adSubTitle}
              onChangeText={(text): void => { adState.createAdDto.adSubTitle = text }}
              placeholder="광고하단 문구를 입력하세요(최대 20자)"
            />
            <JBErrorMessage errorMSG={adState.createAdError.subTitle} />
            <ImagePickInput
              itemTitle="광고배경 사진"
              imgUrl={adState.createAdDto.adPhotoUrl}
              setImageUrl={(url): void => { adState.createAdDto.adPhotoUrl = url }}
            />
            <JBErrorMessage errorMSG={adState.createAdError.photoUrl} />
            <EditText
              label="전화번호"
              text={adState.createAdDto.adTelNumber}
              onChangeText={(text): void => { adState.createAdDto.adTelNumber = text }}
              placeholder="휴대전화 번호입력(숫자만)"
            />
            <JBErrorMessage errorMSG={adState.createAdError.telNumber} />
            {(adState.createAdDto.adType === AdType.SEARCH_EQUIPMENT_FIRST || adState.createAdDto.adType === AdType.SEARCH_REGION_FIRST) && (
              <EditText
                label="타켓 광고(장비)"
                text={adState.createAdDto.adEquipment}
                onChangeText={(text): void => { adState.createAdDto.adEquipment = text }}
                onFocus={(): void => setVisibleEquiModal(true)}
                placeholder="타켓광고 장비 선택해 주세요"
              />
            )}
            <JBErrorMessage errorMSG={adState.createAdError.equipment} />
            {adState.createAdDto.adType === AdType.SEARCH_REGION_FIRST && (
              <EditText
                label="타켓 광고(지역)"
                text={`${adState.createAdDto.adSido}${adState.createAdDto.adGungu}`}
                onFocus={(): void => setVisibleAddrModal(true)}
                placeholder="타켓광고 지역을 선택해 주세요"
              />
            )}
            <JBErrorMessage errorMSG={adState.createAdError.local} />
          </ScrollView>
        </KeyboardAvoidingView>
      </Card>
      <EquipementModal
        isVisibleEquiModal={isVisibleEquiModal}
        closeModal={(): void => setVisibleEquiModal(false)}
        selEquipmentStr={adState.createAdDto.adEquipment}
        completeSelEqui={(seledEuipListStr: string): void =>
        {
          adState.createAdDto.adEquipment = seledEuipListStr;
        }}
        nextFocus={(): void => {}}
        singleSelectMode
      />
      <MapAddWebModal
        isVisibleMapAddModal={isVisibleAddrModal}
        setMapAddModalVisible={(visible): void => { setVisibleAddrModal(visible) }}
        saveAddrInfo={(addrData): void =>
        {
          adState.createAdDto.adSido = addrData.sidoAddr;
          adState.createAdDto.adGungu = addrData.sigunguAddr;
        }}
        nextFocus={(): void => {}}
      />
    </Container>
  );
};

/**
* 광고타입 렌더링 함수
*/
const renderAdTypeList = (adType: AdType, bookedAdTypeList: Array<number>): React.ReactElement =>
{
  if (bookedAdTypeList.includes(adType))
  {
    return <Picker.Item label={getAdTypeStr(adType)} value={adType} />; // color="gray" it is issued when onselect
  }

  return <Picker.Item label={getAdTypeStr(adType)} value={adType} />;
};

export default CreateAdLayout;
