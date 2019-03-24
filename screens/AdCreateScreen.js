import React from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
  Picker,
  Text,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import JBTextInput from '../components/molecules/JBTextInput';
import JBButton from '../components/molecules/JBButton';
import ImagePickInput from '../components/molecules/ImagePickInput';
import JBErrorMessage from '../components/organisms/JBErrorMessage';
import EquipementModal from '../components/EquipmentModal';
import MapAddWebModal from '../components/MapAddWebModal';
import ListSeparator from '../components/molecules/ListSeparator';
import * as api from '../api/api';
import { withLogin } from '../contexts/LoginProvider';
import { notifyError } from '../common/ErrorNotice';
import * as firebaseDB from '../utils/FirebaseUtils';
import { validate, validatePresence } from '../utils/Validation';
import colors from '../constants/Colors';
import fonts from '../constants/Fonts';

const TouchableHighlight = styled.TouchableHighlight`
  ${props => props.selected
    && `
    background-color: ${colors.point};
  `};
`;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formWrap: {},
  adTypeFormWrap: {
    flex: 1,
    margin: 10,
    marginBottom: 3,
  },
  adTypeTitle: {
    fontFamily: fonts.titleMiddle,
    color: colors.title,
    fontSize: 15,
    marginBottom: 3,
  },
  adTypePicker: {},
  bookedAdTypeText: {
    textDecorationLine: 'line-through',
  },
  AdTypeText: {},
  accListItemTH: {},
  accListItemWrap: {
    padding: 10,
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 5,
  },
  accItemSelTH: {
    backgroundColor: colors.point,
    color: 'white',
  },
  botCommWrap: {
    alignItems: 'center',
  },
});

const ADTYPE_MAIN_FIRST = 1;
const ADTYPE_MAIN_SECONDE = 2;
const ADTYPE_MAIN_THIRD = 3;
const ADTYPE_EQUIPMENT_FIRST = 11;
const ADTYPE_EQUIPMENT_SECONDE = 12;
const ADTYPE_EQUIPMENT_THIRD = 13;
const ADTYPE_LOCAL_FIRST = 21;
const ADTYPE_LOCAL_SECONDE = 22;
const ADTYPE_LOCAL_THIRD = 23;
const ADTYPE_SEARCH_FIRST = 31;
const ADTYPE_SEARCH_SECONDE = 32;
const ADTYPE_SEARCH_THIRD = 33;

class AdCreateScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAccEmpty: undefined,
      isVisibleEquiModal: false,
      isVisibleMapAddModal: false,
      accList: [],
      bookedAdTypeList: [1, 2],
      payErrMessage: '',
      selFinUseNum: [],
      adType: undefined,
      adTitle: '',
      adSubTitle: '',
      forMonths: '',
      adPhotoUrl: '',
      adEquipment: '',
      adSido: '',
      adGungu: '',
      adTitleValErrMessage: '',
      adSubTitleValErrMessage: '',
      adPhotoUrlValErrMessage: '',
      adTelNumberValErrMessage: '',
      selFinUseNumValErrMessage: '',
      adEquipmentValErrMessage: '',
      adLocalValErrMessage: '',
    };
  }

  componentDidMount() {
    this.setAvailableAdType();
    this.setOpenBankAccountList();
  }

  componentWillReceiveProps(nextProps) {
    const { params } = nextProps.navigation.state;

    if (params !== undefined && params.action === 'RELOAD') {
      this.setAvailableAdType();
      this.setOpenBankAccountList();
    }
  }

  setAvailableAdType = () => {
    api
      .getBookedAdType()
      .then((typeData) => {
        this.setState({ bookedAdTypeList: typeData });
      })
      .catch((error) => {
        notifyError(error.name, error.message);
      });
  };

  /**
   * 결제계좌 추가 함수
   */
  addOBAccount = () => {
    const { navigation } = this.props;

    navigation.navigate('OpenBankAuth', { type: 'ADD_ACCOUNT' });
  };

  /**
   * 광고비 요청함수
   */
  getAdPrice = (adType) => {
    if (adType === ADTYPE_MAIN_FIRST) { return 70000; }
    if (adType === ADTYPE_MAIN_SECONDE) { return 50000; }
    if (adType === ADTYPE_MAIN_THIRD) { return 30000; }
    if (adType === ADTYPE_EQUIPMENT_FIRST) { return 20000; }
    if (adType === ADTYPE_LOCAL_FIRST) { return 10000; }
    return 0;
  }

  /**
   * 광고 결재할 계좌리스트 설정함수
   */
  setOpenBankAccountList = async () => {
    const { user } = this.props;

    const fUserInfo = await firebaseDB.getUserInfo(user.uid);

    const { obAccessToken, obUserSeqNo } = fUserInfo;
    if (obAccessToken === undefined || obUserSeqNo === undefined) {
      this.setState({ isAccEmpty: true });
      return;
    }

    api
      .getOBAccList(obAccessToken, obUserSeqNo, 'N', 'A')
      .then((userInfo) => {
        if (userInfo.res_cnt !== '0') {
          this.setState({ accList: userInfo.res_list, isAccEmpty: false });
          return;
        }

        this.setState({ isAccEmpty: true });
      })
      .catch((error) => {
        Alert.alert(
          '네트워크 문제가 있습니다, 다시 시도해 주세요.',
          `계좌리스트 조회 실패 -> [${error.name}] ${error.message}`,
        );

        this.setState({ isAccEmpty: true });
      });
  };

  /**
   * 광고생성폼 유효성검사 메세지 초기화함수
   */
  setInitValErroMSG = () => {
    this.setState({
      adTitleValErrMessage: '',
      adSubTitleValErrMessage: '',
      adPhotoUrlValErrMessage: '',
      adTelNumberValErrMessage: '',
      forMonthsValErrMessage: '',
      selFinUseNumValErrMessage: '',
      adEquipmentValErrMessage: '',
      adLocalValErrMessage: '',
    });
  }

  onAccListItemPress = (idStr) => {
    const newAccListSelcted = [];

    newAccListSelcted.push(idStr); // toggle
    this.setState({ selFinUseNum: newAccListSelcted });
  };

  /**
   * 광고타입 픽 이벤트 함수
   */
  onPickAdType = (pickType) => {
    const { bookedAdTypeList } = this.state;

    if (pickType !== 11 && pickType !== 21 && bookedAdTypeList.includes(pickType)) {
      Alert.alert('죄송합니다', '이미 계약된 광고 입니다');
      this.setState({ adType: undefined });
    } else {
      this.setState({ adType: pickType });
    }
  };

  /**
   * 광고생성 요청함수
   */
  requestCreaAd = async () => {
    const { adType, adTitle, adSubTitle, forMonths, adPhotoUrl, adEquipment, adTelNumber, adSido, adGungu, selFinUseNum } = this.state;
    const { navigation, user } = this.props;

    const newAd = {
      adType,
      accountId: user.uid,
      title: adTitle,
      subTitle: adSubTitle,
      forMonths,
      photoUrl: adPhotoUrl,
      telNumber: adTelNumber,
      fintechUseNum: selFinUseNum,
      equiTarget: adEquipment,
      sidoTarget: adSido,
      gugunTarget: adGungu,
      price: this.getAdPrice(adType),
    };

    api
      .createAd(newAd)
      .then(() => navigation.navigate('Ad', { refresh: true }))
      .catch((errorResponse) => {
        errorResponse.json()
          .then((errorMessage) => {
            Alert.alert('광고생성 실패', errorMessage.message);
          });
      });
  };

  /**
   * 광고생성 유효성검사 함수
   */
  validateCreaAd = () => {
    const { adType, adEquipment, adSido, adGungu } = this.state;
    // Check Validation Create Ad Form Item
    if (!this.valiCreAdForm()) { return; }

    // Equipment Target Ad Validation
    if (adType === ADTYPE_EQUIPMENT_FIRST && this.validateEquipTarAdForm()) {
      api
        .existEuipTarketAd(adEquipment)
        .then((dupliResult) => {
          if (dupliResult === null) {
            this.requestCreaAd();
          } else {
            notifyError('장비 타켓광고 생성 실패', `죄송합니다, 해당 ${adSido} ${adGungu}는 [${dupliResult.endDate}]까지 계약된 광고가 존재 합니다.`);
          }
        })
        .catch((error) => {
          notifyError('장비 타켓광고 중복검사 문제', error.message);
        });
    }

    // Local Target Ad Validation
    if (adType === ADTYPE_LOCAL_FIRST && this.validateLocTarAdForm()) {
      api
        .existLocalTarketAd(adEquipment, adSido, adGungu)
        .then((dupliResult) => {
          if (dupliResult === null) {
            this.requestCreaAd();
          } else {
            notifyError('지역 타켓광고 생성 실패', `죄송합니다, [${dupliResult.endDate}]까지 계약된 광고가 존재 합니다.`);
          }
        })
        .catch((error) => {
          notifyError('지역 타켓광고 중복검사 문제', error.message);
        });
    }
  };

  /**
   * 광고생성 폼 유효성검사 함수
   */
  valiCreAdForm = () => {
    const { adType, adTitle, adSubTitle, forMonths, adPhotoUrl, adTelNumber, selFinUseNum } = this.state;
    const { user } = this.props;

    // Validation Error Massage Initialize
    this.setInitValErroMSG();

    if (adType === undefined) { Alert.alert('유효성검사 에러', '광고타입을 선택해 주세요.'); return false; }
    if (user === undefined || user === null || user.uid === undefined || user.uid === null) { Alert.alert('유효성검사 에러', '사용자정보를 찾지 못했습니다, 재로그인해 주세요'); return false; }

    let v = validate('decimalMin', forMonths, true, 1);
    if (!v[0]) {
      this.setState({ forMonthsValErrMessage: v[1] });
      return false;
    }

    v = validate('textMax', adTitle, true, 15);
    if (!v[0]) {
      this.setState({ adTitleValErrMessage: v[1] });
      return false;
    }

    v = validate('textMax', adSubTitle, true, 20);
    if (!v[0]) {
      this.setState({ adSubTitleValErrMessage: v[1] });
      return false;
    }

    v = validate('textMax', adPhotoUrl, false, 250);
    if (!v[0]) {
      this.setState({ adPhotoUrlValErrMessage: v[1] });
      return false;
    }

    v = validate('cellPhone', adTelNumber, false);
    if (!v[0]) {
      this.setState({ adTelNumberValErrMessage: v[1] });
      return false;
    }

    v = validatePresence(selFinUseNum);
    if (!v[0]) {
      this.setState({ selFinUseNumValErrMessage: v[1] });
      return false;
    }

    return true;
  }

  /**
   * 장비 타켓 광고 Validation 체크
   */
  validateEquipTarAdForm = () => {
    const { adEquipment } = this.state;

    const v = validatePresence(adEquipment);
    if (!v[0]) {
      this.setState({ adEquipmentValErrMessage: v[1] });
      return false;
    }

    return true;
  }

  /**
   * 지역 타켓 광고 Validation 체크
   */
  validateLocTarAdForm = () => {
    const { adEquipment, adSido, adGungu } = this.state;

    let v = validatePresence(adEquipment);
    if (!v[0]) {
      this.setState({ adEquipmentValErrMessage: v[1] });
      return false;
    }

    v = validatePresence(adSido);
    if (!v[0]) {
      this.setState({ adLocalValErrMessage: v[1] });
      return false;
    }

    v = validatePresence(adGungu);
    if (!v[0]) {
      this.setState({ adLocalValErrMessage: v[1] });
      return false;
    }

    return true;
  }

  /**
   * 광고타입 렌더링 함수
   */
  renderAdTypeList = (type, typeDescription) => {
    const { bookedAdTypeList } = this.state;
    if (bookedAdTypeList.includes(type)) {
      return <Picker.Item label={typeDescription} value={type} />; // color="gray" it is issued when onselect
    }

    return <Picker.Item label={typeDescription} value={type} />;
  };

  /**
   * 오픈뱅크 계좌UI 렌더링 함수
   */
  renderAccListItem = ({ item }) => {
    const { selFinUseNum } = this.state;

    return (
      <View>
        <TouchableHighlight
          onPress={() => this.onAccListItemPress(item.fintech_use_num)}
          selected={selFinUseNum.includes(item.fintech_use_num)}
        >
          <View style={[styles.accListItemWrap]}>
            <Text>{item.account_alias}</Text>
            <Text>{item.bank_name}</Text>
            <Text>{item.account_holder_name}</Text>
            <Text>{item.fintech_use_num}</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  };

  testAdPayment = () => {
    this.setState({selFinUseNum: 'TEST'});
    this.validateCreaAd();
  }

  render() {
    const {
      isAccEmpty,
      isVisibleEquiModal,
      isVisibleMapAddModal,
      accList,
      selFinUseNum,
      adType,
      adTitle,
      forMonths,
      adTelNumber,
      adSubTitle,
      adPhotoUrl,
      adEquipment,
      adSido,
      adGungu,
      payErrMessage,
      adTitleValErrMessage,
      adSubTitleValErrMessage,
      forMonthsValErrMessage,
      adPhotoUrlValErrMessage,
      adTelNumberValErrMessage,
      selFinUseNumValErrMessage,
      adEquipmentValErrMessage,
      adLocalValErrMessage,
    } = this.state;
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView>
          <ScrollView contentContainerStyle={styles.formWrap}>
            <EquipementModal
              isVisibleEquiModal={isVisibleEquiModal}
              closeModal={() => this.setState({ isVisibleEquiModal: false })}
              selEquipmentStr={adEquipment}
              completeSelEqui={seledEuipListStr => this.setState({ adEquipment: seledEuipListStr })}
              nextFocus={() => {}}
              singleSelectMode
            />
            <MapAddWebModal
              isVisibleMapAddModal={isVisibleMapAddModal}
              setMapAddModalVisible={(visible) => {
                this.setState({ isVisibleMapAddModal: visible });
              }}
              saveAddrInfo={(addrData) => {
                this.setState({ adSido: addrData.sidoAddr, adGungu: addrData.sigunguAddr });
              }}
              nextFocus={() => {}}
            />
            <View style={styles.adTypeFormWrap}>
              <Text style={styles.adTypeTitle}>광고타입</Text>
              <Picker
                selectedValue={adType}
                style={styles.adTypePicker}
                onValueChange={itemValue => this.onPickAdType(itemValue)}
              >
                <Picker.Item label="=== 광고타입 선택 ===" value={undefined} />
                {this.renderAdTypeList(1, '메인광고_첫번째(월 7만원)')}
                {this.renderAdTypeList(2, '메인광고_두번째(월 6만원)')}
                {this.renderAdTypeList(3, '메인광고_세번째(월 3만원)')}
                <Picker.Item label="장비 타켓광고_첫번째(월 2만원)" value={ADTYPE_EQUIPMENT_FIRST} />
                <Picker.Item label="지역 타켓광고_첫번째(월 1만원)" value={ADTYPE_LOCAL_FIRST} />
              </Picker>
            </View>
            <JBTextInput
              title="계약기간(월)"
              value={forMonths}
              onChangeText={text => this.setState({ forMonths: text })}
              placeholder="몇개월간 홍보하시겠습니까?"
              keyboardType="numeric"
            />
            <JBErrorMessage errorMSG={forMonthsValErrMessage} />
            <JBTextInput
              title="광고 타이틀(10자까지)"
              value={adTitle}
              onChangeText={text => this.setState({ adTitle: text })}
              placeholder="광고상단 문구를 입력하세요(최대 10자)"
            />
            <JBErrorMessage errorMSG={adTitleValErrMessage} />
            <JBTextInput
              title="광고 슬로건(20자까지)"
              value={adSubTitle}
              onChangeText={text => this.setState({ adSubTitle: text })}
              placeholder="광고하단 문구를 입력하세요(최대 20자)"
            />
            <JBErrorMessage errorMSG={adSubTitleValErrMessage} />
            <ImagePickInput
              itemTitle="광고배경 사진"
              imgUrl={adPhotoUrl}
              aspect={[4, 3]}
              setImageUrl={url => this.setState({ adPhotoUrl: url })}
            />
            <JBErrorMessage errorMSG={adPhotoUrlValErrMessage} />
            <JBTextInput
              title="전화번호"
              value={adTelNumber}
              onChangeText={text => this.setState({ adTelNumber: text })}
              placeholder="휴대전화 번호입력(숫자만)"
            />
            <JBErrorMessage errorMSG={adTelNumberValErrMessage} />
            {(adType === 11 || adType === 21) && (
              <JBTextInput
                title="타켓 광고(장비)"
                value={adEquipment}
                onChangeText={text => this.setState({ adEquipment: text })}
                onFocus={() => this.setState({ isVisibleEquiModal: true })}
                placeholder="타켓광고 장비 선택해 주세요"
              />
            )}
            <JBErrorMessage errorMSG={adEquipmentValErrMessage} />
            {adType === 21 && (
              <JBTextInput
                title="타켓 광고(지역)"
                value={`${adSido}${adGungu}`}
                onFocus={() => this.setState({ isVisibleMapAddModal: true })}
                placeholder="타켓광고 지역을 선택해 주세요"
              />
            )}
            <JBErrorMessage errorMSG={adLocalValErrMessage} />
            <View>
              {isAccEmpty !== undefined && !isAccEmpty && (
                <FlatList
                  data={accList}
                  extraData={selFinUseNum}
                  renderItem={this.renderAccListItem}
                  keyExtractor={(item, index) => index.toString()}
                  ItemSeparatorComponent={ListSeparator}
                />
              )}
              <JBErrorMessage errorMSG={selFinUseNumValErrMessage} />
              <JBButton title="결제계좌 추가" onPress={this.addOBAccount} size="small" />
            </View>
            <View style={styles.botCommWrap}>
              <JBErrorMessage errorMSG={payErrMessage} />
              {isAccEmpty !== undefined && !isAccEmpty ? (
                <JBButton title="결제하기" onPress={this.validateCreaAd} size="full" />
              ) : (
                <View>
                  <Text>먼저, 자동이체 계좌를 등록해 주세요.</Text>
                </View>
              )}
              <JBButton title="테스트용결제(추후삭제)" onPress={this.testAdPayment} size="full" />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

export default withLogin(AdCreateScreen);
