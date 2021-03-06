import * as React from 'react';

import { MapAddress, PickerItem } from 'src/types';

import Card from 'molecules/CardUI';
import EditText from 'src/components/molecules/EditText';
import EquipementModal from 'templates/EquipmentModal';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import ImagePickInput from 'src/components/molecules/ImagePickInput';
import JBButton from 'molecules/JBButton';
import JBPicker from 'molecules/JBPicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LoadingIndicator from 'src/components/molecules/LoadingIndicator';
import LocalSelModal from 'templates/LocalSelModal';
import MapAddWebModal from 'templates/MapAddWebModal';
import SelectText from 'src/components/molecules/SelectText';
import { TextInput } from 'react-native';
import styled from 'styled-components/native';
import { useFirmModifyProvider } from 'src/container/firm/FirmModifyProvider';
import { useLoginContext } from 'src/contexts/LoginContext';

const Container = styled.View`
  flex: 1;
`;
const ScrollView = styled(KeyboardAwareScrollView).attrs(() => ({
  contentContainerStyle: {
  }
}))`
`;
const EquipWrap = styled.View`
  flex-direction: row;
`;

const FirmRegisterLayout: React.FC = () =>
{
  const addrDetailComp = React.useRef<TextInput>();
  const { loading, firmDto, errorData, onClickUpdate } = useFirmModifyProvider();
  const { firm } = useLoginContext();
  const [isVisibleEquiModal, setVisibleEquiModal] = React.useState(false);
  const [isVisibleMapAddModal, setVisibleMapAddModal] = React.useState(false);
  const [isVisibleLocalModal, setVisibleLocalModal] = React.useState(false);
console.log('>>> firm: ', firm)
  return (
    <Container>
      <ScrollView>
        <Card bgColor="white">
          <EditText
            label="업체명"
            subLabel="(필수)"
            text={firm?.fname}
            onChangeText={(text): void => { firmDto.fname = text }}
            placeholder="업체명을 입력해 주세요"
            errorText={errorData.fname}
          />

          <EditText
            unchangeable={true}
            label="전화번호"
            subLabel="(필수)"
            text={firm?.phoneNumber}
            onChangeText={(text): void => { firmDto.phoneNumber = text }}
            placeholder="전화번호를 입력해 주세요"
            keyboardType="phone-pad"
            errorText={errorData.phoneNumber}
          />

          <EquipWrap>
            <SelectText
              label="보유 장비"
              subLabel="(필수)"
              text={firm?.equiListStr}
              style={{ flex: 1 }}
              onPress={(): void => setVisibleEquiModal(true)}
              placeholder="보유장비를 선택해 주세요"
              errorText={errorData.equiListStr}
            />

            <JBPicker
              title="년식"
              subTitle="(필수)"
              items={pickerItems}
              selectedValue={firmDto.modelYear ? firmDto.modelYear : 0}
              onValueChange={(itemValue): void => { firmDto.modelYear = Number.parseInt(itemValue) }}
              size={110}
              errorText={errorData.modelYear}
            />
          </EquipWrap>

          <SelectText
            label="업체주소"
            subLabel="(필수, 검색 시 거리계산 기준)"
            text={firm?.address}
            onPress={(): void => setVisibleMapAddModal(true)}
            placeholder="주소를 검색해주세요"
            errorText={errorData.address}
          />

          <EditText
            ref={addrDetailComp}
            label="업체 상세주소"
            text={firm?.addressDetail}
            onChangeText={(text): void => { firmDto.addressDetail = text }}
            placeholder="혹시 추가로 위치설명이 필요하면 기입해주세요"
            errorText={errorData.addressDetail}
          />
          <SelectText
            label="일감알림 받을지역"
            subLabel="(필수)"
            text={firmDto?.workAlarmSido || firmDto?.workAlarmSigungu ? `${firmDto?.workAlarmSido}${firmDto?.workAlarmSigungu}` : ''}
            onPress={(): void => setVisibleLocalModal(true)}
            placeholder="일감알림 받을 지역을 선택해 주세요."
            errorText={errorData.workAlarm}
          />

          <EditText
            label="업체 소개"
            subLabel="(필수)"
            text={firm?.introduction}
            onChangeText={(text): void => { firmDto.introduction = text }}
            placeholder="업체 소개를 해 주세요"
            multiline
            numberOfLines={5}
            errorText={errorData.introduction}
          />

          <ImagePickInput
            itemTitle="대표사진"
            subTitle="(필수)"
            initImgUrl={firm?.thumbnail}
            aspect={[1, 1]}
            setImage={(img: ImageInfo): void => { firmDto.uploadThumbnail = img }}
            deleteImage={(): void => { firmDto.uploadThumbnail = null }}
            errorText={errorData.thumbnail}
          />

          <ImagePickInput
            itemTitle="작업사진1"
            subTitle="(필수)"
            initImgUrl={firm?.photo1}
            setImage={(img: ImageInfo): void => { firmDto.uploadPhoto1 = img }}
            deleteImage={(): void => { firmDto.uploadPhoto1 = null }}
            errorText={errorData.photo1}
          />

          <ImagePickInput
            itemTitle="작업사진2"
            subTitle="(여러장 올려야 좋아요)"
            initImgUrl={firm?.photo2}
            setImage={(img: ImageInfo): void => { firmDto.uploadPhoto2 = img }}
            deleteImage={(): void => { firmDto.uploadPhoto2 = null }}
            errorText={errorData.photo2}
          />

          <ImagePickInput
            itemTitle="작업사진3"
            initImgUrl={firm?.photo3}
            setImage={(img: ImageInfo): void => { firmDto.uploadPhoto3 = img }}
            deleteImage={(): void => { firmDto.uploadPhoto3 = null }}
            errorText={errorData.photo3}
          />

          <EditText
            label="블로그"
            text={firm?.blog}
            onChangeText={(text): void => { firmDto.blog = text }}
            placeholder="블로그 주소를 입력해 주세요"
          />

          <EditText
            label="SNG"
            text={firm?.sns}
            onChangeText={(text): void => { firmDto.sns = text }}
            placeholder="SNS 주소를(또는 카카오톡 친구추가) 입력해 주세요"
          />

          <EditText
            label="홈페이지"
            text={firm?.homepage}
            onChangeText={(text): void => { firmDto.homepage = text }}
            placeholder="홈페이지 주소를 입력해 주세요"
          />
        </Card>
      </ScrollView>
      <JBButton
        title="수정하기"
        onPress={(): void => onClickUpdate()}
        size="full"
        Primary
      />
      <EquipementModal
        isVisibleEquiModal={isVisibleEquiModal}
        closeModal={(): void => { setVisibleEquiModal(false) }}
        selEquipmentStr={firmDto.equiListStr}
        completeSelEqui={(seledEuipListStr): void => { firmDto.equiListStr = seledEuipListStr }}
      />
      <MapAddWebModal
        isVisibleMapAddModal={isVisibleMapAddModal}
        setMapAddModalVisible={(flag: boolean): void => { setVisibleMapAddModal(flag) }}
        saveAddrInfo={(addrData: MapAddress): void =>
        {
          firmDto.sidoAddr = addrData.sidoAddr;
          firmDto.sigunguAddr = addrData.sigunguAddr;
          firmDto.address = addrData.address;
          firmDto.addrLatitude = addrData.addrLatitude;
          firmDto.addrLongitude = addrData.addrLongitude;
        }
        }
        nextFocus={(): void => { addrDetailComp.current.focus() }}
      />
      <LoadingIndicator loading={loading} />
      <LocalSelModal
        isVisibleModal={isVisibleLocalModal}
        closeModal={(): void => setVisibleLocalModal(false)}
        multiSelComplte={(sidoArrStr, sigunguArrStr): void =>
        {
          firmDto.workAlarmSido = sidoArrStr;
          firmDto.workAlarmSigungu = sigunguArrStr;
          // setAlarmLocale(`${firmDto?.workAlarmSido}${firmDto?.workAlarmSigungu}`);
          // console.log('>>> alarmlocale: ', `${firm?.workAlarmSido}${firm?.workAlarmSigungu}`)
          // console.log('>>> alarmlocale: ', `${firm?.workAlarmSido}${firm?.workAlarmSigungu}`)
          // console.log('>>> alarmlocale: ', `${firm?.workAlarmSido}${firm?.workAlarmSigungu}`)
        }}
        nextFocus={(): void => {}}
        multiSelect
        actionName="일감알림 지역선택 완료"
        isCatSelectable
      />
    </Container>
  );
};

const thisYear = new Date().getFullYear();

const pickerItems = Array.from(Array(30).keys()).map((_, i) =>
{
  const year = thisYear - i;
  return new PickerItem(`${year}`, year, i);
});

export default FirmRegisterLayout;
