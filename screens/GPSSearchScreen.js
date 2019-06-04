import React from 'react';
import {
  Alert, BackHandler, ScrollView, StyleSheet, Text, Dimensions, View,
} from 'react-native';
import { SceneMap, TabView, TabBar } from 'react-native-tab-view';
import { Location, Permissions } from 'expo';
import Styled from 'styled-components/native';
import JBButton from '../components/molecules/JBButton';
import JBTerm from '../components/JBTerm';
import JangbeeAdList from '../components/JangbeeAdList';
import Card from '../components/molecules/CardUI';
import colors from '../constants/Colors';
import fonts from '../constants/Fonts';
import adLocation from '../constants/AdLocation';
import * as api from '../api/api';
import FirmSearList from '../components/organisms/FirmSearList';
import JBIcon from '../components/molecules/JBIcon';
import { validatePresence } from '../utils/Validation';
import FirmCreaErrMSG from '../components/organisms/JBErrorMessage';
import JBActIndicator from '../components/organisms/JBActIndicator';
import JBSelectBox from '../components/organisms/JBSelectBox';

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
    marginBottom: 5,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.pointDark,
    borderStyle: 'dashed',
    borderRadius: 5,
  },
  searOptionWrap: {
    height: 250,
    alignItems: 'center',
    padding: 10,
  },
  searModeWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    margin: 5,
  },
  optionTabWrap: {
    marginTop: 15,
    height: 250,
    width: '100%',
  },
  tabBar: {
    height: 40,
    backgroundColor: colors.batangDark,
  },
  commWrap: {
    marginTop: 20,
    height: 80,
    paddingTop: 3,
    paddingBottom: 3,
  },
  gpsWrap: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    borderWidth: 1,
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

const SearchModeTO = Styled.TouchableOpacity`
    padding: 5px;
`;

