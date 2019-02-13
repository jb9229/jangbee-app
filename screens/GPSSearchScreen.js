import React from 'react';
import {
  Switch, StyleSheet, Text, View,
} from 'react-native';
import JBButton from '../components/molecules/JBButton';
import SearCondBox from '../components/organisms/SearCondBox';
import JangbeeAd from '../components/organisms/JangbeeAd';
import EquipementModal from '../components/EquipmentModal';
import LocalSelModal from '../components/LocalSelModal';
import colors from '../constants/Colors';

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
      isLocalSearch: false,
      isVisibleEquiModal: false,
      isVisibleLocalModal: false,
      equiListStr: '',
      searLocStr: '',
    };
  }

  componentDidMount() {}

  render() {
    const {
      equiList,
      equiSelMap,
      equiListStr,
      isLocalSearch,
      isVisibleEquiModal,
      isVisibleLocalModal,
      searLocStr,
    } = this.state;
    return (
      <View style={styles.container}>
        <EquipementModal
          isVisibleEquiModal={isVisibleEquiModal}
          closeModal={() => this.setState({ isVisibleEquiModal: false })}
          selEquipmentStr={equiListStr}
          completeSelEqui={seledEuipListStr => this.setState({ equiListStr: seledEuipListStr })}
          nextFocus={() => {}}
        />
        <LocalSelModal
          isVisibleEquiModal={isVisibleLocalModal}
          closeModal={() => this.setState({ isVisibleLocalModal: false })}
          completeSelEqui={selectedLocal => this.setState({ searLocStr: selectedLocal })}
          nextFocus={() => {}}
          selEquipment={equiListStr}
        />
        <JangbeeAd />
        <View style={styles.cardWrap}>
          <View style={styles.card}>
            <View style={styles.searEquiWrap}>
              <SearCondBox
                title="어떤 장비를 찾고 계신가요?"
                searchCondition={equiListStr}
                onPress={() => this.setState({ isVisibleEquiModal: true })}
                defaultCondtion="장비 선택"
              />

              {isLocalSearch ? (
                <SearCondBox
                  title="부르고자 하는 장비의 지역은 어디 입니까?"
                  searchCondition={searLocStr}
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
      </View>
    );
  }
}
