import * as React from 'react';

import { AdType } from 'src/container/ad/types';
import { Alert } from 'react-native';
import Card from 'molecules/CardUI';
import EditText from 'molecules/EditText';
import EquipementModal from 'templates/EquipmentModal';
import ErrorText from 'src/components/molecules/Text/ErrorText';
import ImagePickInput from 'molecules/ImagePickInput';
import JBButton from 'molecules/JBButton';
import KakaoPayWebView from 'src/components/templates/KakaoPayWebView';
import LoadingIndicator from 'src/components/molecules/LoadingIndicator';
import MapAddWebModal from 'templates/MapAddWebModal';
import MiddleTitle from 'src/components/molecules/Text/MiddleTitle';
import SelectText from 'src/components/molecules/SelectText';
import getString from 'src/STRING';
import styled from 'styled-components/native';
import { useAdCreateProvider } from 'src/contexts/AdCreateProvider';

export const getAdTypeStr = (type: AdType): string =>
{
  switch (type)
  {
    case AdType.MAIN_FIRST: return '메인광고_첫번째 (월 10만원)';
    case AdType.MAIN_SECONDE: return '메인광고_두번째 (월 7만원)';
    case AdType.MAIN_THIRD: return '메인광고_세번째 (월 5만원)';
    case AdType.SEARCH_EQUIPMENT_FIRST: return '장비 검색광고 (월 7만원)';
    case AdType.SEARCH_REGION_FIRST: return '지역 검색광고 (월 3만원)';
    default: throw new Error('Unknow Advertisement Type!');
  }
};

const Container = styled.View`
  flex: 1;
`;
const KeyboardAvoidingView = styled.KeyboardAvoidingView.attrs({
  contentContainerStyle: {
  }
})`flex: 1;`;
const ScrollView = styled.ScrollView.attrs({
  contentContainerStyle: {
  }
})`flex: 1;`;
const AdTypeWrap = styled.View``;
const Picker = styled.Picker``;

const CreateAdLayout: React.FC = () =>
{
  const {
    adState, isVisibleEquiModal, isVisibleAddrModal, bookedAdTypeList, bookedAdLoading, imgUploading,
    setVisibleEquiModal, setVisibleAddrModal, onSubmit
  } = useAdCreateProvider();

  const [adType, setAdType] = React.useState<AdType>(adState.createAdDto.adType);

  return (
    <Container>
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={50}>
        <Card>
          <ScrollView>
            <AdTypeWrap>
              <MiddleTitle label="광고타입" subLabel="(필수)" />
              <Picker
                selectedValue={adState.createAdDto.adType}
                onValueChange={(itemValue): void => { if (checkAdType(bookedAdTypeList, itemValue)) { adState.createAdDto.adType = itemValue; setAdType(itemValue) } }}
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
              {!!adState.createAdError.type && <ErrorText text={adState.createAdError.type} />}
            </AdTypeWrap>
            <EditText
              label="계약기간"
              subLabel="(최대 12개월, 필수)"
              text={`${adState.createAdDto.forMonths}`}
              onChangeText={(text: string): void =>
              {
                const month = Number.parseInt(text); if (month && !isNaN(month)) { adState.createAdDto.forMonths = month }
                else { adState.createAdDto.forMonths = -1 }
              }}
              placeholder="몇개월간 홍보하시겠습니까?"
              keyboardType="numeric"
              errorText={adState.createAdError.forMonths}
            />
            <EditText
              label="광고 타이틀"
              subLabel="(10자까지, 필수)"
              text={adState.createAdDto.adTitle}
              onChangeText={(text): void => { adState.createAdDto.adTitle = text }}
              placeholder="광고상단 문구를 입력하세요(최대 10자)"
              errorText={adState.createAdError.title}
            />
            <EditText
              label="광고 슬로건"
              subLabel="(20자까지, 필수)"
              text={adState.createAdDto.adSubTitle}
              onChangeText={(text): void => { adState.createAdDto.adSubTitle = text }}
              placeholder="광고하단 문구를 입력하세요(최대 20자)"
              errorText={adState.createAdError.subTitle}
            />
            <ImagePickInput
              itemTitle="광고배경 사진"
              imgUrl={adState.createAdDto.adPhotoUrl}
              setImageUrl={(url): void => { adState.createAdDto.adPhotoUrl = url }}
              errorText={adState.createAdError.photoUrl}
            />
            <EditText
              label="전화번호"
              text={adState.createAdDto.adTelNumber}
              onChangeText={(text): void => { adState.createAdDto.adTelNumber = text }}
              placeholder="휴대전화 번호입력(숫자만)"
              errorText={adState.createAdError.telNumber}
            />
            {(adType === AdType.SEARCH_EQUIPMENT_FIRST || adType === AdType.SEARCH_REGION_FIRST) && (
              <SelectText
                label="타겟 장비"
                text={adState.createAdDto.adEquipment}
                onPress={(): void => setVisibleEquiModal(true)}
                placeholder="타켓광고 장비 선택해 주세요"
                errorText={adState.createAdError.equipment}
              />
            )}
            {adType === AdType.SEARCH_REGION_FIRST && (
              <SelectText
                label="타겟 지역"
                text={adState.createAdDto.adSido && adState.createAdDto.adGungu ? `${adState.createAdDto.adSido}${adState.createAdDto.adGungu}` : undefined }
                onPress={(): void => setVisibleAddrModal(true)}
                placeholder="타켓광고 지역을 선택해 주세요"
                errorText={adState.createAdError.local}
              />
            )}
          </ScrollView>
        </Card>
      </KeyboardAvoidingView>
      <JBButton
        title="내장비 홍보하기"
        onPress={(): void => onSubmit(adState.createAdDto)}
        size="full"
        Primary
      />
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
      <LoadingIndicator loading={bookedAdLoading} />
      <LoadingIndicator loading={imgUploading} msg={getString('AD_IMG_UPLOADING')} />
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

/**
 * 광고타입 픽 이벤트 함수
 */
const checkAdType = (bookedAdTypeList: Array<number>, pickType: AdType): boolean =>
{
  if (pickType !== 11 && pickType !== 21 && bookedAdTypeList.includes(pickType))
  {
    Alert.alert('죄송합니다', '이미 계약된 광고 입니다');

    return false;
  }

  return true;
};

export default CreateAdLayout;
