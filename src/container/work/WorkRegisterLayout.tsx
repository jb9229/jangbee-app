import { Alert, DatePickerAndroid, KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';

import CardUI from 'molecules/CardUI';
import EditText from 'src/components/molecules/EditText';
import EquipementModal from 'templates/EquipmentModal';
import JBButton from 'molecules/JBButton';
import JBPicker from 'molecules/JBPicker';
import MapAddWebModal from 'templates/MapAddWebModal';
import { PickerItem } from 'src/types';
import React from 'react';
import SelectText from 'src/components/molecules/SelectText';
import { WorkCreateDto } from 'src/container/work/types';
import colors from 'constants/Colors';
import fonts from 'constants/Fonts';
import { notifyError } from 'common/ErrorNotice';
import styled from 'styled-components/native';
import { useWorkRegisterProvider } from 'src/container/work/WorkRegisterProvider';

const styles = StyleSheet.create({
  Container: {
    flex: 1
  },
  modalWrap: {
    height: 0
  },
  workDateWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  periodWrap: {
    width: 105
  },
  periodPicker: {
    width: 100,
    height: 50
  },
  guaranteeWrap: {
    marginLeft: 10
  },
  guaranteePicker: {
    width: 100,
    height: 50
  },
  pickerTitle: {
    fontFamily: fonts.titleMiddle,
    color: colors.title,
    fontSize: 15,
    marginBottom: 3
  }
});

const dayPickItems = new Array(30).fill(0)
  .map((_, i) => new PickerItem(`${i + 1}일`, `${i + 1}`, i));

dayPickItems.splice(0, 0, new PickerItem('오전', '0.3', 0.3));
dayPickItems.splice(1, 0, new PickerItem('오후', '0.8', 0.8));

const guarMinPItems = [10, 20, 30, 60].map(min => new PickerItem(`${min}분`, `${min}`, min));
guarMinPItems.push(new PickerItem('2시간', '120', 120));
guarMinPItems.push(new PickerItem('3시간', '180', 180));
guarMinPItems.push(new PickerItem('4시간', '300', 300));
guarMinPItems.push(new PickerItem('12시간', '720', 720));
guarMinPItems.push(new PickerItem('1일', '1440', 1440));

const licensePItems = ['기중기면허', '굴착기면허', '지게차면허'].map(lin => new PickerItem(`${lin}필요`, lin, lin));

const nondestPItems = [6, 12, 24, 36].map(mon => new PickerItem(`${mon}개월이하`, `${mon}`, mon));

const careerPItems = [5, 7, 10, 15, 20, 25, 30, 35, 40].map(year => new PickerItem(`${year}년이상`, `${year}`, year));

const thisYear = new Date().getFullYear();
const modelYearPItems = new Array(10)
  .fill(0)
  .map((_, i) => new PickerItem(`${thisYear - i}년이상`, `${thisYear - i}`, thisYear - i));
const PeriodPicker = styled(JBPicker)`
  width: 100;
`;

const WorkRegisterLayout: React.FC = () =>
{
  const { isFirmRegister, loading, workDto, errorData, onClickCreate } = useWorkRegisterProvider();
  const [isVisibleEquiModal, setVisibleEquiModal] = React.useState(false);
  const [isVisibleMapAddModal, setVisibleMapAddModal] = React.useState(false);
  const [startDateStr, setStartDateStr] = React.useState(workDto.startDate);

  return (
    <View style={styles.Container}>
      <KeyboardAvoidingView>
        <ScrollView>
          <CardUI>
            <SelectText
              label="호출장비"
              subLabel="(필수)"
              text={workDto.equipment}
              onPress={(): void => setVisibleEquiModal(true)}
              placeholder="어떤 장비를 부르시겠습니까?"
              errorText={errorData.equipment}
            />
            <EditText
              label="전화번호"
              subLabel="(필수, 매칭후 공개됨)"
              text={workDto.phoneNumber}
              onChangeText={(text): void => { workDto.phoneNumber = text }}
              placeholder="전화번호를 입력해 주세요"
              keyboardType="phone-pad"
              errorText={errorData.phoneNumber}
            />
            <SelectText
              label="현장주소"
              subLabel="(필수, 매칭후 자세히 공개됨)"
              text={workDto?.address}
              onPress={(): void => setVisibleMapAddModal(true)}
              placeholder="주소를 검색해주세요"
              errorText={errorData.address}
            />
            <EditText
              label="현장위치"
              subLabel="(필수, 현장위치를 짧게 설명해 주세요)"
              text={workDto.addressDetail}
              onChangeText={(text): void => { workDto.addressDetail = text }}
              placeholder="상세주소를 입력해 주세요"
              errorText={errorData.addressDetail}
            />

            <View style={styles.workDateWrap}>
              <SelectText
                label="작업시작일"
                subLabel="(필수)"
                style={{ flex: 1, marginRight: 10 }}
                text={workDto.startDate}
                onPress={(): void => { openStartWorkDatePicker(workDto, setStartDateStr) }}
                placeholder="시작일을 선택 하세요"
                errorText={errorData.startDate}
              />
              <PeriodPicker
                title="기간"
                selectedValue={startDateStr}
                onValueChange={(itemValue: number): void => { workDto.period = itemValue }}
                items={dayPickItems}
                errorText={errorData.period}
                size={140}
              />
            </View>
            {isFirmRegister && (
              <JBPicker
                title="최대 일감보장시간"
                subTitle="(일감 넘기지않고 기다릴 시간)"
                selectedValue={workDto.guaranteeTime}
                onValueChange={(itemValue: number): void => { workDto.guaranteeTime = itemValue }}
                items={guarMinPItems}
              />
            )}

            <EditText
              label="작업 세부사항"
              subLabel="(필수)"
              text={workDto.detailRequest}
              onChangeText={(text): void => { workDto.detailRequest = text }}
              placeholder="작업 세부사항 및 요청사항을 입력하세요."
              multiline
              numberOfLines={3}
              errorText={errorData.detailRequest}
            />
            <JBPicker
              title="년식제한"
              selectedValue={workDto.modelYearLimit}
              items={modelYearPItems}
              onValueChange={(item: number): void => { workDto.modelYearLimit = item }}
              selectLabel="년식 선택(옵션)"
            />

            <JBPicker
              title="필수면허"
              selectedValue={workDto.licenseLimit}
              items={licensePItems}
              onValueChange={(item: string): void => { workDto.licenseLimit = item }}
              selectLabel="면허 선택(옵션)"
            />

            <JBPicker
              title="비파괴 개월제한"
              selectedValue={workDto.nondestLimit}
              items={nondestPItems}
              onValueChange={(item: string): void => { workDto.nondestLimit = item }}
              selectLabel="개월 선택(옵션)"
            />

            <JBPicker
              title="경력제한"
              selectedValue={workDto.careerLimit}
              items={careerPItems}
              onValueChange={(item: number): void => { workDto.careerLimit = item }}
              selectLabel="경력 선택(옵션)"
            />

            <JBButton
              title="일감 등록완료"
              onPress={(): void => confirmCreateWork(isFirmRegister, workDto.guaranteeTime, onClickCreate)}
              size="full"
              Secondary
            />
            <View style={styles.modalWrap}>
              <EquipementModal
                isVisibleEquiModal={isVisibleEquiModal}
                closeModal={(): void => setVisibleEquiModal(false)}
                selEquipmentStr={workDto.equipment}
                completeSelEqui={(seledEuipListStr): void => { workDto.equipment = seledEuipListStr }}
                depth={2}
              />
              <MapAddWebModal
                isVisibleMapAddModal={isVisibleMapAddModal}
                setMapAddModalVisible={(flag): void => setVisibleMapAddModal(flag)}
                saveAddrInfo={(addrInfo): void => saveAddrInfo(addrInfo, workDto)}
                nextFocus={() => {}}
              />
            </View>
          </CardUI>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

/**
  * 일감 등록
*/
const openStartWorkDatePicker = async (workDto: WorkCreateDto, setStartDateStr: (dateStr) => void): void =>
{
  try
  {
    const now = new Date();
    const { action, year, month, day } = await DatePickerAndroid.open({
      date: now,
      minDate: now.getTime()
    });

    workDto.startDate = `${year}-${month + 1}-${day}`;
    setStartDateStr(`${year}-${month + 1}-${day}`);

    if (action !== DatePickerAndroid.dismissedAction)
    {
      // Selected year, month (0-11), day
    }
  }
  catch ({ code, message })
  {
    notifyError('Cannot open date picker', message);
  }
};

/**
   * 일감주소 저장함수
   */
const saveAddrInfo = (addrData, workDto: WorkCreateDto): void =>
{
  workDto.address = addrData.address;
  workDto.sidoAddr = addrData.sidoAddr;
  workDto.sigunguAddr = addrData.sigunguAddr;
  workDto.addrLongitude = addrData.addrLongitude;
  workDto.addrLatitude = addrData.addrLatitude;
};

const confirmCreateWork = (isFirmRegister: boolean, guaranteeTime: number, onClickCreate: () => void): void =>
{
  if (isFirmRegister)
  {
    Alert.alert(
      '주의사항',
      `다른 차주가 매칭비를 지불하고 선착순으로 자동매칭됩니다, [${guaranteeTime}]분까지는 일감이 보장(다른경로로 일감을 넘기시면 안됩니다!!)` +
      '\n\n차주일감은 매칭비의 50%를 돌려받습니다(캐쉬백/다른일감 지원시 사용가능)',
      [
        { text: '취소' },
        {
          text: '일감등록',
          onPress: (): void =>
          {
            onClickCreate();
          }
        }
      ]
    );
  }
  else
  {
    onClickCreate();
  }
};

export default WorkRegisterLayout;
