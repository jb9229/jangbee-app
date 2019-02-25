import React from 'react';
import {
  Alert, StyleSheet, Text, View,
} from 'react-native';
import Swiper from 'react-native-swiper';
import JBIcon from '../molecules/JBIcon';
import AdImage from './AdImage';
import colors from '../../constants/Colors';
import JBActIndicator from './JBActIndicator';
import BugReport from './BugReport';
import * as api from '../../api/api';

const styles = StyleSheet.create({
  container: {
    height: 250,
  },
  wrapper: {
    height: 250,
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  telIconWrap: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginBottom: 10,
    marginRight: 10,
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default class JangbeeAd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      adList: undefined,
    };
  }

  componentDidMount() {
    const { adType } = this.props;

    this.setAdList(adType);
  }

  /**
   * 광고 리스트 설정
   * @param adTYpe 광고타입(MAIN, LOCAL, EQUIPMENT)
   */
  setAdList = (adType) => {
    api
      .getAd(adType)
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

  telAdvertiser = (phoneNumber) => {};

  /**
   * 광고주의 업체정보 보기 함수
   */
  gotoFirmDetail = (accountId) => {
    const { navigation } = this.props;

    navigation.navigate('FirmDetail', { accountId });
  };

  render() {
    const { adList } = this.state;

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
    const slidStyles = [styles.slide1, styles.slide2, styles.slide3];
    const adViewList = adList.map((ad, index) => (
      <View style={slidStyles[index]} key={index}>
        <AdImage title={ad.title} value={ad.photoUrl} />
        <Text>{ad.subTitle}</Text>
        <View style={styles.telIconWrap}>
          {ad.firmId ? (
            <JBIcon
              name="information-circle"
              size={40}
              color={colors.point2}
              onPress={() => this.gotoFirmDetail(ad.firmId)}
            />
          ) : null}
          <JBIcon
            name="call"
            size={40}
            color={colors.point}
            onPress={() => this.telAdvertiser(ad.telNumber)}
          />
        </View>
      </View>
    ));
    return (
      <View style={styles.container}>
        <Swiper
          style={styles.wrapper}
          showsButtons
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
