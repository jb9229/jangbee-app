import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as api from 'api/api';

import {
  Alert,
  BackHandler,
  StyleSheet,
  Switch,
  Text,
  ToastAndroid,
  View
} from 'react-native';
import { LOCAL_CATEGORY, LOCAL_ITEM } from 'src/STRING';

import Card from 'molecules/CardUI';
import FirmCreaErrMSG from 'organisms/JBErrorMessage';
import FirmSearListModal from 'templates/FirmSearListModal';
import JBActIndicator from 'molecules/JBActIndicator';
import JBButton from 'molecules/JBButton';
import JBIcon from 'atoms/JBIcon';
import JBSelectBox from 'organisms/JBSelectBox';
import { PickerItem } from 'src/types';
import React from 'react';
import colors from 'constants/Colors';
import fonts from 'constants/Fonts';
import styled from 'styled-components/native';
import { validatePresence } from 'utils/Validation';

const styles = StyleSheet.create({
  adWrap: {
    paddingBottom: 2
  },
  searOptionWrap: {
    paddingLeft: 8,
    paddingRight: 8
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
    borderRadius: 10
  },
  searchModeSwitch: {
    transform: [{ scaleX: 1.8 }, { scaleY: 1.5 }],
    marginLeft: 40,
    marginRight: 30
  },
  optionWrap: {
    justifyContent: 'center',
    marginTop: 10,
    height: 100
  },
  commWrap: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 100
  },
  gpsWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  currLocText: {
    color: colors.pointDark,
    fontFamily: fonts.batang,
    fontSize: 12
  }
});

const Container = styled.View``;

const SearchModeTO = styled.TouchableOpacity``;

const SwitchText = styled.Text`
  font-family: ${fonts.titleTop};
  font-size: 26;
  align-items: flex-end;
  justify-content: center;
  color: ${colors.point2};
  ${props =>
    props.select &&
    `
    color: ${colors.batang};
  `}
`;

const SearSummaryWrap = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const SearSummaryTextWrap = styled.View`
  flex-direction: row;
`;

const SearSummary = styled.Text`
  font-family: ${fonts.title};
  padding-top: 5;
  padding-bottom: 5;
  margin-right: 3;
`;

const ScrollImage = styled.Image`
  width: 35;
  height: 22;
`;

export default class GPSSearchScreen extends React.Component
{
  _didFocusSubscription;

  _willBlurSubscription;

  static navigationOptions = {
    header: null
  };

  _isMounted = false;

  constructor (props)
  {
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
      backButtonCondition: {
        isDoubleClick: false
      }
    };

