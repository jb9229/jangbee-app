import * as React from 'react';

import Card from 'molecules/CardUI';
import EquipementModal from 'templates/EquipmentModal';
import ImagePickInput from 'molecules/ImagePickInput';
import JBActIndicatorModal from 'templates/JBActIndicatorModal';
import JBErrorMessage from 'organisms/JBErrorMessage';
import JBTextInput from 'molecules/JBTextInput';
import MapAddWebModal from 'templates/MapAddWebModal';
import colors from 'constants/Colors';
import fonts from 'constants/Fonts';
import styled from 'styled-components/native';

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
  isVisibleEquiModal: boolean;
  isVisibleMapAddModal: boolean;
  bookedAdTypeList: Array<number>;
  adSido: string;
  adGungu: string;
  adEquipment: string;
  adType: AdType;
  forMonths: number;
  adTitle: string;
  adSubTitle: string;
  adPhotoUrl: string;
  adTelNumber: string;
  imgUploadingMessage: string;
  adLocalValErrMessage: string;
  adEquipmentValErrMessage: string;
  adTelNumberValErrMessage: string;
  adPhotoUrlValErrMessage: string;
  adSubTitleValErrMessage: string;
  adTitleValErrMessage: string;
  forMonthsValErrMessage: string;
  onPickAdType: (type: AdType) => void;
  setAdSido: (sido: string) => void;
  setAdGungu: (gungu: string) => void;
  setForMonths: (month: number) => void;
  setAdTitle: (title: string) => void;
  setAdSubTitle: (title: string) => void;
  setAdPhotoUrl: (url: string) => void;
  setAdTelnumber: (tel: string) => void;
  setAdEquipment: (equi: string) => void;
  setVisibleEquiModal: (flag: boolean) => void;
  setVisibleMapAddModal: (flag: boolean) => void;
  setSelectEuipment: (equipment: string) => void;
  isVisibleActIndiModal: (flag: boolean) => void;
}
const CreateAdLayout: React.FC<Props> = (props) =>
{
  return (
    <Container>
      <Card>
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={50}>
          <ScrollView>
            <EquipementModal
              isVisibleEquiModal={props.isVisibleEquiModal}
              closeModal={props.setVisibleEquiModal}
              selEquipmentStr={props.adEquipment}
              completeSelEqui={(seledEuipListStr: string): void =>
                props.setSelectEuipment(seledEuipListStr)
              }
              nextFocus={(): void => {}}
              singleSelectMode
            />
            <MapAddWebModal
              isVisibleMapAddModal={props.isVisibleMapAddModal}
              setMapAddModalVisible={(visible): void => { props.setVisibleMapAddModal(visible) }}
              saveAddrInfo={(addrData): void =>
              {
                props.setAdSido(addrData.sidoAddr);
                props.setAdGungu(addrData.sigunguAddr);
              }}
              nextFocus={(): void => {}}
            />
            <AdTypeWrap>
              <AdTypeTitle>광고타입*</AdTypeTitle>
              <Picker
                selectedValue={props.adType}
                onValueChange={(itemValue): void => props.onPickAdType(itemValue)}
              >
                <Picker.Item label="=== 광고타입 선택 ===" value={undefined} />
                {renderAdTypeList(AdType.MAIN_FIRST, props.bookedAdTypeList)}
                {renderAdTypeList(AdType.MAIN_SECONDE, props.bookedAdTypeList)}
                {renderAdTypeList(AdType.MAIN_THIRD, props.bookedAdTypeList)}
                <Picker.Item
                  label={getAdTypeStr(AdType.SEARCH_EQUIPMENT_FIRST)}
                  value={AdType.SEARCH_EQUIPMENT_FIRST}
                />
                <Picker.Item label={getAdTypeStr(AdType.SEARCH_REGION_FIRST)} value={AdType.SEARCH_REGION_FIRST} />
              </Picker>
            </AdTypeWrap>
            <JBTextInput
              title="계약기간"
              subTitle="(월, 필수)"
              value={`${props.forMonths}`}
              onChangeText={(text: number): void => props.setForMonths(text)}
              placeholder="몇개월간 홍보하시겠습니까?"
              keyboardType="numeric"
            />
            <JBErrorMessage errorMSG={props.forMonthsValErrMessage} />
            <JBTextInput
              title="광고 타이틀"
              subTitle="(10자까지, 필수)"
              value={props.adTitle}
              onChangeText={(text): void => props.setAdTitle(text)}
              placeholder="광고상단 문구를 입력하세요(최대 10자)"
            />
            <JBErrorMessage errorMSG={props.adTitleValErrMessage} />
            <JBTextInput
              title="광고 슬로건"
              subTitle="(20자까지, 필수)"
              value={props.adSubTitle}
              onChangeText={(text): void => props.setAdSubTitle(text)}
              placeholder="광고하단 문구를 입력하세요(최대 20자)"
            />
            <JBErrorMessage errorMSG={props.adSubTitleValErrMessage} />
            <ImagePickInput
              itemTitle="광고배경 사진"
              imgUrl={props.adPhotoUrl}
              setImageUrl={(url): void => props.setAdPhotoUrl(url)}
            />
            <JBErrorMessage errorMSG={props.adPhotoUrlValErrMessage} />
            <JBTextInput
              title="전화번호"
              value={props.adTelNumber}
              onChangeText={(text): void => props.setAdTelnumber(text)}
              placeholder="휴대전화 번호입력(숫자만)"
            />
            <JBErrorMessage errorMSG={props.adTelNumberValErrMessage} />
            {(props.adType === AdType.SEARCH_EQUIPMENT_FIRST || props.adType === AdType.SEARCH_REGION_FIRST) && (
              <JBTextInput
                title="타켓 광고(장비)"
                value={props.adEquipment}
                onChangeText={(text): void => props.setAdEquipment(text)}
                onFocus={(): void => props.setVisibleEquiModal(true)}
                placeholder="타켓광고 장비 선택해 주세요"
              />
            )}
            <JBErrorMessage errorMSG={props.adEquipmentValErrMessage} />
            {props.adType === AdType.SEARCH_REGION_FIRST && (
              <JBTextInput
                title="타켓 광고(지역)"
                value={`${props.adSido}${props.adGungu}`}
                onFocus={(): void => props.setVisibleMapAddModal(true)}
                placeholder="타켓광고 지역을 선택해 주세요"
              />
            )}
            <JBErrorMessage errorMSG={props.adLocalValErrMessage} />
          </ScrollView>
        </KeyboardAvoidingView>
      </Card>
      <JBActIndicatorModal
        isVisibleModal={props.isVisibleActIndiModal}
        message={props.imgUploadingMessage}
        size="large"
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
