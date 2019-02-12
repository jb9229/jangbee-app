import React from 'react';
import {
  Alert, FlatList, Switch, StyleSheet, Text, View,
} from 'react-native';
import JBButton from '../components/molecules/JBButton';
import EquiSelBox from '../components/EquiSelBox';
import colors from '../constants/Colors';
import api from '../api/api';
import JangbeeAd from '../components/organisms/JangbeeAd';
import EquipementModal from '../components/EquipmentModal';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchWrap: {
    flex: 1,
    borderWidth: 1,
    justifyContent: 'space-between',
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
      equiListStr: '',
    };
  }

  componentDidMount() {}

  render() {
    const {
      equiList, equiSelMap, isLocalSearch, isVisibleEquiModal, equiListStr,
    } = this.state;
    return (
      <View style={styles.container}>
        <EquipementModal
          isVisibleEquiModal={isVisibleEquiModal}
          setEquiSelModalVisible={this.setEquiSelModalVisible}
          selEquipmentStr={equiListStr}
          completeSelEqui={seledEuipListStr => this.setState({ equiListStr: seledEuipListStr })}
        />
        <JangbeeAd />
        <View style={styles.searchWrap}>
          <View style={styles.searEquiWrap}>
            <Text>어떤 장비를 찾고 계신가요?</Text>
            {equiListStr === '' ? (
              <EquiSelBox eName="콜할 장비선택" selected={false} />
            ) : (
              <EquiSelBox eName={equiListStr} selected />
            )}
            <Text>부르고자 하는 장비의 지역은 어디 입니까?</Text>
            {equiListStr === '' ? (
              <EquiSelBox eName="콜할 지역선택" selected={false} />
            ) : (
              <EquiSelBox eName={equiListStr} selected />
            )}
          </View>
          <View style={styles.commWrap}>
            <View style={styles.gpsWrap}>
              <Text>현 위치:</Text>
            </View>
            <View style={styles.switchWrap}>
              <Text>내 주변 검색</Text>
              <Switch value={isLocalSearch} />
              <Text>지역 검색</Text>
            </View>
            <JBButton title="내 주변 검색" onPress={() => this.onSignOut()} size="full" />
          </View>
        </View>
      </View>
    );
  }
}
