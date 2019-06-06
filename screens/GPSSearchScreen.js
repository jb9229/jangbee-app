import React from 'react';
import {
  Alert, BackHandler, Dimensions, Picker, ScrollView, StyleSheet, Text, View,
} from 'react-native';
import { Location, Permissions } from 'expo';
import styled from 'styled-components/native';
import JBButton from '../components/molecules/JBButton';
import JBTerm from '../components/JBTerm';
import JangbeeAdList from '../components/JangbeeAdList';
import Card from '../components/molecules/CardUI';
import JBPicker from '../components/molecules/JBPicker';
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
import {LineChart} from 'react-native-chart-kit'

const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientTo: '#08130D',
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2 // optional, default 3
}

const screenWidth = Dimensions.get('window').width;

const sidoEquiPickerItems = ['크레인', '카고크레인', '굴착기', '스카이']
.map(lin => <Picker.Item key={lin} label={`${lin}`} value={lin} />);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.batangLight,
  },
  adWrap: {
    paddingBottom: 10,
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
  searOptionWrap: {
    height: 250,
    padding: 10,
  },
  searModeWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    margin: 5,
  },
  optionWrap: {
    justifyContent: 'center',
    marginTop: 15,
    height: 110,
  },
  commWrap: {
    marginTop: 20,
    height: 80,
    paddingTop: 3,
    paddingBottom: 3,
  },
  gpsWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  currLocText: {
    color: colors.point2,
    fontFamily: fonts.batang,
    fontSize: 12,
  },
  firmListWrap: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    marginLeft: 5,
    marginRight: 5,
  },
});

const SearchModeTO = styled.TouchableOpacity`
    padding: 5px;
`;

const SearchModeText = styled.Text`
    ${props => props.active &&`
      color: ${colors.pointDark}
    `}
`;

const ChartWrap = styled.View``;

const ChartTopWrap = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ChartTitle = styled.Text``;

const ChartLegendListWrap = styled.View`
  flex-direction: row;
  margin-bottom: 3;
`;

const ChartLegend = styled.View`
  padding: 5px;
  ${props => props.color &&`
    background-color: ${props.color};
    border-color: ${props.color};
    border-radius: 30;
  `}
`;

