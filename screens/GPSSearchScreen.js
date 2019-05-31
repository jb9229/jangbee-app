import React from 'react';
import {
  Alert, BackHandler, Switch, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { Location, Permissions } from 'expo';
import Styled from 'styled-components/native';
import JBButton from '../components/molecules/JBButton';
import SearCondBox from '../components/organisms/SearCondBox';
import JangbeeAdList from '../components/JangbeeAdList';
import EquipementModal from '../components/EquipmentModal';
import LocalSelModal from '../components/LocalSelModal';
import colors from '../constants/Colors';
import fonts from '../constants/Fonts';
import adLocation from '../constants/AdLocation';
import * as api from '../api/api';
import FirmSearList from '../components/organisms/FirmSearList';
import JBIcon from '../components/molecules/JBIcon';
import { validatePresence } from '../utils/Validation';
import FirmCreaErrMSG from '../components/organisms/JBErrorMessage';
import JBActIndicator from '../components/organisms/JBActIndicator';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.batangLight,
  },
  adWrap: {
    paddingBottom: 10,
  },
  cardWrap: {
    flex: 1,
    padding: 10,
    paddingTop: 0,
  },
  card: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: colors.pointBatang,
    padding: 5,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 15,
  },
  switchWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.pointDark,
    borderStyle: 'dashed',
    borderRadius: 5,
  },
  searEquiWrap: {
    alignItems: 'center',
  },
  roundSeperatorWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  roundSeperator: {
    borderWidth: 2,
    borderRadius: 50,
    borderColor: colors.batangDark,
    marginLeft: 8,
    marginRight: 8,
  },
  commWrap: {
    justifyContent: 'flex-end',
    paddingTop: 3,
    paddingBottom: 3,
  },
  gpsWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  currLocText: {
    color: colors.point2,
    fontFamily: fonts.batang,
    fontSize: 12,
  },
  searchModeSwitch: {
    transform: [{ scaleX: 1.8 }, { scaleY: 1.5 }],
    marginLeft: 40,
    marginRight: 30,
  },
  firmListWrap: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    marginLeft: 5,
    marginRight: 5,
  },
});

const SwitchText = Styled.Text`
  font-family: ${fonts.titleTop};
  font-size: 26;
  align-items: flex-end;
  justify-content: center;
  color: ${colors.point2};
  ${props => props.select
    && `
    color: ${colors.batang};
  `}
`;

const SwitchTO = Styled.TouchableOpacity`
    
`;

export default class GPSSearchScreen extends React.Component {
  _didFocusSubscription;

  _willBlurSubscription;

