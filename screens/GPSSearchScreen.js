import React from 'react';
import {
  Alert, BackHandler, Switch, StyleSheet, Picker, Text, View,
} from 'react-native';
import { Location, Permissions } from 'expo';
import styled from 'styled-components/native';
import JBButton from '../components/molecules/JBButton';
import Card from '../components/molecules/CardUI';
import colors from '../constants/Colors';
import fonts from '../constants/Fonts';
import * as api from '../api/api';
import JBIcon from '../components/molecules/JBIcon';
import { validatePresence } from '../utils/Validation';
import FirmCreaErrMSG from '../components/organisms/JBErrorMessage';
import JBActIndicator from '../components/organisms/JBActIndicator';
import JBSelectBox from '../components/organisms/JBSelectBox';
import FirmSearListModal from '../components/FirmSearListModal';

const styles = StyleSheet.create({
  adWrap: {
    paddingBottom: 2,
  },
  searOptionWrap: {
    height: 285,
    paddingLeft: 8,
    paddingRight: 8,
  },
  searModeWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.pointDark,
    borderStyle: 'dashed',
    borderRadius: 10,
  },
  searchModeSwitch: {
    transform: [{ scaleX: 1.8 }, { scaleY: 1.5 }],
    marginLeft: 40,
    marginRight: 30,
  },
  optionWrap: {
    justifyContent: 'center',
    marginTop: 10,
    height: 100,
  },
  commWrap: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 100,
  },
  gpsWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  currLocText: {
    color: colors.pointDark,
    fontFamily: fonts.batang,
    fontSize: 12,
  },
});

const Container = styled.View`
`;

const SearchModeTO = styled.TouchableOpacity`
`;

