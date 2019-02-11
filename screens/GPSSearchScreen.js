import React from 'react';
import {
  Alert, FlatList, StyleSheet, Text, View,
} from 'react-native';
import JBButton from '../components/molecules/JBButton';
import EquiSelBox from '../components/EquiSelBox';
import colors from '../constants/Colors';
import api from '../api/api';
import JangbeeAd from '../components/organisms/JangbeeAd';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardWrap: {
    flex: 1,
    backgroundColor: colors.batangLight,
    padding: 10,
  },
  card: {
    flex: 1,
    backgroundColor: colors.cardBatang,
    padding: 15,
    paddingTop: 5,
    borderRadius: 5,
  },
  equiListWrap: {
    justifyContent: 'space-between',
  },
  commWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default class GPSSearchScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    const { equiList, equiSelMap } = this.state;
    return (
      <View style={styles.container}>
        <JangbeeAd />
        <Text>고객님의 현 위치 입니다.</Text>
        <Text>현 위치:</Text>
        <Text>어떤 장비를 찾고 계신가요?</Text>
        <View>
          <Text>airbnb 팝업 조회 조건 설정</Text>
        </View>
        <JBButton title="내 주변 검색" onPress={() => this.onSignOut()} size="full" />
      </View>
    );
  }
}