  static navigationOptions = {
    header: null,
  };

  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      isComponentMountComplete: false,
      isVisibleEquiModal: false,
      isVisibleLocalModal: false,
      isSearchViewMode: true,
      isLocalSearch: false,
      currLocation: '수신된 위치 정보가 없습니다',
      searEquipment: '',
      searSido: '',
      searGungu: '',
      searchedFirmList: null,
      page: 0,
      refreshing: false,
      isListLoading: undefined,
      isLastList: false,
      validationMessage: '',
    };

    this._didFocusSubscription = props.navigation.addListener('didFocus', payload => BackHandler.addEventListener('hardwareBackPress', this.handleBackPress));
  }

  componentDidMount() {
    const { navigation } = this.props;

    this._isMounted = true;

    this.setLocationInfo();
    this.setState({ isComponentMountComplete: true });

    this._willBlurSubscription = navigation.addListener('willBlur', payload => BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress));
  }

  componentWillUnmount() {
    this._isMounted = false;
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  /**
   * 내주변/지역 검색 모드변경 함수
   */
  changeSearMode = (isLocalMode) => {
    const { isSearchViewMode } = this.state;

    this.setState({
      isLocalSearch: isLocalMode,
      page: 0,
      isListLoading: undefined,
      searSido: '',
      searGungu: '',
    });

    if (!isSearchViewMode) {
      this.setSearchViewMode(true);
    }
  };

  /**
   * GPS정보수신 함수
   */
  getLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      Alert.alert('위치정보 접근이 허용되지 않았습니다.');
      return undefined;
    }

    const location = await Location.getCurrentPositionAsync({});

    this.setState({
      searLongitude: location.coords.longitude,
      searLatitude: location.coords.latitude,
    });

    // Text Code Deajeon Railway Station
    // this.setState({
    //   searLongitude: 127.433796,
    //   searLatitude: 36.332329,
    // });

    return location;
  };

  handleBackPress = () => {
    const { isSearchViewMode } = this.state;
    if (!isSearchViewMode) {
      this.setState({ isSearchViewMode: true });
    } else {
      Alert.alert('장비콜 종료', '정말 종료 하시겠습니까?', [
        { text: '아니요', onPress: () => {}, style: 'cancel' },
        { text: '종료', onPress: () => BackHandler.exitApp() },
      ]);
    }
    return true;
  };

  /**
   * GPS 좌표을 활용한 주소설정
   */
  setLocAddress = (logitude, latitude) => {
    api
      .getAddrByGpspoint(logitude, latitude)
      .then((addrInfo) => {
        if (!this._isMounted) {
          return;
        }

        if (addrInfo) {
          if (addrInfo.code === -2) {
            this.setState({
              currLocation: addrInfo.msg,
            });
          } else if (addrInfo.documents[0]) {
            const address = addrInfo.documents[0]; // region_type: H(행정동, documents[1]) or B(법정동, documents[0])
            const addressName = address.address_name;
            const sido = address.region_1depth_name;
            let gungu = address.region_2depth_name;
            if (!gungu) {
              gungu = address.region_3depth_name;
            }

            this.setState({
              currLocation: `현 위치 수신됨: ${addressName}`,
              searSido: sido,
              searGungu: gungu,
            });
          } else {
            Alert.alert('유효하지 않은 좌표주소 입니다', `응답 내용: ${addrInfo}`);
          }
        }
      })
      .catch((error) => {
        if (!this._isMounted) {
          return;
        }

        Alert.alert(
          '현 위치 수신에 문제가 있습니다, 재 시도해 주세요.',
          `[${error.name}] ${error.message}`,
        );
      });
  };

  /**
   * 검색화면/광고화면 전환 함수
   */
  setSearchViewMode = (flag) => {
    const { isSearchViewMode } = this.state;

    if (flag !== isSearchViewMode) {
      this.setState({ isSearchViewMode: flag });
    }
  };

  /**
   * 주변 장비업체 검색 요청함수
   */
  searchNearJangbee = () => {
    const {
      searchedFirmList, page, searEquipment, searLongitude, searLatitude,
    } = this.state;

    if (!this.validateSearNearFirm()) {
      return;
    }

    this.setSearchViewMode(false);

    api
      .getNearFirmList(page, searEquipment, searLongitude, searLatitude)
      .then((res) => {
        if (!this._isMounted) {
          return;
        }

        this.setState({
          searchedFirmList: page === 0 ? res.content : [...searchedFirmList, ...res.content],
          isLastList: res.last,
          isListLoading: false,
          refreshing: false,
        });
      })
      .catch((error) => {
        if (!this._isMounted) {
          return;
        }

        Alert.alert(
          '주변 장비 조회에 문제가 있습니다, 재 시도해 주세요.',
          `[${error.name}] ${error.message}`,
        );
        this.setState({ isListLoading: false });
      });
  };

  /**
   * 지역 장비업체 검색 함수
   */
  searchLocJangbee = () => {
    const {
      page, searchedFirmList, searEquipment, searSido, searGungu,
    } = this.state;

    if (!this.validateSearLocFirm()) {
      return;
    }

    this.setSearchViewMode(false);

    api
      .getLocalFirmList(page, searEquipment, searSido, searGungu)
      .then((res) => {
        if (!this._isMounted) {
          return;
        }

        this.setState({
          searchedFirmList: page === 0 ? res.content : [...searchedFirmList, ...res.content],
          isLastList: res.last,
          isListLoading: false,
          refreshing: false,
        });
      })
      .catch((error) => {
        if (!this._isMounted) {
          return;
        }

        Alert.alert(
          '주변 장비 조회에 문제가 있습니다, 재 시도해 주세요.',
          `[${error.name}] ${error.message}`,
        );
        this.setState({ isListLoading: false });
      });
  };

  /**
   * 지역장비 검색 유효성 검사 함수
   */
  validateSearNearFirm = () => {
    const { searEquipment, searLongitude, searLatitude } = this.state;

    this.setState({ validationMessage: '' });

    let v = validatePresence(searEquipment);
    if (!v[0]) {
      this.setState({ validationMessage: '검색할 장비명을 선택해 주세요' });
      return false;
    }

    v = validatePresence(searLongitude);
    if (!v[0]) {
      this.setState({
        validationMessage:
          '위치정보가 아직 수신되지 않았습니다, 조금만 기다려 주시거나 위치정보 새로고침을 눌러 주세요.',
      });
      return false;
    }

    v = validatePresence(searLatitude);
    if (!v[0]) {
      this.setState({
        validationMessage:
          '위치정보가 아직 수신되지 않았습니다, 조금만 기다려 주시거나 위치정보 새로고침을 눌러 주세요.',
      });
      return false;
    }

    return true;
  };

  /**
   * 지역장비 검색 유효성 검사 함수
   */
  validateSearLocFirm = () => {
    const { searEquipment, searSido, searGungu } = this.state;

    this.setState({ validationMessage: '' });

    let v = validatePresence(searEquipment);
    if (!v[0]) {
      this.setState({ validationMessage: '검색할 장비명을 선택해 주세요' });
      return false;
    }

    v = validatePresence(searSido);
    if (!v[0]) {
      this.setState({ validationMessage: '검색할 지역(시도) 선택해 주세요' });
      return false;
    }

    return true;
  };

  /**
   * 장비업체리스트 새로고침 함수
   */
  handleRefresh = () => {
    const { isLocalSearch } = this.state;

    this.setState(
      {
        page: 0,
        refreshing: true,
      },
      () => {
        if (isLocalSearch) {
          this.searchLocJangbee();
        } else {
          this.searchNearJangbee();
        }
      },
    );
  };

  /**
   * 장비업체리스트 페이징 추가 함수
   */
  handleLoadMore = () => {
    const { page, isLastList } = this.state;

    if (isLastList) {
      return;
    }

    this.setState(
      {
        page: page + 1,
      },
      () => {
        this.searchNearJangbee();
      },
    );
  };

  /**
   * 사용자 위치설정 함수
   */
  setLocationInfo = async () => {
    const location = await this.getLocation();

    if (location) {
      this.setLocAddress(location.coords.longitude, location.coords.latitude);
    }
  };

  /**
   * 검색지역 설정 팝업창열기 함수
   */
  openSelLocModal = () => {
    const { searEquipment } = this.state;

    if (searEquipment === '') {
      Alert.alert('검색할 장비 먼저 선택해 주세요.');
      return;
    }
    this.setState({ isVisibleLocalModal: true });
  };

  render() {
    const { navigation } = this.props;
    const {
      isComponentMountComplete,
      isSearchViewMode,
      isLocalSearch,
      isVisibleEquiModal,
      isVisibleLocalModal,
      searEquipment,
      currLocation,
      searSido,
      searGungu,
      searchedFirmList,
      page,
      refreshing,
      isLastList,
      isListLoading,
      validationMessage,
    } = this.state;

    if (!isComponentMountComplete) {
      return <JBActIndicator title="위치정보 불러오는중..." size={35} />;
    }

    let searchLocalCondition = '';

    if (searSido && searGungu) {
      searchLocalCondition = `${searSido} ${searGungu}`;
    }

    if (searSido && !searGungu) {
      searchLocalCondition = `${searSido}`;
    }

    return (
      <View style={styles.container}>
        <EquipementModal
          isVisibleEquiModal={isVisibleEquiModal}
          closeModal={() => this.setState({ isVisibleEquiModal: false })}
          selEquipmentStr={searEquipment}
          completeSelEqui={seledEuipListStr => this.setState({ searEquipment: seledEuipListStr })}
          nextFocus={() => {}}
          singleSelectMode
          advertisement
        />
        <LocalSelModal
          isVisibleModal={isVisibleLocalModal}
          closeModal={() => this.setState({ isVisibleLocalModal: false })}
          completeSelLocal={(sido, gungu) => this.setState({ searSido: sido, searGungu: gungu })}
          nextFocus={() => {}}
          isCatSelectable
        />
        <View style={styles.adWrap}>
          <JangbeeAdList
            adLocation={isSearchViewMode ? adLocation.main : adLocation.local}
            euqiTarget={searEquipment}
            sidoTarget={searSido}
            gugunTarget={searGungu}
            navigation={navigation}
          />
        </View>
        {isSearchViewMode ? (
          <View style={styles.cardWrap}>
            <View style={styles.card}>
              <View style={styles.switchWrap}>
                <SwitchTO onPress={() => this.changeSearMode(false)}>
                  <SwitchText select={isLocalSearch}>주변 검색</SwitchText>
                </SwitchTO>
                <Switch
                  value={isLocalSearch}
                  onValueChange={newValue => this.changeSearMode(newValue)}
                  thumbColor={colors.point2}
                  style={styles.searchModeSwitch}
                  trackColor={{ false: colors.batang, true: colors.batang }}
                />
                <SwitchTO onPress={() => this.changeSearMode(true)}>
                  <SwitchText select={!isLocalSearch}>지역 검색</SwitchText>
                </SwitchTO>
              </View>
              <View style={styles.searEquiWrap}>
                <SearCondBox
                  searchCondition={searEquipment}
                  onPress={() => this.setState({ isVisibleEquiModal: true })}
                  defaultCondtion="장비 선택하기"
                />

                {isLocalSearch && (
                  <View>
                    <View style={styles.roundSeperatorWrap}>
                      <View style={styles.roundSeperator} />
                      <View style={styles.roundSeperator} />
                      <View style={styles.roundSeperator} />
                    </View>
                    <SearCondBox
                      searchCondition={searchLocalCondition}
                      defaultCondtion="지역 선택하기"
                      onPress={() => this.openSelLocModal()}
                    />
                  </View>
                )}
              </View>
              <View style={styles.commWrap}>
                {!isLocalSearch ? (
                  <View style={styles.gpsWrap}>
                    <Text style={styles.currLocText}>{currLocation}</Text>
                    <JBIcon
                      name="refresh"
                      size={24}
                      color={colors.point2}
                      onPress={() => this.setLocationInfo()}
                    />
                  </View>
                ) : null}
                <FirmCreaErrMSG errorMSG={validationMessage} />
                {isLocalSearch ? (
                  <JBButton
                    title="지역 검색하기"
                    onPress={() => this.searchLocJangbee()}
                    size="full"
                    bgColor={colors.point2}
                    color="white"
                  />
                ) : (
                  <JBButton
                    title="주변 검색하기"
                    onPress={() => this.searchNearJangbee()}
                    size="full"
                    bgColor={colors.point2}
                    color="white"
                  />
                )}
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.firmListWrap}>
            <JBIcon
              name="close"
              size={23}
              onPress={() => this.setState({ searchedFirmList: [], page: 0, isSearchViewMode: true })
              }
            />
            <FirmSearList
              data={searchedFirmList}
              page={page}
              refreshing={refreshing}
              last={isLastList}
              isLoading={isListLoading}
              handleLoadMore={this.handleLoadMore}
              handleRefresh={this.handleRefresh}
              selEquipment={searEquipment}
              selSido={searSido}
              selGungu={searGungu}
              {...this.props}
            />
          </View>
        )}
      </View>
    );
  }
}