const SwitchText = styled.Text`
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

const SearSummaryWrap = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const SearSummary = styled.Text`
  font-family: ${fonts.title};
  padding-top: 5;
  padding-bottom: 5;
  margin-right: 3;
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
      isVisibleSearResultModal: false,
      isComponentMountComplete: false,
      isSearchViewMode: true,
      isLocalSearch: false,
      currLocation: '수신된 위치 정보가 없습니다',
      searEquipment: '크레인',
      searEquiModel: '10톤',
      searSido: '서울',
      searGungu: '전체',
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
      searSido: '서울',
      searGungu: '전체',
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
              currLocation: `현 위치: ${addressName}`,
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
   * 지역장비 검색 유효성 검사 함수
   */
  validateSearNearFirm = () => {
    const { searEquipment, searEquiModel, searLongitude, searLatitude } = this.state;

    this.setState({ validationMessage: '' });

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

    this.setState({isVisibleSearResultModal: true});
  };

  /**
   * 지역장비 검색 유효성 검사 함수
   */
  validateSearLocFirm = () => {
    const { searEquipment, searEquiModel, searSido, searGungu } = this.state;

    this.setState({ validationMessage: '' });

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

    this.setState({isVisibleSearResultModal: true})
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

  render() {
    const { navigation } = this.props;
    const {
      isVisibleSearResultModal,
      isComponentMountComplete,
      isSearchViewMode,
      isLocalSearch,
      searEquipment,
      searEquiModel,
      currLocation,
      searSido,
      searGungu,
      firmCntChartModels,
      validationMessage,
      searLongitude,
      searLatitude,
    } = this.state;

    if (!isComponentMountComplete) {
      return <JBActIndicator title="위치정보 불러오는중..." size={35} />;
    }

    return (
      <Container>
        <Card>
          <View style={styles.searOptionWrap}>
            <View style={styles.searModeWrap}>
              <SearchModeTO onPress={() => this.changeSearMode(false)}>
                <SwitchText select={isLocalSearch}>주변 검색</SwitchText>
              </SearchModeTO>
              <Switch
                value={isLocalSearch}
                onValueChange={newValue => this.changeSearMode(newValue)}
                thumbColor={colors.point2}
                style={styles.searchModeSwitch}
                trackColor={{ false: colors.batang, true: colors.batang }}
              />
              <SearchModeTO onPress={() => this.changeSearMode(true)}>
                <SwitchText select={!isLocalSearch}>지역 검색</SwitchText>
              </SearchModeTO>
            </View>
            <SearSummaryWrap>
              <SearSummary>[</SearSummary>
              <SearSummary>{isLocalSearch ? '지역검색: ' : '주변검색: '}</SearSummary>
              <SearSummary>{searEquiModel}</SearSummary>
              <SearSummary>{searEquipment}</SearSummary>
              {isLocalSearch && (
                <SearSummaryWrap>
                  <SearSummary>,</SearSummary>
                  <SearSummary>{searSido}</SearSummary>
                  <SearSummary>{searGungu}</SearSummary>
                </SearSummaryWrap>
              )}
              <SearSummary>]</SearSummary>
            </SearSummaryWrap>
            <JBSelectBox
              categoryList={EQUIPMENT_CATEGORY}
              itemList={EQUIPMENT_ITEM}
              selectedCat={searEquipment}
              selectedItem={searEquiModel}
              selectCategory={equi => this.setState({ searEquipment: equi, searEquiModel: '' })}
              selectItem={(equi, model) => this.setState({ searEquipment: equi, searEquiModel: model })}
              cateImageArr={EQUIPMENT_IMAGES}
            />

            <View style={styles.optionWrap}>
              {isLocalSearch ?
                (
                  <JBSelectBox
                    categoryList={LOCAL_CATEGORY}
                    itemList={LOCAL_ITEM}
                    selectedCat={searSido}
                    selectedItem={searGungu}
                    selectCategory={sido => this.setState({ searSido: sido })}
                    selectItem={(sido, sigungu) => this.setState({ searSido: sido, searGungu: sigungu })}
                    itemPicker="전체"
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
                onPress={() => this.validateSearLocFirm()}
                size="full"
                bgColor={colors.point2}
                color="white"
              />
            ) : (
              <JBButton
                title="내 주변 검색하기"
                onPress={() => this.validateSearNearFirm()}
                size="full"
                bgColor={colors.point2}
                color="white"
              />
            )}
          </View>
        </Card>
        <FirmSearListModal
          isVisibleModal={isVisibleSearResultModal}
          closeModal={() => this.setState({isVisibleSearResultModal: false})}
          searEquipment={searEquipment}
          searEquiModel={searEquiModel}
          searLongitude={searLongitude}
          searLatitude={searLatitude}
          isLocalSearch={isLocalSearch}
          size="full"
          navigation={navigation}
        />
      </Container>
    );
  }
}

const EQUIPMENT_IMAGES = [require('../assets/images/equipment/crain.png'), require('../assets/images/equipment/cago_crain.png'), require('../assets/images/equipment/excavator.jpg'), require('../assets/images/equipment/sky.jpg'), require('../assets/images/crain.png'), require('../assets/images/crain.png'), require('../assets/images/crain.png'), require('../assets/images/crain.png'), require('../assets/images/crain.png'), require('../assets/images/crain.png'), require('../assets/images/crain.png'), require('../assets/images/crain.png'), require('../assets/images/crain.png'), require('../assets/images/crain.png'), require('../assets/images/crain.png')]

const EQUIPMENT_CATEGORY = ['크레인', '카고크레인', '굴착기', '스카이', '지게차', '사다리차', '하이랜더', '고소작업렌탈', '펌프카', '도로포장장비', '로우더', '항타천공오가', '불도저', '진동로라/발전기', '덤프임대', '거미크레인'];

