import React from 'react';
import {
  Alert, Switch, StyleSheet, Text, View,
} from 'react-native';
import JBButton from '../components/molecules/JBButton';
import SearCondBox from '../components/organisms/SearCondBox';
import JangbeeAd from '../components/organisms/JangbeeAd';
import EquipementModal from '../components/EquipmentModal';
import LocalSelModal from '../components/LocalSelModal';
import colors from '../constants/Colors';
import adType from '../constants/AdType';
import * as api from '../api/api';
import FirmSearList from '../components/organisms/FirmSearList';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardWrap: {
    flex: 1,
    backgroundColor: colors.batangLight,
    padding: 10,
    paddingTop: 6,
    paddingBottom: 6,
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
    flex: 1,
    alignItems: 'center',
  },
  commWrap: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 5,
  },
  gpsWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
      searEquipment: '',
      searLocal: '',
      searchedFirmList: null,
      isListLoading: undefined,
      isLastList: false,
    };
  }

  componentDidMount() {}

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
    const {
      searchedFirmList, page, searEquipment, searLongitude, searLatitude,
    } = this.state;

    this.setSearchViewMode(true);

    api
      .getNearFirmList(1, searEquipment, '126.955869', '37.546037')
      .then((res) => {
        console.log(res);
        this.setState({
          searchedFirmList: page === 0 ? res.content : [...searchedFirmList, ...res.content],
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

  render() {
    const {
      isSearViewMode,
      searEquipment,
      isLocalSearch,
      isVisibleEquiModal,
      isVisibleLocalModal,
      searLocal,
      searchedFirmList,
      page,
      refreshing,
      isLastList,
      isListLoading,
    } = this.state;
    return (
      <View style={styles.container}>
        <EquipementModal
          isVisibleEquiModal={isVisibleEquiModal}
          closeModal={() => this.setState({ isVisibleEquiModal: false })}
          selEquipmentStr={searEquipment}
          completeSelEqui={seledEuipListStr => this.setState({ searEquipment: seledEuipListStr })}
          nextFocus={() => {}}
        />
        <LocalSelModal
          isVisibleEquiModal={isVisibleLocalModal}
          closeModal={() => this.setState({ isVisibleLocalModal: false })}
          completeSelEqui={selectedLocal => this.setState({ searLocal: selectedLocal })}
          nextFocus={() => {}}
          selEquipment={searEquipment}
        />
        {!isSearViewMode ? <JangbeeAd adType={adType.main} /> : null}
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
                  searchCondition={searLocal}
                  defaultCondtion="지역 선택"
                  onPress={() => this.setState({ isVisibleLocalModal: true })}
                />
              ) : null}
            </View>
            <View style={styles.commWrap}>
              {!isLocalSearch ? (
                <View style={styles.gpsWrap}>
                  <Text>현 위치:</Text>
                </View>
              ) : null}
              <View style={styles.switchWrap}>
                <Text style={styles.switchText}>내 주변 검색</Text>
                <Switch
                  value={isLocalSearch}
                  onValueChange={newValue => this.setState({ isLocalSearch: newValue })}
                />
                <Text style={styles.switchText}>지역 검색</Text>
              </View>
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
        {isSearViewMode ? (
          <FirmSearList
            data={searchedFirmList}
            page={page}
            refreshing={refreshing}
            last={isLastList}
            isLoading={isListLoading}
            handleLoadMore={this.handleLoadMore}
            handleRefresh={this.handleRefresh}
          />
        ) : null}
      </View>
    );
  }
}