const SearchModeText = Styled.Text`
    ${props => props.active &&`
      color: ${colors.pointDark}
    `}
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
   * Tab View 변경함수
   */
  changeTabView = (index) => {
    const { matchedWorkList } = this.state;

    if (index === 1 && matchedWorkList === undefined) {
    }

    this.setState({ index });
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
      <ScrollView style={styles.container}>
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
          <Card>
            <View style={styles.searOptionWrap}>
              <View style={styles.searModeWrap}>
                <SearchModeTO onPress={() => this.changeSearMode(false)} >
                  <SearchModeText active={!isLocalSearch}>내 주변 장비검색</SearchModeText>
                </SearchModeTO>
                <Text>|</Text>
                <SearchModeTO onPress={() => this.changeSearMode(true)}>
                  <SearchModeText active={isLocalSearch}>지역 장비검색</SearchModeText>
                </SearchModeTO>
              </View>
              <JBSelectBox categoryList={EQUIPMENT_CATEGORY} itemList={EQUIPMENT_ITEM} />
              <View style={styles.optionTabWrap}>
                {isLocalSearch ? (<JBSelectBox categoryList={LOCAL_CATEGORY} itemList={LOCAL_ITEM} />) : (<View style={styles.gpsWrap}>
                  <Text style={styles.currLocText}>{currLocation}</Text>
                  <JBIcon
                    name="refresh"
                    size={24}
                    color={colors.point2}
                    onPress={() => this.setLocationInfo()}
                  />
                </View>)}
              </View>
            </View>
            <View style={styles.commWrap}>
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
                  title="내 주변 검색하기"
                  onPress={() => this.searchNearJangbee()}
                  size="full"
                  bgColor={colors.point2}
                  color="white"
                />
              )}
            </View>
          </Card>
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
        <JBTerm />
      </ScrollView>
    );
  }
}

const EQUIPMENT_CATEGORY = ['크레인', '카고크레인', '굴착기', '스카이', '지게차'];

const EQUIPMENT_ITEM = [];
EQUIPMENT_ITEM['크레인'] = ['10톤', '13톤', '25톤', '50톤', '100톤', '160톤', '200톤', '250톤', '300톤', '400톤', '500톤', '700톤', '800톤', '1200톤'];
EQUIPMENT_ITEM['카고크레인'] = ['5톤', '11톤', '18톤', '25톤'];
EQUIPMENT_ITEM['굴착기'] = ['02W', '06W', '08W', '02LC', '04LC', '06LC'];
EQUIPMENT_ITEM['스카이'] = ['1톤', '1.2톤', '2톤', '2.5톤', '3.5톤', '5톤', '28m', '45m', '58m', '60m', '75m'];
EQUIPMENT_ITEM['지게차'] = ['2톤', '2.5톤', '3톤', '4.5톤', '5톤', '6톤', '7톤', '8톤', '11.5톤', '15톤', '18톤', '25톤'];

const LOCAL_CATEGORY = ['서울', '경기', '강원', '세종', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];
const LOCAL_ITEM = [];
LOCAL_ITEM['서울'] = ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중량구'];
LOCAL_ITEM['경기'] = ['가평군', '고양시', '과천시', '광명시', '광주구', '구리시', '군포시', '김포시', '남양주시', '동두천시', '부천시', '성남시', '수원시', '시흥시', '안산시', '안성시', '안양시', '양주시', '양평군', '여주시', '연천군', '오산시', '용인시', '의왕시', '의정부시', '이천시', '파주시', '평택시', '포천시', '하남시', '화성시'];

const EQUIPMENT_CONTENT = [
  {
    isExpanded: false,
    isChecked: false,
    category_name: '크레인',
    willUpdate: false,
    subcategory: [
      { isChecked: false, val: '10톤' },
      { isChecked: false, val: '13톤' },
      { isChecked: false, val: '25톤' },
      { isChecked: false, val: '50톤' },
      { isChecked: false, val: '100톤' },
      { isChecked: false, val: '160톤' },
      { isChecked: false, val: '200톤' },
      { isChecked: false, val: '250톤' },
      { isChecked: false, val: '300톤' },
      { isChecked: false, val: '400톤' },
      { isChecked: false, val: '500톤' },
      { isChecked: false, val: '700톤' },
      { isChecked: false, val: '800톤' },
      { isChecked: false, val: '1200톤' },
    ],
  },
  {
    isExpanded: false,
    isChecked: false,
    category_name: '카고크레인',
    willUpdate: false,
    subcategory: [
      { isChecked: false, val: '5톤' },
      { isChecked: false, val: '11톤' },
      { isChecked: false, val: '18톤' },
      { isChecked: false, val: '25톤' },
    ],
  },
  {
    isExpanded: false,
    isChecked: false,
    category_name: '굴착기',
    willUpdate: false,
    subcategory: [
      { isChecked: false, val: '02W' },
      { isChecked: false, val: '06W' },
      { isChecked: false, val: '08W' },
      { isChecked: false, val: '02LC' },
      { isChecked: false, val: '04LC' },
      { isChecked: false, val: '06LC' },
    ],
  },
  {
    isExpanded: false,
    isChecked: false,
    category_name: '스카이',
    willUpdate: false,
    subcategory: [
      { isChecked: false, val: '1톤' },
      { isChecked: false, val: '1.2톤' },
      { isChecked: false, val: '2톤' },
      { isChecked: false, val: '2.5톤' },
      { isChecked: false, val: '3.5톤' },
      { isChecked: false, val: '5톤' },
      { isChecked: false, val: '28m' },
      { isChecked: false, val: '45m' },
      { isChecked: false, val: '58m' },
      { isChecked: false, val: '60m' },
      { isChecked: false, val: '75m' },
    ],
  },
  {
    isExpanded: false,
    isChecked: false,
    category_name: '지게차',
    willUpdate: false,
    subcategory: [
      { isChecked: false, val: '2톤' },
      { isChecked: false, val: '2.5톤' },
      { isChecked: false, val: '3톤' },
      { isChecked: false, val: '4.5톤' },
      { isChecked: false, val: '5톤' },
      { isChecked: false, val: '6톤' },
      { isChecked: false, val: '7톤' },
      { isChecked: false, val: '8톤' },
      { isChecked: false, val: '11.5톤' },
      { isChecked: false, val: '15톤' },
      { isChecked: false, val: '18톤' },
      { isChecked: false, val: '25톤' },
    ],
  },
  {
    isExpanded: false,
    isChecked: false,
    category_name: '사다리차',
    willUpdate: false,
    subcategory: [{ isChecked: false, val: '사다리차' }],
  },
  {
    isExpanded: false,
    isChecked: false,
    category_name: '하이랜더',
    willUpdate: false,
    subcategory: [{ isChecked: false, val: '하이랜더' }],
  },
  {
    isExpanded: false,
    isChecked: false,
    category_name: '고소작업렌탈',
    willUpdate: false,
    subcategory: [{ isChecked: false, val: '고소작업렌탈' }],
  },
  {
    isExpanded: false,
    isChecked: false,
    category_name: '펌프카',
    willUpdate: false,
    subcategory: [{ isChecked: false, val: '펌프카' }],
  },
  {
    isExpanded: false,
    isChecked: false,
    category_name: '도로포장장비',
    willUpdate: false,
    subcategory: [{ isChecked: false, val: '도로포장장비' }],
  },
  {
    isExpanded: false,
    isChecked: false,
    category_name: '로우더',
    willUpdate: false,
    subcategory: [{ isChecked: false, val: '로우더' }],
  },
  {
    isExpanded: false,
    isChecked: false,
    category_name: '항타천공오가',
    willUpdate: false,
    subcategory: [{ isChecked: false, val: '항타천공오가' }],
  },
  {
    isExpanded: false,
    isChecked: false,
    category_name: '불도저',
    willUpdate: false,
    subcategory: [{ isChecked: false, val: '불도저' }],
  },
  {
    isExpanded: false,
    isChecked: false,
    category_name: '진동로라/발전기',
    willUpdate: false,
    subcategory: [{ isChecked: false, val: '진동로라/발전기' }],
  },
  {
    isExpanded: false,
    isChecked: false,
    category_name: '덤프임대',
    willUpdate: false,
    subcategory: [{ isChecked: false, val: '덤프임대' }],
  },
  {
    isExpanded: false,
    isChecked: false,
    category_name: '거미크레인',
    willUpdate: false,
    subcategory: [{ isChecked: false, val: '2톤' }, { isChecked: false, val: '3톤' }],
  },
];

