import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import Swiper from 'react-native-swiper';
import colors from '../constants/Colors';
import JBActIndicator from './organisms/JBActIndicator';
import BugReport from './organisms/BugReport';
import * as api from '../api/api';
import JangbeeAd from './organisms/JangbeeAd';

const styles = StyleSheet.create({
  container: {
    height: 200,
  },
  wrapper: {
    flex: 1,
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.point2Dark,
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.point2Dark,
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.point2Dark,
  },
});

export default class JangbeeAdList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      adList: undefined,
    };
  }

  componentDidMount() {
    const {
      adType, euqiTarget, sidoTarget, gugunTarget,
    } = this.props;

    this.setAdList(adType, euqiTarget, sidoTarget, gugunTarget);
  }

  componentWillReceiveProps(nextProps) {
    const {
      adType, euqiTarget, sidoTarget, gugunTarget,
    } = this.props;

    if (
      nextProps.euqiTarget !== euqiTarget
      || nextProps.sidoTarget !== sidoTarget
      || nextProps.gugunTarget !== gugunTarget
    ) {
      this.setAdList(adType, nextProps.euqiTarget, nextProps.sidoTarget, nextProps.gugunTarget);
    }
  }

  /**
   * 광고 리스트 설정
   * @param adType 광고타입(MAIN, LOCAL, EQUIPMENT)
   * @param euqiTarket 타켓 광고할 선택장비
   */
  setAdList = (adType, euqiTarget, sidoTarget, gugunTarget) => {
    api
      .getAd(adType, euqiTarget, sidoTarget, gugunTarget)
      .then((jsonRes) => {
        this.setState({ adList: jsonRes });
      })
      .catch((error) => {
        Alert.alert(
          `광고리스트 요청에 문제가 있습니다, 다시 시도해 주세요 -> [${error.name}] ${
            error.message
          }`,
        );
        this.setState({ adList: null });
      });
  };

  render() {
    const { adList } = this.state;
    const slidStyles = [styles.slide1, styles.slide2, styles.slide3];

    if (adList === undefined) {
      return (
        <View style={styles.container}>
          <JBActIndicator title="광고 불러오는중..." size="large" />
        </View>
      );
    }
    if (adList === null) {
      return <BugReport title="광고 요청에 실패 했습니다" />;
    }

    const adViewList = adList.map((ad, index) => (
      <View style={slidStyles[index]} key={index}>
        <JangbeeAd ad={ad} />
      </View>
    ));
    return (
      <View style={styles.container}>
        <Swiper
          style={styles.wrapper}
          autoplay
          autoplayTimeout={3.5}
          dotStyle={{ marginBottom: 0 }}
          activeDotStyle={{ marginBottom: 0 }}
        >
          {adViewList}
        </Swiper>
      </View>
    );
  }
}
