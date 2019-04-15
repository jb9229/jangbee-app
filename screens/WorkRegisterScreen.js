import React from 'react';
import {
  KeyboardAvoidingView,
  View,
  ScrollView,
  StyleSheet,
  Text,
  DatePickerAndroid,
} from 'react-native';
import EquipementModal from '../components/EquipmentModal';
import CardUI from '../components/molecules/CardUI';
import JBTextInput from '../components/molecules/JBTextInput';
import JBErrorMessage from '../components/organisms/JBErrorMessage';
import MapAddWebModal from '../components/MapAddWebModal';
import JBButton from '../components/molecules/JBButton';

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  modalWrap: {
    height: 0,
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

  render() {
    const {
      isVisibleEquiModal,
      isVisibleMapAddModal,
      equipment,
      address,
      startDate,
      endDate,
      detailRequest,
      equipmentValErrMessage,
      addressValErrMessage,
      startDateValErrMessage,
      detailRequestValErrMessage,
    } = this.state;

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
                title="현장주소"
                value={address}
                tiRefer={(input) => {
                  this.addrTextInput = input;
                }}
                onChangeText={text => this.setState({ address: text })}
                onFocus={() => this.setState({ isVisibleMapAddModal: true })}
                placeholder="현장 주소를 검색해주세요"
              />
              <JBErrorMessage errorMSG={addressValErrMessage} />
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
                <Text>~</Text>
                <JBTextInput
                  title="작업종료일"
                  value={endDate}
                  tiRefer={(input) => {
                    this.endDateTextInput = input;
                  }}
                  onChangeText={text => this.setState({ endDate: text })}
                  onFocus={() => this.openStartWorkDatePicker(false)}
                  placeholder="종료일 선택"
                />
              </View>
              <JBErrorMessage errorMSG={startDateValErrMessage} />

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
