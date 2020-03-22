import * as React from 'react';

import { KeyboardAvoidingView, Picker, ScrollView } from 'react-native';

import Card from 'molecules/CardUI';
import EditText from 'src/components/molecules/EditText';
import EquipementModal from 'templates/EquipmentModal';
import ImagePickInput from 'src/components/molecules/ImagePickInput';
import JBButton from 'molecules/JBButton';
import JBPicker from 'molecules/JBPicker';
import LoadingIndicator from 'src/components/molecules/LoadingIndicator';
import LocalSelModal from 'templates/LocalSelModal';
import MapAddWebModal from 'templates/MapAddWebModal';
import SelectText from 'src/components/molecules/SelectText';
import styled from 'styled-components/native';
import { useFirmRegisterProvider } from 'src/container/firm/FirmRegisterProvider';

const Container = styled.View`
  flex: 1;
`;
const Scroll = styled(ScrollView)`
`;
const EquipWrap = styled.View`
  flex-direction: row;
`;
const Footer = styled.View``;

const FirmRegisterLayout: React.FC = () =>
{
  const { firmDto, errorData } = useFirmRegisterProvider();
  const [isVisibleEquiModal, setVisibleEquiModal] = React.useState(false);
  const [isVisibleMapAddModal, setVisibleMapAddModal] = React.useState(false);
  const [isVisibleLocalModal, setVisibleLocalModal] = React.useState(false);

  return (
    <Container>
      <KeyboardAvoidingView>
        <Scroll>
          <Card bgColor="white">
            <EditText
              label="업체명"
              subLabel="(필수)"
              text={firmDto.fname}
              onChangeText={(text): void => { firmDto.fname = text }}
              placeholder="업체명을 입력해 주세요"
              errorText={errorData.fname}
            />

            <EditText
              label="전화번호"
              subLabel="(필수)"
              text={firmDto.phoneNumber}
              onChangeText={(text): void => { firmDto.phoneNumber = text }}
              placeholder="전화번호를 입력해 주세요"
              keyboardType="phone-pad"
              errorText={errorData.phoneNumber}
            />

            <EquipWrap>
              <SelectText
                label="보유 장비"
                subLabel="(필수)"
                text={firmDto.equiListStr}
                onPress={(): void => setVisibleEquiModal(true)}
                placeholder="보유장비를 선택해 주세요"
                errorText={errorData.equiListStr}
              />

              <JBPicker
                label="년식"
                subLabel="(필수)"
                items={pickerItems}
                selectedValue={firmDto.modelYear}
                onValueChange={(itemValue): void => { firmDto.modelYear = itemValue }}
                size={110}
              />
            </EquipWrap>

            <SelectText
              label="업체주소"
              subLabel="(필수, 장비 검색시 거리계산 기준이됨)"
              text={firmDto.address}
              onPress={(): void => setVisibleMapAddModal(true)}
              placeholder="주소를 검색해주세요"
              errorText={errorData.address}
            />

            <EditText
              label="업체 상세주소"
              text={firmDto.addressDetail}
              onChangeText={(text): void => { firmDto.addressDetail = text }}
              placeholder="혹시 추가로 위치설명이 필요하면 기입해주세요"
              errorText={errorData.addressDetail}
            />
            <SelectText
              label="일감알람 받을지역"
              subLabel="(필수)"
              text={`${firmDto.workAlarmSido}${firmDto.workAlarmSigungu}`}
              onPress={(): void => setVisibleLocalModal(true)}
              placeholder="일감알람 받을 지역을 선택해 주세요."
              errorText={errorData.workAlarm}
            />

            <EditText
              label="업체 소개"
              subLabel="(필수)"
              text={firmDto.introduction}
              onChangeText={(text): void => { firmDto.introduction = text }}
              placeholder="업체 소개를 해 주세요"
              multiline
              numberOfLines={5}
              errorText={errorData.introduction}
            />

            <ImagePickInput
              itemTitle="대표사진"
              subTitle="(필수)"
              imgUrl={firmDto.thumbnail}
              aspect={[1, 1]}
              setImageUrl={(url): void => { firmDto.thumbnail = url }}
              errorText={errorData.thumbnail}
            />

            <ImagePickInput
              itemTitle="작업사진1"
              subTitle="(필수, 1장만 올려도 되지만 많으면 좋음)"
              imgUrl={firmDto.photo1}
              setImageUrl={(url): void => { firmDto.photo1 = url }}
              errorText={errorData.photo1}
            />

            <ImagePickInput
              itemTitle="작업사진2"
              imgUrl={firmDto.photo2}
              setImageUrl={(url): void => { firmDto.photo2 = url }}
              errorText={errorData.photo2}
            />

            <ImagePickInput
              itemTitle="작업사진3"
              imgUrl={firmDto.photo3}
              setImageUrl={(url): void => { firmDto.photo3 = url }}
              errorText={errorData.photo3}
            />

            <EditText
              label="블로그"
              text={firmDto.blog}
              onChangeText={(text): void => { firmDto.blog = text }}
              placeholder="블로그 주소를 입력해 주세요"
            />

            <EditText
              label="SNG"
              text={firmDto.sns}
              onChangeText={(text): void => { firmDto.sns = text }}
              placeholder="SNS 주소를(또는 카카오톡 친구추가) 입력해 주세요"
            />

            <EditText
              label="홈페이지"
              text={firmDto.homepage}
              onChangeText={(text): void => { firmDto.homepage = text }}
              placeholder="홈페이지 주소를 입력해 주세요"
            />
          </Card>

          <Footer>
            <JBButton
              title="업체등록하기"
              onPress={(): void => this.createFirm()}
              size="full"
              Primary
            />
          </Footer>
        </Scroll>
      </KeyboardAvoidingView>
      <EquipementModal
        isVisibleEquiModal={isVisibleEquiModal}
        closeModal={(): void => { setVisibleEquiModal(false) }}
        selEquipmentStr={firmDto.equiListStr}
        completeSelEqui={(seledEuipListStr): void => { firmDto.equiListStr = seledEuipListStr }}
        nextFocus={(): void => this.addrTextInput.focus()}
      />
      <MapAddWebModal
        isVisibleMapAddModal={isVisibleMapAddModal}
        setMapAddModalVisible={(flag: boolean): void => { setVisibleMapAddModal(flag) }}
        saveAddrInfo={this.saveAddrInfo}
        nextFocus={(): void => this.addrDetTextInput.focus()}
      />
      <LoadingIndicator loading={true} />
      <LocalSelModal
        isVisibleModal={isVisibleLocalModal}
        closeModal={(): void => setVisibleLocalModal(false)}
        multiSelComplte={(sidoArrStr, sigunguArrStr): void =>
        {
          firmDto.workAlarmSido = sidoArrStr;
          firmDto.workAlarmSigungu = sigunguArrStr;
        }}
        nextFocus={(): void => {}}
        multiSelect
        actionName="일감알람 지역선택 완료"
        isCatSelectable
      />
    </Container>
  );
};

const thisYear = new Date().getFullYear();

const pickerItems = Array.from(Array(30).keys()).map((_, i) =>
{
  const year = thisYear - i;
  return <Picker.Item label={`${year}`} value={year} key={i} />;
});

export default FirmRegisterLayout;