    this._didFocusSubscription = props.navigation.addListener(
      'didFocus',
      payload =>
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
    );
  }

  componentDidMount ()
  {
    const { navigation } = this.props;

    this._isMounted = true;

    this.setLocationInfo();
    this.setState({ isComponentMountComplete: true });

    this._willBlurSubscription = navigation.addListener('willBlur', payload =>
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
    );
  }

  componentWillUnmount ()
  {
    this._isMounted = false;
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  /**
   * 내주변/지역 검색 모드변경 함수
   */
  changeSearMode = isLocalMode =>
  {
    const { isSearchViewMode } = this.state;

    this.setState({
      isLocalSearch: isLocalMode,
      searSido: '서울',
      searGungu: '전체'
    });

    if (!isSearchViewMode)
    {
      this.setSearchViewMode(true);
    }
  };

  /**
   * GPS정보수신 함수
   */
  getLocation = async () =>
  {
    const { status } = await Permissions.askAsync(Permissions.LOCATION).catch((err) => console.log(err));
    if (status !== 'granted')
    {
      Alert.alert('위치정보 접근이 허용되지 않았습니다.');
      return undefined;
    }

    const location = await Location.getCurrentPositionAsync({}).catch((err) => console.log(err));

    this.setState({
      searLongitude: location?.coords.longitude,
      searLatitude: location?.coords.latitude
    });

    // Text Code Deajeon Railway Station
    // this.setState({
    //   searLongitude: 127.433796,
    //   searLatitude: 36.332329,
    // });

    return location;
  };

  handleBackPress = () =>
  {
    const { backButtonCondition } = this.state;

    if (backButtonCondition.isDoubleClick)
    {
        console.log('>> BackHandler.exitApp~~')
        BackHandler.exitApp();
    } else {
        ToastAndroid.show("한번 더 누르시면 앱이 종료됩니다!", ToastAndroid.SHORT);

        backButtonCondition.isDoubleClick = true;

        setTimeout(() => {
            backButtonCondition.isDoubleClick = false;
        }, 3000);

        return true;
    }

    return true;
  };

  /**
   * GPS 좌표을 활용한 주소설정
   */
  setLocAddress = (logitude, latitude) =>
  {
    api
      .getAddrByGpspoint(logitude, latitude)
      .then(addrInfo =>
      {
        if (!this._isMounted)
        {
          return;
        }

        if (addrInfo)
        {
          if (addrInfo.code === -2)
          {
            this.setState({
              currLocation: addrInfo.msg
            });
          }
          else if (addrInfo.documents[0])
          {
            const address = addrInfo.documents[0]; // region_type: H(행정동, documents[1]) or B(법정동, documents[0])
            const addressName = address.address_name;
            const sido = address.region_1depth_name;
            let gungu = address.region_2depth_name;
            if (!gungu)
            {
              gungu = address.region_3depth_name;
            }

            this.setState({
              currLocation: `현 위치: ${addressName}`,
              searSido: sido,
              searGungu: gungu
            });
          }
          else
          {
            Alert.alert(
              '유효하지 않은 좌표주소 입니다',
              `응답 내용: ${addrInfo}`
            );
          }
        }
      })
      .catch(error =>
      {
        if (!this._isMounted)
        {
          return;
        }

        Alert.alert(
          '현 위치 수신에 문제가 있습니다, 재 시도해 주세요.',
          `[${error.name}] ${error.message}`
        );
      });
  };

  /**
   * 검색화면/광고화면 전환 함수
   */
  setSearchViewMode = flag =>
  {
    const { isSearchViewMode } = this.state;

    if (flag !== isSearchViewMode)
    {
      this.setState({ isSearchViewMode: flag });
    }
  };

  /**
   * 지역장비 검색 유효성 검사 함수
   */
  validateSearNearFirm = () =>
  {
    const {
      searEquipment,
      searEquiModel,
      searLongitude,
      searLatitude
    } = this.state;

    this.setState({ validationMessage: '' });

    let v = validatePresence(searEquipment);
    if (!v[0])
    {
      this.setState({ validationMessage: '검색할 장비명을 선택해 주세요' });
      return false;
    }

    v = validatePresence(searEquiModel);
    if (!v[0])
    {
      this.setState({
        validationMessage: '검색할 장비명 모델을 선택해 주세요'
      });
      return false;
    }

    v = validatePresence(searLongitude);
    if (!v[0])
    {
      this.setState({
        validationMessage:
          '위치정보가 아직 수신되지 않았습니다, 조금만 기다려 주시거나 위치정보 새로고침을 눌러 주세요.'
      });
      return false;
    }

    v = validatePresence(searLatitude);
    if (!v[0])
    {
      this.setState({
        validationMessage:
          '위치정보가 아직 수신되지 않았습니다, 조금만 기다려 주시거나 위치정보 새로고침을 눌러 주세요.'
      });
      return false;
    }

    this.setState({ isVisibleSearResultModal: true });
  };

  /**
   * 지역장비 검색 유효성 검사 함수
   */
  validateSearLocFirm = () =>
  {
    const { searEquipment, searEquiModel, searSido, searGungu } = this.state;

    this.setState({ validationMessage: '' });

    let v = validatePresence(searEquipment);
    if (!v[0])
    {
      this.setState({ validationMessage: '검색할 장비명을 선택해 주세요' });
      return false;
    }

    v = validatePresence(searEquiModel);
    if (!v[0])
    {
      this.setState({ validationMessage: '검색할 장비모델을 선택해 주세요' });
      return false;
    }

    v = validatePresence(searSido);
    if (!v[0])
    {
      this.setState({ validationMessage: '검색할 지역(시도) 선택해 주세요' });
      return false;
    }

    this.setState({ isVisibleSearResultModal: true });
  };

  /**
   * 사용자 위치설정 함수
   */
  setLocationInfo = async () =>
  {
    const location = await this.getLocation();

    if (location)
    {
      this.setLocAddress(location.coords.longitude, location.coords.latitude);
    }
  };

  render ()
  {
    const { navigation } = this.props;
    const {
      isVisibleSearResultModal,
      isComponentMountComplete,
      isLocalSearch,
      searEquipment,
      searEquiModel,
      currLocation,
      searSido,
      searGungu,
      validationMessage,
      searLongitude,
      searLatitude
    } = this.state;

    if (!isComponentMountComplete)
    {
      return <JBActIndicator title="위치정보를 불러오는 중..." size={35} />;
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
              <SearSummaryTextWrap>
                <SearSummary>[</SearSummary>
                <SearSummary>
                  {isLocalSearch ? '지역검색: ' : '주변검색: '}
                </SearSummary>
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
              </SearSummaryTextWrap>
              <ScrollImage
                source={require('../../assets/images/scroll-icon_6_4.png')}
              />
            </SearSummaryWrap>
            <JBSelectBox
              categoryList={EQUIPMENT_CATEGORY}
              itemList={EQUIPMENT_ITEM}
              selectedCat={searEquipment}
              selectedItem={searEquiModel}
              selectCategory={equi =>
                this.setState({ searEquipment: equi, searEquiModel: '' })
              }
              selectItem={(equi, model) =>
                this.setState({ searEquipment: equi, searEquiModel: model })
              }
              cateImageArr={EQUIPMENT_IMAGES}
            />

            <View style={styles.optionWrap}>
              {isLocalSearch ? (
                <JBSelectBox
                  categoryList={LOCAL_CATEGORY}
                  itemList={LOCAL_ITEM}
                  selectedCat={searSido}
                  selectedItem={searGungu}
                  selectCategory={sido => {
                    console.log('sido: ', sido)
                    this.setState({ searSido: sido, searGungu: '' })
                  }
                  }
                  selectItem={(sido, sigungu) =>
                    this.setState({ searSido: sido, searGungu: sigungu })
                  }
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
          closeModal={() => this.setState({ isVisibleSearResultModal: false })}
          searEquipment={searEquipment}
          searEquiModel={searEquiModel}
          searLongitude={searLongitude}
          searLatitude={searLatitude}
          searSido={searSido}
          searGungu={searGungu}
          isLocalSearch={isLocalSearch}
          size="full"
          navigation={navigation}
        />
      </Container>
    );
  }
}

const EQUIPMENT_IMAGES = [
  require('../../assets/images/equipment/crain_candi.jpg'),
  require('../../assets/images/equipment/cago_crain.png'),
  require('../../assets/images/equipment/excavator.jpg'),
  require('../../assets/images/equipment/sky.jpg'),
  require('../../assets/images/equipment/lift.jpg'),
  require('../../assets/images/equipment/ladder.jpg'),
  require('../../assets/images/equipment/highlander.jpg'),
  require('../../assets/images/equipment/bulldozer.jpg'),
  require('../../assets/images/equipment/spider_crain.jpg')
];

const EQUIPMENT_CATEGORY = [
  '크레인',
  '카고크레인',
  '굴착기',
  '스카이',
  '지게차',
  '사다리차',
  '하이랜더',
  '불도저',
  '거미크레인'
];

const EQUIPMENT_ITEM = [];
EQUIPMENT_ITEM['크레인'] = [
  '10톤',
  '13톤',
  '15톤',
  '25톤',
  '50톤',
  '100톤',
  '160톤',
  '200톤',
  '250톤',
  '300톤',
  '400톤',
  '500톤',
  '700톤',
  '800톤',
  '1200톤'
].map(lin => new PickerItem(`${lin}`, lin, lin));
EQUIPMENT_ITEM['카고크레인'] = ['5톤', '11톤', '18톤', '25톤'].map(lin => new PickerItem(`${lin}`, lin, lin));
EQUIPMENT_ITEM['굴착기'] = [
  '미니',
  '02W',
  '03W',
  '06W',
  '08W',
  '02LC',
  '04LC',
  '06LC'
].map(lin => new PickerItem(`${lin}`, lin, lin));
EQUIPMENT_ITEM['스카이'] = [
  '1톤',
  '1.2톤',
  '2톤',
  '2.5톤',
  '3.5톤',
  '5톤',
  '28m',
  '45m',
  '58m',
  '60m',
  '75m'
].map(lin => new PickerItem(`${lin}`, lin, lin));
EQUIPMENT_ITEM['지게차'] = [
  '2톤',
  '2.5톤',
  '3톤',
  '4.5톤',
  '5톤',
  '6톤',
  '7톤',
  '8톤',
  '11.5톤',
  '15톤',
  '18톤',
  '25톤'
].map(lin => new PickerItem(`${lin}`, lin, lin));
EQUIPMENT_ITEM['사다리차'] = ['사다리차'].map(lin => new PickerItem(`${lin}`, lin, lin));
EQUIPMENT_ITEM['하이랜더'] = ['하이랜더'].map(lin => new PickerItem(`${lin}`, lin, lin));
EQUIPMENT_ITEM['불도저'] = ['불도저'].map(lin => new PickerItem(`${lin}`, lin, lin));
EQUIPMENT_ITEM['거미크레인'] = ['2톤', '3톤'].map(lin => new PickerItem(`${lin}`, lin, lin));