const EQUIPMENT_ITEM = [];
EQUIPMENT_ITEM['크레인'] = ['10톤', '13톤', '25톤', '50톤', '100톤', '160톤', '200톤', '250톤', '300톤', '400톤', '500톤', '700톤', '800톤', '1200톤'].map(lin => (<Picker.Item key={lin} label={`${lin}`} value={lin} />));
EQUIPMENT_ITEM['카고크레인'] = ['5톤', '11톤', '18톤', '25톤'].map(lin => (<Picker.Item key={lin} label={`${lin}`} value={lin} />));
EQUIPMENT_ITEM['굴착기'] = ['02W', '06W', '08W', '02LC', '04LC', '06LC'].map(lin => (<Picker.Item key={lin} label={`${lin}`} value={lin} />));
EQUIPMENT_ITEM['스카이'] = ['1톤', '1.2톤', '2톤', '2.5톤', '3.5톤', '5톤', '28m', '45m', '58m', '60m', '75m'].map(lin => (<Picker.Item key={lin} label={`${lin}`} value={lin} />));
EQUIPMENT_ITEM['지게차'] = ['2톤', '2.5톤', '3톤', '4.5톤', '5톤', '6톤', '7톤', '8톤', '11.5톤', '15톤', '18톤', '25톤'].map(lin => (<Picker.Item key={lin} label={`${lin}`} value={lin} />));
EQUIPMENT_ITEM['사다리차'] = ['사다리차'].map(lin => (<Picker.Item key={lin} label={`${lin}`} value={lin} />));
EQUIPMENT_ITEM['하이랜더'] = ['하이랜더'].map(lin => (<Picker.Item key={lin} label={`${lin}`} value={lin} />));
EQUIPMENT_ITEM['고소작업렌탈'] = ['고소작업렌탈'].map(lin => (<Picker.Item key={lin} label={`${lin}`} value={lin} />));
EQUIPMENT_ITEM['펌프카'] = ['펌프카'].map(lin => (<Picker.Item key={lin} label={`${lin}`} value={lin} />));
EQUIPMENT_ITEM['도로포장장비'] = ['도로포장장비'].map(lin => (<Picker.Item key={lin} label={`${lin}`} value={lin} />));
EQUIPMENT_ITEM['로우더'] = ['로우더'].map(lin => (<Picker.Item key={lin} label={`${lin}`} value={lin} />));
EQUIPMENT_ITEM['항타천공오가'] = ['항타천공오가'].map(lin => (<Picker.Item key={lin} label={`${lin}`} value={lin} />));
EQUIPMENT_ITEM['불도저'] = ['불도저'].map(lin => (<Picker.Item key={lin} label={`${lin}`} value={lin} />));
EQUIPMENT_ITEM['진동로라/발전기'] = ['진동로라/발전기'].map(lin => (<Picker.Item key={lin} label={`${lin}`} value={lin} />));
EQUIPMENT_ITEM['덤프임대'] = ['덤프임대'].map(lin => (<Picker.Item key={lin} label={`${lin}`} value={lin} />));
EQUIPMENT_ITEM['거미크레인'] = ['2톤', '3톤'].map(lin => (<Picker.Item key={lin} label={`${lin}`} value={lin} />));

