import React from 'react';
import { Alert, Switch, StyleSheet, Text, View } from 'react-native';
import JBButton from '../components/molecules/JBButton';
import SearCondBox from '../components/organisms/SearCondBox';
import JangbeeAd from '../components/organisms/JangbeeAd';
import EquipementModal from '../components/EquipmentModal';
import LocalSelModal from '../components/LocalSelModal';
import colors from '../constants/Colors';
import fonts from '../constants/Fonts';
import adType from '../constants/AdType';
import * as api from '../api/api';
import FirmSearList from '../components/organisms/FirmSearList';
import { Constants, Location, Permissions } from 'expo';
import JBIcon from '../components/molecules/JBIcon';
import { validatePresence } from '../utils/Validation';
import FirmCreaErrMSG from '../components/organisms/JBErrorMessage';

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
    backgroundColor: colors.cardBatang,
    padding: 5,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 15,
  },
  searEquiWrap: {
    alignItems: 'center',
  },
  commWrap: {
    justifyContent: 'flex-end',
    marginBottom: 5,
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
  switchWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  switchText: {
    fontSize: 15,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  firmListWrap: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    marginLeft: 5,
    marginRight: 5,
  },
});

export default class GPSSearchScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isVisibleEquiModal: false,
      isVisibleLocalModal: false,
      isSearViewMode: false,
      isLocalSearch: false,
      adEuqiTarket: '',
      currLocation: '수신된 위치 정보가 없습니다',
      searEquipment: '',
      searSido: '',
      searGungu: '',
      searchedFirmList: null,
      page: 1,
      isListLoading: undefined,
      isLastList: false,
      validationMessage: '',
    };
  }

  componentDidMount() {
    this.setLocationInfo();
  }

  /**
   * 내주변/지역 검색 모드변경 함수
   */
  changeSearMode = (isLocalMode) => {
    const { isSearViewMode } = this.state;

    this.setState({
      isLocalSearch: isLocalMode, page: 1, isListLoading: undefined, searSido: '', searGungu: '',
    });

    if (isSearViewMode) {
      this.setSearchViewMode(false);
    }
  }

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

  /**
   * GPS 좌표을 활용한 주소설정
   */
  setLocAddress = (logitude, latitude) => {
    api.getAddrByGpspoint(logitude, latitude)
      .then((addrInfo) => {
        if (addrInfo) {
          if (addrInfo.code === -2) {
            this.setState({
              currLocation: addrInfo.msg,
            });
          } else {
            this.setState({
              currLocation: `현 위치 수신됨: ${addrInfo.document.road_address.address_name}`,
            });
          }
        }
      })
      .catch((error) => {
        Alert.alert(
          '현 위치 수신에 문제가 있습니다, 재 시도해 주세요.',
          `[${error.name}] ${error.message}`,
        );
      });
  }

  /**
   * 검색화면/광고화면 전환 함수
   */
  setSearchViewMode = (flag) => {
    const { isSearViewMode } = this.state;

    if (flag !== isSearViewMode) {
      this.setState({ isSearViewMode: flag });
    }
  };

  /**
   * 주변 장비업체 검색 요청함수
   */
  searchNearJangbee = () => {
    const { searchedFirmList, page, searEquipment, searLongitude, searLatitude } = this.state;

    if (!this.validateSearNearFirm()) {
      return;
    }

    this.setSearchViewMode(true);

    api
      .getNearFirmList(page, searEquipment, searLongitude, searLatitude)
      .then((res) => {
        this.setState({
          searchedFirmList: page === 1 ? res.content : [...searchedFirmList, ...res.content],
          isLastList: res.last,
          isListLoading: false,
          refreshing: false,
        });
      })
      .catch((error) => {
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
    const { page, searchedFirmList, searEquipment, searSido, searGungu } = this.state;

    if (!this.validateSearLocFirm()) {
      return;
    }

    this.setSearchViewMode(true);

    api
      .getLocalFirmList(page, searEquipment, searSido, searGungu)
      .then((res) => {
        this.setState({
          searchedFirmList: page === 1 ? res.content : [...searchedFirmList, ...res.content],
          isLastList: res.last,
          isListLoading: false,
          refreshing: false,
        });
      })
      .catch((error) => {
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
      this.setState({ validationMessage: '위치정보가 아직 수신되지 않았습니다, 조금만 기다려 주시거나 위치정보 새로고침을 눌러 주세요.' });
      return false;
    }

    v = validatePresence(searLatitude);
    if (!v[0]) {
      this.setState({ validationMessage: '위치정보가 아직 수신되지 않았습니다, 조금만 기다려 주시거나 위치정보 새로고침을 눌러 주세요.' });
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

    v = validatePresence(searGungu);
    if (!v[0]) {
      this.setState({ validationMessage: '검색할 지역(군구) 선택해 주세요' });
      return false;
    }

    return true;
  };

  /**
   * 장비업체리스트 새로고침 함수
   */
  handleRefresh = () => {
    this.setState(
      {
        page: 0,
        refreshing: true,
      },
      () => {
        this.searchNearJangbee();
      },
    );
  };

  /**
   * 장비업체리스트 페이징 추가 함수
   */
  handleLoadMore = () => {
    const { page } = this.state;

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
  }

  /**
   * 검색지역 설정 팝업창열기 함수
   */
  openSelLocModal = () => {
    const { searEquipment } = this.state;

    if (searEquipment === '') {
      Alert.alert('검색할 장비 먼저 선택해 주세요.');
      return;
    }
    this.setState({ isVisibleLocalModal: true })
  }

  render() {
    const {
      isSearViewMode,
      searEquipment,
      isLocalSearch,
      isVisibleEquiModal,
      isVisibleLocalModal,
      adEuqiTarket,
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
          isVisibleEquiModal={isVisibleLocalModal}
          closeModal={() => this.setState({ isVisibleLocalModal: false })}
          completeSelLocal={(sido, gungu) => this.setState({ searSido: sido, searGungu: gungu })}
          nextFocus={() => {}}
          selEquipment={searEquipment}
        />
        <View style={styles.adWrap}>
          <JangbeeAd adType={adType.main} euqiTarket={adEuqiTarket} {...this.props} />
        </View>
        {!isSearViewMode
          ? (
            <View style={styles.cardWrap}>
              <View style={styles.card}>
                <View style={styles.searEquiWrap}>
                  <SearCondBox
                    title="어떤 장비를 찾고 계신가요?"
                    searchCondition={searEquipment}
                    onPress={() => this.setState({ isVisibleEquiModal: true })}
                    defaultCondtion="장비 선택"
                  />

                  {isLocalSearch ? (
                    <SearCondBox
                      title="부르고자 하는 장비의 지역은 어디 입니까?"
                      searchCondition={`${searSido}${searGungu}`}
                      defaultCondtion="지역 선택"
                      onPress={() => this.openSelLocModal()}
                    />
                  ) : null}
                </View>
                <View style={styles.commWrap}>
                  {!isLocalSearch ? (
                    <View style={styles.gpsWrap}>
                      <Text style={styles.currLocText}>{currLocation}</Text>
                      <JBIcon name="refresh" size={24} color={colors.point2} onPress={() => this.setLocationInfo()} />
                    </View>
                  ) : null}
                  <View style={styles.switchWrap}>
                    <Text style={styles.switchText}>내 주변 검색</Text>
                    <Switch
                      value={isLocalSearch}
                      onValueChange={newValue => this.changeSearMode(newValue)}
                    />
                    <Text style={styles.switchText}>지역 검색</Text>
                  </View>
                  <FirmCreaErrMSG errorMSG={validationMessage} />
                  {isLocalSearch ? (
                    <JBButton title="지역 검색" onPress={() => this.searchLocJangbee()} size="full" />
                  ) : (
                    <JBButton
                      title="내 주변 검색"
                      onPress={() => this.searchNearJangbee()}
                      size="full"
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
                onPress={() => this.setState({ isSearViewMode: false })}
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
          )
        }
      </View>
    );
  }
}
