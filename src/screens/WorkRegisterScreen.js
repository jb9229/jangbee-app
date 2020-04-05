import * as api from 'api/api';

import {
  Alert,
  DatePickerAndroid,
  KeyboardAvoidingView,
  Picker,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { validate, validatePresence } from 'utils/Validation';

import CardUI from 'molecules/CardUI';
import EquipementModal from 'templates/EquipmentModal';
import JBButton from 'molecules/JBButton';
import JBErrorMessage from 'organisms/JBErrorMessage';
import JBPicker from 'molecules/JBPicker';
import JBTextInput from 'molecules/JBTextInput';
import MapAddWebModal from 'templates/MapAddWebModal';
import React from 'react';
import colors from 'constants/Colors';
import fonts from 'constants/Fonts';
import { notifyError } from 'common/ErrorNotice';

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

const dayPickItems = new Array(30)
  .fill()
  .map((_, i) => (
    <Picker.Item key={i} label={`${i + 1}일`} value={`${i + 1}`} />
  ));

dayPickItems.splice(0, 0, <Picker.Item key={0.3} label="오전" value="0.3" />);
dayPickItems.splice(1, 0, <Picker.Item key={0.8} label="오후" value="0.8" />);

const guarMinPItems = [10, 20, 30, 60].map(min => (
  <Picker.Item key={min} label={`${min}분`} value={`${min}`} />
));
guarMinPItems.push(<Picker.Item key={120} label="2시간" value="120" />);
guarMinPItems.push(<Picker.Item key={180} label="3시간" value="180" />);
guarMinPItems.push(<Picker.Item key={300} label="5시간" value="300" />);
guarMinPItems.push(<Picker.Item key={7200} label="12시간" value="720" />);
guarMinPItems.push(<Picker.Item key={1440} label="1일" value="1440" />);

const licensePItems = ['기중기면허', '굴착기면허', '지게차면허'].map(lin => (
  <Picker.Item key={lin} label={`${lin}필요`} value={lin} />
));

const nondestPItems = [6, 12, 24, 36].map(mon => (
  <Picker.Item key={mon} label={`${mon}개월이하`} value={`${mon}`} />
));

const careerPItems = [5, 7, 10, 15, 20, 25, 30, 35, 40].map(year => (
  <Picker.Item key={year} label={`${year}년이상`} value={`${year}`} />
));

const thisYear = new Date().getFullYear();
const modelYearPItems = new Array(10)
  .fill()
  .map((_, i) => (
    <Picker.Item
      key={thisYear - i}
      label={`${thisYear - i}년이상`}
      value={`${thisYear - i}`}
    />
  ));

class WorkRegisterScreen extends React.Component
{
  constructor (props)
  {
    super(props);
    this.state = {
      isVisibleEquiModal: false,
      isVisibleMapAddModal: false,
      equipment: '',
      phoneNumber: '',
      period: '0.3',
      guaranteeTime: null
    };
  }

  componentDidMount ()
  {
    const { params } = this.props.navigation.state;

    if (params && params.firmRegister)
    {
      this.setState({ guaranteeTime: '30' });
    }
  }

  componentWillReceiveProps (nextProps)
  {
    const { params } = this.props.navigation.state;

    if (params && params.firmRegister)
    {
      this.setState({ guaranteeTime: '30' });
    }
  }

  confirmCreateWork = () =>
  {
    const { firmRegister } = this.props.navigation.state.params;
    const { guaranteeTime } = this.state;

    if (firmRegister)
    {
      Alert.alert(
        '차주일감 주의사항',
        `차주 일감등록은 선착순 자동매칭(매칭비 지불) 입니다, 설정하신 [${guaranteeTime}]분까지는 일감이 보장되어야 합니다(다른경로로 일감을 넘기시면 안됩니다)\n\n차주일감은 매칭비의 50%를 쿠폰으로 돌려받습니다, 일감지원시 사용가능 합니다.`,
        [
          { text: '취소', onPress: () => {} },
          {
            text: '일감등록',
            onPress: () =>
            {
              this.createWork();
            }
          }
        ]
      );
    }
    else
    {
      this.createWork();
    }
  };

  /**
   * 일감 등록
   */
  createWork = () =>
  {
    const { navigation } = this.props;
    const { firmRegister } = this.props.navigation.state.params;

    const newWork = this.validateWorkForm();
    if (!newWork)
    {
      return;
    }

    api
      .createWork(newWork)
      .then(resBody =>
      {
        if (resBody)
        {
          if (firmRegister)
          {
            navigation.navigate('FirmWorkList', { refresh: true });
          }
          else
          {
            navigation.navigate('WorkList', { refresh: true });
          }
          return;
        }

        notifyError(
          '일감등록에 문제가 있습니다',
          `다시 등록을 시도해 주세요(응답내용: ${resBody})`
        );
      })
      .catch(error => notifyError(error.name, error.message));
  };

  openStartWorkDatePicker = async () =>
  {
    try
    {
      const now = new Date();
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: now,
        minDate: now.getTime()
      });

      this.setState({ startDate: `${year}-${month + 1}-${day}` });

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
  saveAddrInfo = addrData =>
  {
    this.setState({
      address: addrData.address,
      sidoAddr: addrData.sidoAddr,
      sigunguAddr: addrData.sigunguAddr,
      addrLongitude: addrData.addrLongitude,
      addrLatitude: addrData.addrLatitude
    });
  };

  /**
   * 일감 데이터 유효성검사 함수
   */
  validateWorkForm = () =>
  {
    const { firmRegister } = this.props.navigation.state.params;
    const { user } = this.props;
    const {
      equipment,
      phoneNumber,
      address,
      addressDetail,
      startDate,
      period,
      guaranteeTime,
      detailRequest,
      modelYearLimit,
      licenseLimit,
      nondestLimit,
      careerLimit,
      sidoAddr,
      sigunguAddr,
      addrLongitude,
      addrLatitude
    } = this.state;

    // Validation Error Massage Initialize
    this.setState({
      equipmentValErrMessage: '',
      phoneNumberValErrMessage: '',
      addressValErrMessage: '',
      addressDetailValErrMessage: '',
      dateValErrMessage: '',
      detailRequestValErrMessage: ''
    });

    let v = validate('textMax', equipment, true, 25);
    if (!v[0])
    {
      this.setState({ equipmentValErrMessage: v[1] });
      return false;
    }

    v = validate('cellPhone', phoneNumber, true);
    if (!v[0])
    {
      this.setState({ phoneNumberValErrMessage: v[1] });
      return false;
    }

    v = validate('textMax', address, true, 100);
    if (!v[0])
    {
      this.setState({ addressValErrMessage: v[1] });
      return false;
    }

    v = validate('textMax', sidoAddr, true, 45);
    if (!v[0])
    {
      this.setState({ addressValErrMessage: v[1] });
      return false;
    }

    v = validate('textMax', sigunguAddr, true, 45);
    if (!v[0])
    {
      this.setState({ addressValErrMessage: v[1] });
      return false;
    }

    v = validate('textMax', addressDetail, true, 45);
    if (!v[0])
    {
      this.setState({ addressDetailValErrMessage: v[1] });
      return false;
    }

    v = validatePresence(startDate);
    if (!v[0])
    {
      this.setState({ dateValErrMessage: v[1] });
      return false;
    }

    v = validatePresence(period);
    if (!v[0])
    {
      this.setState({ dateValErrMessage: v[1] });
      return false;
    }

    v = validate('textMax', detailRequest, true, 500);
    if (!v[0])
    {
      this.setState({ detailRequestValErrMessage: v[1] });
      return false;
    }

    const newWork = {
      firmRegister,
      accountId: user.uid,
      equipment,
      phoneNumber,
      address,
      addressDetail,
      sidoAddr,
      sigunguAddr,
      startDate,
      period,
      guaranteeTime,
      detailRequest,
      modelYearLimit,
      licenseLimit,
      nondestLimit,
      careerLimit,
      addrLongitude,
      addrLatitude
    };

    return newWork;
  };

  render ()
  {
    const { firmRegister } = this.props.navigation.state.params;

    const {
      isVisibleEquiModal,
      isVisibleMapAddModal,
      equipment,
      address,
      addressDetail,
      startDate,
      period,
      guaranteeTime,
      detailRequest,
      phoneNumber,
      modelYearLimit,
      licenseLimit,
      nondestLimit,
      careerLimit,
      equipmentValErrMessage,
      addressValErrMessage,
      addressDetailValErrMessage,
      dateValErrMessage,
      detailRequestValErrMessage,
      phoneNumberValErrMessage
    } = this.state;

    return (
      <View style={styles.Container}>
        <KeyboardAvoidingView>
          <ScrollView>
            <CardUI>
              <JBTextInput
                title="호출장비"
                subTitle="(필수)"
                value={equipment}
                onChangeText={text => this.setState({ equipment: text })}
                placeholder="장비를 선택해 주세요"
                onFocus={() => this.setState({ isVisibleEquiModal: true })}
                tiRefer={input =>
                {
                  this.equiTextInput = input;
                }}
              />
              <JBErrorMessage errorMSG={equipmentValErrMessage} />

              <JBTextInput
                title="전화번호"
                subTitle="(매칭 후 공개됨, 필수)"
                value={phoneNumber}
                onChangeText={text => this.setState({ phoneNumber: text })}
                placeholder="전화번호를 입력해 주세요"
                keyboardType="phone-pad"
                refer={input =>
                {
                  this.telTextInput = input;
                }}
              />
              <JBErrorMessage errorMSG={phoneNumberValErrMessage} />

              <JBTextInput
                title="현장주소"
                subTitle="(매칭 후 자세히 공개됨, 필수)"
                value={address}
                tiRefer={input =>
                {
                  this.addrTextInput = input;
                }}
                onChangeText={text => this.setState({ address: text })}
                onFocus={() => this.setState({ isVisibleMapAddModal: true })}
                placeholder="현장 주소를 검색해주세요"
              />
              <JBErrorMessage errorMSG={addressValErrMessage} />
              <JBTextInput
                title="현장위치"
                subTitle="(현장위치를 짧게 설명해 주세요, 필수)"
                value={addressDetail}
                tiRefer={input =>
                {
                  this.addrDetTextInput = input;
                }}
                onChangeText={text => this.setState({ addressDetail: text })}
                placeholder="상세주소를 입력해 주세요"
              />
              <JBErrorMessage errorMSG={addressDetailValErrMessage} />
              <View style={styles.workDateWrap}>
                <JBTextInput
                  title="작업시작일"
                  subTitle="(필수)"
                  value={startDate}
                  tiRefer={input =>
                  {
                    this.startDateTextInput = input;
                  }}
                  onChangeText={text => this.setState({ startDate: text })}
                  onFocus={() => this.openStartWorkDatePicker()}
                  placeholder="시작일을 선택 하세요"
                />
                <JBPicker
                  title="기간"
                  selectedValue={period}
                  onValueChange={itemValue =>
                    this.setState({ period: itemValue })
                  }
                  items={dayPickItems}
                  size={100}
                />
              </View>
              <JBErrorMessage errorMSG={dateValErrMessage} />
              {firmRegister && (
                <JBPicker
                  title="최대 일감보장시간"
                  subTitle="(일감 넘기지않고 기다릴 수 있는 시간)"
                  selectedValue={guaranteeTime}
                  onValueChange={itemValue =>
                    this.setState({ guaranteeTime: itemValue })
                  }
                  items={guarMinPItems}
                />
              )}

              <JBTextInput
                title="작업 세부사항"
                value={detailRequest}
                onChangeText={text => this.setState({ detailRequest: text })}
                placeholder="작업 세부사항 및 요청사항을 입력하세요."
                multiline
                numberOfLines={3}
              />
              <JBErrorMessage errorMSG={detailRequestValErrMessage} />

              <JBPicker
                title="년식제한"
                selectedValue={modelYearLimit}
                items={modelYearPItems}
                onValueChange={item => this.setState({ modelYearLimit: item })}
                selectLabel="년식 선택(옵션)"
              />

              <JBPicker
                title="필수면허"
                selectedValue={licenseLimit}
                items={licensePItems}
                onValueChange={item => this.setState({ licenseLimit: item })}
                selectLabel="면허 선택(옵션)"
              />

              <JBPicker
                title="비파괴 개월제한"
                selectedValue={nondestLimit}
                items={nondestPItems}
                onValueChange={item => this.setState({ nondestLimit: item })}
                selectLabel="개월 선택(옵션)"
              />

              <JBPicker
                title="경력제한"
                selectedValue={careerLimit}
                items={careerPItems}
                onValueChange={item => this.setState({ careerLimit: item })}
                selectLabel="경력 선택(옵션)"
              />

              <JBButton
                title="일감 등록완료"
                onPress={() => this.confirmCreateWork()}
                size="full"
                Secondary
              />
              <View style={styles.modalWrap}>
                <EquipementModal
                  isVisibleEquiModal={isVisibleEquiModal}
                  closeModal={() =>
                    this.setState({ isVisibleEquiModal: false })
                  }
                  selEquipmentStr={equipment}
                  completeSelEqui={seledEuipListStr =>
                    this.setState({ equipment: seledEuipListStr })
                  }
                  depth={2}
                />
                <MapAddWebModal
                  isVisibleMapAddModal={isVisibleMapAddModal}
                  setMapAddModalVisible={flag =>
                    this.setState({ isVisibleMapAddModal: flag })
                  }
                  saveAddrInfo={this.saveAddrInfo}
                  nextFocus={() => {}}
                />
              </View>
            </CardUI>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

export default WorkRegisterScreen;