const ChartLegendTitle = styled.Text``;

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
      isSearchViewMode: true,
      isLocalSearch: false,
      currLocation: '수신된 위치 정보가 없습니다',
      searEquipment: '크레인',
      searEquiModel: '10톤',
      searSido: '서울',
      searGungu: '강남구',
      searchedFirmList: null,
      page: 0,
      refreshing: false,
      isListLoading: undefined,
      isLastList: false,
      chartSidoEquipment: '크레인',
      validationMessage: ', ',
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
      searSido: '서울',
      searGungu: '강남구',
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
      searchedFirmList, page, searEquipment, searEquiModel, searLongitude, searLatitude,
    } = this.state;

    if (!this.validateSearNearFirm()) {
      return;
    }

    this.setSearchViewMode(false);

    const searchStr = `${searEquiModel} ${searEquipment}`;

    api
      .getNearFirmList(page, searchStr, searLongitude, searLatitude)
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
      page, searchedFirmList, searEquipment, searEquiModel, searSido, searGungu,
    } = this.state;

    if (!this.validateSearLocFirm()) {
      return;
    }

    this.setSearchViewMode(false);

    const searchStr = `${searEquiModel} ${searEquipment}`;

    api
      .getLocalFirmList(page, searchStr, searSido, searGungu)
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
    const { searEquipment, searEquiModel, searLongitude, searLatitude } = this.state;

    this.setState({ validationMessage: ', ' });

    let v = validatePresence(searEquipment);
    if (!v[0]) {
      this.setState({ validationMessage: '검색할 장비명을 선택해 주세요' });
      return false;
    }

    v = validatePresence(searEquiModel);
    if (!v[0]) {
      this.setState({ validationMessage: '검색할 장비명 모델을 선택해 주세요' });
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
    const { searEquipment, searEquiModel, searSido, searGungu } = this.state;

    this.setState({ validationMessage: ', ' });

    let v = validatePresence(searEquipment);
    if (!v[0]) {
      this.setState({ validationMessage: '검색할 장비명을 선택해 주세요' });
      return false;
    }

    v = validatePresence(searEquiModel);
    if (!v[0]) {
      this.setState({ validationMessage: '검색할 장비모델을 선택해 주세요' });
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
    const { searEquipment, searEquiModel } = this.state;

    if (!searEquipment || !searEquiModel) {
      Alert.alert('검색할 장비 먼저 선택해 주세요.');
    }
  };

  render() {
    const { navigation } = this.props;
    const {
      isComponentMountComplete,
      isSearchViewMode,
      isLocalSearch,
      searEquipment,
      searEquiModel,
      currLocation,
      searSido,
      searGungu,
      searchedFirmList,
      page,
      refreshing,
      isLastList,
      isListLoading,
      chartSidoEquipment,
      validationMessage,
    } = this.state;

    if (!isComponentMountComplete) {
      return <JBActIndicator title="위치정보 불러오는중..." size={35} />;
    }

    let searchLocalCondition = ', ';

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
              <JBSelectBox
                title="장비선택"
                categoryList={EQUIPMENT_CATEGORY}
                itemList={EQUIPMENT_ITEM}
                selectedCat={searEquipment}
                selectedItem={searEquiModel}
                selectCategory={(equi) => this.setState({searEquipment: equi})}
                selectItem={(item) => this.setState({searEquiModel: item})}
              />

              <View style={styles.optionWrap}>
                {isLocalSearch ?
                  (
                    <JBSelectBox
                      title="지역선택"
                      categoryList={LOCAL_CATEGORY}
                      itemList={LOCAL_ITEM}
                      selectedCat={searSido}
                      selectedItem={searGungu}
                      selectCategory={(sido) => {this.setState({searSido: sido})}}
                      selectItem={(sigungu) => this.setState({searGungu: sigungu})}
                    />
                  ) : (
                    <View style={styles.gpsWrap}>
                      <Text style={styles.currLocText}>{currLocation}</Text>
                      <JBIcon
                        name="refresh"
                        size={24}
                        color={colors.point2}
                        onPress={() => this.setLocationInfo()}
                      />
                    </View>
                  )}
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
        <ChartWrap>
          <ChartTopWrap>
            <ChartTitle>주요장비 지역가입 현황</ChartTitle>
            <JBPicker
              selectedValue={chartSidoEquipment}
              items={sidoEquiPickerItems}
              onValueChange={(equipment) => this.setState({chartSidoEquipment: equipment})}
              size={140} />
          </ChartTopWrap>
          <ChartLegendListWrap>
            <ChartLegend color="red" >
              <ChartLegendTitle>5톤</ChartLegendTitle>
            </ChartLegend>
            <ChartLegend color="blue">
              <ChartLegendTitle>10톤</ChartLegendTitle>
            </ChartLegend>
          </ChartLegendListWrap>
          <LineChart
            data={data}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
          />
        </ChartWrap>
        <JBTerm />
      </ScrollView>
    );
  }
}

const data = {
  labels: ['서울', '부산', '인천', '세종', '대전', '광주', '대구'],
  datasets: [{
    data: [ 50, 65, 78, 90, 100, 30 ],
    color: (opacity = 1) => `rgba(134, 165, 244, ${opacity})`, // optional
    strokeWidth: 2, // optional
  },
  {
    data: [ 20, 45, 28, 80, 99, 43 ],
    color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
    strokeWidth: 2, // optional
  }]
}

const EQUIPMENT_CATEGORY = ['크레인', '카고크레인', '굴착기', '스카이', '지게차'];

const EQUIPMENT_ITEM = [];
EQUIPMENT_ITEM['크레인'] = ['10톤', '13톤', '25톤', '50톤', '100톤', '160톤', '200톤', '250톤', '300톤', '400톤', '500톤', '700톤', '800톤', '1200톤'];
EQUIPMENT_ITEM['카고크레인'] = ['5톤', '11톤', '18톤', '25톤'];
EQUIPMENT_ITEM['굴착기'] = ['02W', '06W', '08W', '02LC', '04LC', '06LC'];
EQUIPMENT_ITEM['스카이'] = ['1톤', '1.2톤', '2톤', '2.5톤', '3.5톤', '5톤', '28m', '45m', '58m', '60m', '75m'];
EQUIPMENT_ITEM['지게차'] = ['2톤', '2.5톤', '3톤', '4.5톤', '5톤', '6톤', '7톤', '8톤', '11.5톤', '15톤', '18톤', '25톤'];
EQUIPMENT_ITEM['사다리차'] = ['사다리차'];
EQUIPMENT_ITEM['하이랜더'] = ['하이랜더'];
EQUIPMENT_ITEM['고소작업렌탈'] = ['고소작업렌탈'];
EQUIPMENT_ITEM['펌프카'] = ['펌프카'];
EQUIPMENT_ITEM['도로포장장비'] = ['도로포장장비'];
EQUIPMENT_ITEM['로우더'] = ['로우더'];
EQUIPMENT_ITEM['항타천공오가'] = ['항타천공오가'];
EQUIPMENT_ITEM['불도저'] = ['불도저'];
EQUIPMENT_ITEM['진동로라/발전기'] = ['진동로라/발전기'];
EQUIPMENT_ITEM['덤프임대'] = ['덤프임대'];
EQUIPMENT_ITEM['거미크레인'] = ['2톤', '3톤'];