const LOCAL_CATEGORY = ['서울', '부산', '경기', '인천', '세종', '대전', '광주', '대구', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];
const LOCAL_ITEM = [];
LOCAL_ITEM['서울'] = ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중량구'].map(lin => (<Picker.Item key={lin} label={`${lin}`} value={lin} />));
LOCAL_ITEM['부산'] = ['강서구', '금정구', '기장구', '남구', '동구', '동래구', '부산진구', '북구', '사상구', '서구', '수영구', '연제구', '영도구', '중구', '해운대구'].map(lin => (<Picker.Item key={lin} label={`${lin}`} value={lin} />));
LOCAL_ITEM['경기'] = ['가평군', '고양시', '과천시', '광명시', '광주시', '구리시', '군포시', '김포시', '남양주시', '동두천시', '부천시', '성남시', '수원시', '시흥시', '안산시', '안성시', '안양시', '양주시', '양평군', '여주시', '연천군', '오산시', '용인시', '의왕시', '의정부시', '이천시', '파주시', '평택시', '포천시', '하남시', '화성시'].map(lin => (<Picker.Item key={lin} label={`${lin}`} value={lin} />));
LOCAL_ITEM['인천'] = ['강화군', '계양군', '남동구', '동구', '미추홀구', '부평구', '서구', '연수구', '옹진군', '중구'].map(lin => (<Picker.Item key={lin} label={`${lin}`} value={lin} />));
LOCAL_ITEM['세종'] = ['가람동', '고운동', '금남면', '나성동', '다정동', '대평동', '도담동', '반곡동', '보람동', '부강면', '새롬동', '소담동', '소정면', '아름동', '어진동', '연기면', '연동면', '연서면', '장군면', '전동면', '전의면', '조치원읍', '종촌동', '한솔동'].map(lin => (<Picker.Item key={lin} label={`${lin}`} value={lin} />));
LOCAL_ITEM['대전'] = ['대덕구', '동구', '서구', '유성구', '중구'].map(lin => (<Picker.Item key={lin} label={`${lin}`} value={lin} />));
LOCAL_ITEM['광주'] = ['광산구', '남구', '동구', '북구', '서구'].map(lin => (<Picker.Item key={lin} label={`${lin}`} value={lin} />));
LOCAL_ITEM['대구'] = ['남구', '달서구', '달성군', '동구', '북구', '서구', '수성구', '중구'].map(lin => (<Picker.Item key={lin} label={`${lin}`} value={lin} />));
LOCAL_ITEM['강원'] = ['강릉시', '고성군', '동해시', '삼척시', '속초시', '양구군', '양양군', '영월군', '원주시', '인제군', '정선군', '철원군', '춘천시', '태백시', '평창군', '홍천군', '화천군', '횡성군'].map(lin => (<Picker.Item key={lin} label={`${lin}`} value={lin} />));
LOCAL_ITEM['충북'] = ['괴산군', '단양군', '보은군', '영동군', '옥천군', '음성군', '제천군', '증평군', '진천군', '청주시', '충주시'].map(lin => (<Picker.Item key={lin} label={`${lin}`} value={lin} />));
LOCAL_ITEM['충남'] = ['계룡시', '공주시', '금산군', '논산시', '당진시', '보령시', '부여군', '서산시', '서천군', '아산시', '예산군', '천안시', '청양군', '태안군', '홍성군'].map(lin => (<Picker.Item key={lin} label={`${lin}`} value={lin} />));
LOCAL_ITEM['전북'] = ['고창군', '군산시', '김제시', '남원시', '무주군', '부안군', '순창군', '완주군', '익산시', '임실군', '장수군', '전주시', '정읍시', '진안군'].map(lin => (<Picker.Item key={lin} label={`${lin}`} value={lin} />));
LOCAL_ITEM['전남'] = ['강진군', '고흥군', '곡성군', '광양시', '구례군', '나주시', '담양군', '목포시', '무안군', '보성군', '순천시', '신안군', '여수시', '영광군', '영암군', '완도군', '장성군', '장흥군', '진도군', '함평군', '해남군', '화순군'].map(lin => (<Picker.Item key={lin} label={`${lin}`} value={lin} />));
LOCAL_ITEM['경북'] = ['경산시', '경주시', '고령군', '구미시', '군위군', '김천시', '문경시', '봉화군', '상주시', '성주군', '안동시', '영덕군', '영양군', '영주시', '영천시', '예천군', '울릉군'].map(lin => (<Picker.Item key={lin} label={`${lin}`} value={lin} />));
LOCAL_ITEM['경남'] = ['거제시', '거창군', '고성군', '김해시', '남해군', '밀양시', '사천시', '산청군', '양산시', '의령군', '진주시', '창녕군', '창원시', '통영시', '하동군', '함안군', '함양군', '합천군'].map(lin => (<Picker.Item key={lin} label={`${lin}`} value={lin} />));
LOCAL_ITEM['제주'] = ['서귀포시', '제주시'].map(lin => (<Picker.Item key={lin} label={`${lin}`} value={lin} />));