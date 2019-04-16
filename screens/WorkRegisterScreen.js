import React from 'react';
import {
  DatePickerAndroid,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  Picker,
  View,
} from 'react-native';
import * as api from '../api/api';
import { notifyError } from '../common/ErrorNotice';
import EquipementModal from '../components/EquipmentModal';
import MapAddWebModal from '../components/MapAddWebModal';
import CardUI from '../components/molecules/CardUI';
import JBButton from '../components/molecules/JBButton';
import JBTextInput from '../components/molecules/JBTextInput';
import JBErrorMessage from '../components/organisms/JBErrorMessage';
import { validate, validatePresence } from '../utils/Validation';
import fonts from '../constants/Fonts';
import colors from '../constants/Colors';

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  modalWrap: {
    height: 0,
  },
  periodPicker: {
    width: 100,
    height: 50,
  },
  periodTitle: {
    fontFamily: fonts.titleMiddle,
    color: colors.title,
    fontSize: 15,
    marginBottom: 3,
  },
});

export default class WorkRegisterScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleEquiModal: false,
      isVisibleMapAddModal: false,
      equipment: '',
    };
  }

  /**
   * 일감 등록
   */
  createWork = () => {
    const { navigation } = this.props;
    const newWork = this.validateWorkForm();
    if (!newWork) {
      return;
    }

    api
      .createWork(newWork)
      .then((resBody) => {
        if (resBody) {
          navigation.navigate('WorkList');
          return;
        }

        notifyError(
          '일감등록에 문제가 있습니다',
          `다시 등록을 시도해 주세요(응답내용: ${resBody})`,
        );
      })
      .catch(error => notifyError(error.name, error.message));
  };

  openStartWorkDatePicker = async (isStart) => {
    try {
      const {
        action, year, month, day,
      } = await DatePickerAndroid.open({
        date: new Date(),
      });

      if (isStart) {
        this.setState({ startDate: `${year}-${month}-${day}` });
      } else {
        this.setState({ endDate: `${year}-${month}-${day}` });
      }

      if (action !== DatePickerAndroid.dismissedAction) {
        // Selected year, month (0-11), day
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  };

  /**
   * 일감주소 저장함수
   */
  saveAddrInfo = (addrData) => {
    this.setState({
      address: addrData.address,
      sidoAddr: addrData.sidoAddr,
      sigunguAddr: addrData.sigunguAddr,
      addrLongitude: addrData.addrLongitude,
      addrLatitude: addrData.addrLatitude,
    });
  };

  /**
   * 일감 데이터 유효성검사 함수
   */
  validateWorkForm = () => {
    const {
      equipment,
      address,
      addressDetail,
      startDate,
      period,
      detailRequest,
      addrLongitude,
      addrLatitude,
    } = this.state;

    // Validation Error Massage Initialize
    this.setState({
      equipmentValErrMessage: '',
      addressValErrMessage: '',
      addressDetailValErrMessage: '',
      dateValErrMessage: '',
      detailRequestValErrMessage: '',
    });

    let v = validate('textMax', equipment, true, 25);
    if (!v[0]) {
      this.setState({ equipmentValErrMessage: v[1] });
      return false;
    }

    v = validate('textMax', address, true, 100);
    if (!v[0]) {
      this.setState({ addressValErrMessage: v[1] });
      return false;
    }

    v = validate('textMax', addressDetail, false, 45);
    if (!v[0]) {
      this.setState({ addressDetailValErrMessage: v[1] });
      return false;
    }

    v = validatePresence(startDate);
    if (!v[0]) {
      this.setState({ dateValErrMessage: v[1] });
      return false;
    }

    v = validatePresence(period);
    if (!v[0]) {
      this.setState({ dateValErrMessage: v[1] });
      return false;
    }

    v = validate('textMax', detailRequest, true, 500);
    if (!v[0]) {
      this.setState({ detailRequestValErrMessage: v[1] });
      return false;
    }

    const newWork = {
      equipment,
      address,
      addressDetail,
      startDate,
      period,
      detailRequest,
      addrLongitude,
      addrLatitude,
    };

    return newWork;
  };

  render() {
    const {
      isVisibleEquiModal,
      isVisibleMapAddModal,
      equipment,
      address,
      addressDetail,
      startDate,
      period,
      detailRequest,
      equipmentValErrMessage,
      addressValErrMessage,
      addressDetailValErrMessage,
      dateValErrMessage,
      detailRequestValErrMessage,
    } = this.state;

    const dayPickItems = new Array(30)
      .fill()
      .map((_, i) => <Picker.Item key={i} label={`${i + 1}일`} value={`${i + 1}`} />);
    return (
      <View style={styles.Container}>
        <View style={styles.modalWrap}>
          <EquipementModal
            isVisibleEquiModal={isVisibleEquiModal}
            closeModal={() => this.setState({ isVisibleEquiModal: false })}
            selEquipmentStr={equipment}
            completeSelEqui={seledEuipListStr => this.setState({ equipment: seledEuipListStr })}
            depth={2}
          />
          <MapAddWebModal
            isVisibleMapAddModal={isVisibleMapAddModal}
            setMapAddModalVisible={flag => this.setState({ isVisibleMapAddModal: flag })}
            saveAddrInfo={this.saveAddrInfo}
            nextFocus={() => {}}
          />
        </View>
        <KeyboardAvoidingView>
          <ScrollView>
            <CardUI>
              <JBTextInput
                title="호출장비*"
                value={equipment}
                onChangeText={text => this.setState({ equipment: text })}
                placeholder="장비를 선택해 주세요"
                onFocus={() => this.setState({ isVisibleEquiModal: true })}
                tiRefer={(input) => {
                  this.equiTextInput = input;
                }}
              />
              <JBErrorMessage errorMSG={equipmentValErrMessage} />

              <JBTextInput
                title="현장주소(*)"
                value={address}
                tiRefer={(input) => {
                  this.addrTextInput = input;
                }}
                onChangeText={text => this.setState({ address: text })}
                onFocus={() => this.setState({ isVisibleMapAddModal: true })}
                placeholder="현장 주소를 검색해주세요"
              />
              <JBErrorMessage errorMSG={addressValErrMessage} />
              <JBTextInput
                title="상세주소"
                value={addressDetail}
                tiRefer={(input) => {
                  this.addrDetTextInput = input;
                }}
                onChangeText={text => this.setState({ addressDetail: text })}
                placeholder="상세주소를 입력해 주세요"
              />
              <JBErrorMessage errorMSG={addressDetailValErrMessage} />
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <JBTextInput
                  title="작업시작일"
                  value={startDate}
                  tiRefer={(input) => {
                    this.startDateTextInput = input;
                  }}
                  onChangeText={text => this.setState({ startDate: text })}
                  onFocus={() => this.openStartWorkDatePicker(true)}
                  placeholder="시작일 선택"
                />
                <View>
                  <Text style={styles.periodTitle}>기간</Text>
                  <Picker
                    selectedValue={period}
                    style={styles.periodPicker}
                    onValueChange={itemValue => this.setState({ period: itemValue })}
                  >
                    <Picker.Item label="오전" value="0.3" />
                    <Picker.Item label="오후" value="0.8" />
                    {dayPickItems}
                  </Picker>
                </View>
              </View>
              <JBErrorMessage errorMSG={dateValErrMessage} />

              <JBTextInput
                title="작업 세부사항"
                value={detailRequest}
                onChangeText={text => this.setState({ detailRequest: text })}
                placeholder="작업 세부사항 및 요청사항을 입력하세요."
                multiline
                numberOfLines={3}
              />
              <JBErrorMessage errorMSG={detailRequestValErrMessage} />
            </CardUI>
            <JBButton title="일감등록하기" onPress={() => this.createWork()} size="full" Primary />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}