const LOCAL_CATEGORY = ['서울', '부산', '경기', '인천', '세종', '대전', '광주', '대구', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];
const LOCAL_ITEM = [];
LOCAL_ITEM['서울'] = ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중량구'];
LOCAL_ITEM['부산'] = ['강서구', '금정구', '기장구', '남구', '동구', '동래구', '부산진구', '북구', '사상구', '서구', '수영구', '연제구', '영도구', '중구', '해운대구'];
LOCAL_ITEM['경기'] = ['가평군', '고양시', '과천시', '광명시', '광주구', '구리시', '군포시', '김포시', '남양주시', '동두천시', '부천시', '성남시', '수원시', '시흥시', '안산시', '안성시', '안양시', '양주시', '양평군', '여주시', '연천군', '오산시', '용인시', '의왕시', '의정부시', '이천시', '파주시', '평택시', '포천시', '하남시', '화성시'];
LOCAL_ITEM['인천'] = ['강화군', '계양군', '남동구', '동구', '미추홀구', '부평구', '서구', '연수구', '옹진군', '중구'];
LOCAL_ITEM['세종'] = ['가람동', '고운동', '금남면', '나성동', '다정동', '대평동', '도담동', '반곡동', '보람동', '부강면', '새롬동', '소담동', '소정면', '아름동', '어진동', '연기면', '연동면', '연서면', '장군면', '전동면', '전의면', '조치원읍', '종촌동', '한솔동'];
LOCAL_ITEM['대전'] = ['대덕구', '동구', '서구', '유성구', '중구'];
LOCAL_ITEM['광주'] = ['광산구', '남구', '동구', '북구', '서구'];
LOCAL_ITEM['대구'] = ['남구', '달서구', '달성군', '동구', '북구', '서구', '수성구', '중구'];
LOCAL_ITEM['강원'] = ['강릉시', '고성군', '동해시', '삼척시', '속초시', '양구군', '양양군', '영월군', '원주시', '인제군', '정선군', '철원군', '춘천시', '태백시', '평창군', '홍천군', '화천군', '횡성군'];
LOCAL_ITEM['충북'] = ['괴산군', '단양군', '보은군', '영동군', '옥천군', '음성군', '제천군', '증평군', '진천군', '청주시', '충주시'];
LOCAL_ITEM['충남'] = ['계룡시', '공주시', '금산군', '논산시', '당진시', '보령시', '부여군', '서산시', '서천군', '아산시', '예산군', '천안시', '청양군', '태안군', '홍성군'];
LOCAL_ITEM['전북'] = ['고창군', '군산시', '김제시', '남원시', '무주군', '부안군', '순창군', '완주군', '익산시', '임실군', '장수군', '전주시', '정읍시', '진안군'];
LOCAL_ITEM['전남'] = ['강진군', '고흥군', '곡성군', '광양시', '구례군', '나주시', '담양군', '목포시', '무안군', '보성군', '순천시', '신안군', '여수시', '영광군', '영암군', '완도군', '장성군', '장흥군', '진도군', '함평군', '해남군', '화순군'];
LOCAL_ITEM['경북'] = ['경산시', '경주시', '고령군', '구미시', '군위군', '김천시', '문경시', '봉화군', '상주시', '성주군', '안동시', '영덕군', '영양군', '영주시', '영천시', '예천군', '울릉군'];
LOCAL_ITEM['경남'] = ['거제시', '거창군', '고성군', '김해시', '남해군', '밀양시', '사천시', '산청군', '양산시', '의령군', '진주시', '창녕군', '창원시', '통영시', '하동군', '함안군', '함양군', '합천군'];
LOCAL_ITEM['제주'] = ['서귀포시', '제주시'];