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
import { withLogin } from '../contexts/LoginProvider';
import * as api from '../api/api';
import EquipementModal from '../components/EquipmentModal';
import MapAddWebModal from '../components/MapAddWebModal';
import { getOpenBankAuthInfo } from '../auth/OBAuthTokenManager';
import ListSeparator from '../components/molecules/ListSeparator';
import colors from '../constants/Colors';
import fonts from '../constants/Fonts';
import { notifyError } from '../common/ErrorNotice';
import * as firebaseDB from '../utils/FirebaseUtils';

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
      accListSelcted: [],
      adPhoto: '',
      adEquipment: '',
      adSido: '',
      adGungu: '',
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

  adPayment = async () => {
    const { accListSelcted } = this.state;
    const openBankAuthInfo = await getOpenBankAuthInfo();

    api
      .transferWithdraw(openBankAuthInfo, accListSelcted[0], 200)
      .then(res => console.log(res))
      .catch((error) => {
        Alert.alert(
          '네트워크 문제발생, 다시 시도해 주세요.',
          `결제요청 실패 -> [${error.name}] ${error.message}`,
        );
      });
  };

  /**
   * 광고 결재할 계좌리스트 설정함수
   */
  setOpenBankAccountList = async () => {
    const { user } = this.props;

    console.log(user.uid)
    const fUserInfo = await firebaseDB.getUserInfo(user.uid);

    const { obAccessToken, obUserSeqNo } = fUserInfo;
    console.log(obAccessToken)
    console.log(obUserSeqNo)
    if (obAccessToken === undefined || obUserSeqNo === undefined) {
      this.setState({ isAccEmpty: true });
console.log("obAccessToken")
console.log(obAccessToken)
      return;
    }
    console.log(obUserSeqNo)
    console.log("api getOBAccList request")
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

  renderAdTypeList = (type, typeDescription) => {
    const { bookedAdTypeList } = this.state;
    if (bookedAdTypeList.includes(type)) {
      return <Picker.Item label={typeDescription} value={type} />; // color="gray" it is issued when onselect
    }

    return <Picker.Item label={typeDescription} value={type} />;
  };

  onAccListItemPress = (idStr) => {
    const newAccListSelcted = [];

    newAccListSelcted.push(idStr); // toggle
    this.setState({ accListSelcted: newAccListSelcted });
  };

  /**
   * 광고타입 픽 이벤트 함수
   */
  onPickAdType = (pickType) => {
    const { bookedAdTypeList } = this.state;

    if (pickType !== 11 && pickType !== 22 && bookedAdTypeList.includes(pickType)) {
      Alert.alert('이미 계약된 광고 입니다');
      this.setState({ adType: undefined });
    } else {
      this.setState({ adType: pickType });
    }
  };

  /**
   * 오픈뱅크 계좌UI 렌더링 함수
   */
  renderAccListItem = ({ item }) => {
    const { accListSelcted } = this.state;

    return (
      <View>
        <TouchableHighlight
          onPress={() => this.onAccListItemPress(item.fintech_use_num)}
          selected={accListSelcted.includes(item.fintech_use_num)}
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

  render() {
    const {
      isAccEmpty,
      isVisibleEquiModal,
      isVisibleMapAddModal,
      accList,
      accListSelcted,
      adType,
      adTitle,
      adSubTitle,
      adPhoto,
      adEquipment,
      adSido,
      adGungu,
      payErrMessage,
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
                {this.renderAdTypeList(1, '메인광고 첫번째(월 7만원)')}
                {this.renderAdTypeList(2, '메인광고 두번째(월 6만원)')}
                {this.renderAdTypeList(3, '메인광고 세번째(월 3만원)')}
                <Picker.Item label="장비선택팝업창1(월 2만원)" value={11} />
                <Picker.Item label="지역선택팝업창1(월 1만원)" value={22} />
              </Picker>
            </View>
            <JBTextInput
              title="광고 타이틀"
              value={adTitle}
              onChangeText={text => this.setState({ adTitle: text })}
              placeholder="광고상단 문구를 입력하세요(최대 10자)"
            />
            <JBTextInput
              title="광고 슬로건"
              value={adSubTitle}
              onChangeText={text => this.setState({ adSubTitle: text })}
              placeholder="광고하단 문구를 입력하세요(최대 20자)"
            />
            <ImagePickInput
              itemTitle="광고배경 사진"
              imgUrl={adPhoto}
              aspect={[4, 3]}
              setImageUrl={url => this.setState({ adPhoto: url })}
            />
            {(adType === 11 || adType === 22) && (
              <JBTextInput
                title="타켓 광고(장비)"
                value={adEquipment}
                onChangeText={text => this.setState({ adEquipment: text })}
                onFocus={() => this.setState({ isVisibleEquiModal: true })}
                placeholder="장비고객이 특정 장비를 선택 했을 경우 광고가 뜸"
              />
            )}
            {adType === 22 && (
              <JBTextInput
                title="타켓 광고(지역)"
                value={`${adSido}${adGungu}`}
                onFocus={() => this.setState({ isVisibleMapAddModal: true })}
                placeholder="타켓광고 지역을 선택해 주세요"
              />
            )}
            <View>
              {isAccEmpty !== undefined && !isAccEmpty && (
                <FlatList
                  data={accList}
                  extraData={accListSelcted}
                  renderItem={this.renderAccListItem}
                  keyExtractor={(item, index) => index.toString()}
                  ItemSeparatorComponent={ListSeparator}
                />
              )}
              <JBButton title="결제계좌 추가" onPress={this.addOBAccount} size="small" />
            </View>
            <View style={styles.botCommWrap}>
              <JBErrorMessage errorMSG={payErrMessage} />
              {isAccEmpty !== undefined && !isAccEmpty ? (
                <JBButton title="결제하기" onPress={this.adPayment} size="full" />
              ) : (
                <View>
                  <Text>먼저, 자동이체 계좌를 등록해 주세요.</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

export default withLogin(AdCreateScreen);

