import React from 'react';
import {
  Alert, ImageBackground, StyleSheet, Text, View,
} from 'react-native';
import Swiper from 'react-native-swiper';
import JBIcon from '../molecules/JBIcon';
import AdImage from './AdImage';
import colors from '../../constants/Colors';
import JBActIndicator from './JBActIndicator';
import BugReport from './BugReport';
import * as api from '../../api/api';
import fonts from '../../constants/Fonts';

const styles = StyleSheet.create({
  container: {
    height: 200,
  },
  wrapper: {},
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
  bgAdWrap: {
    flex: 1,
    justifyContent: 'space-between',
  },
  adImgBg: {
    width: '100%',
    height: '100%',
  },
  titleWrap: {
    flex: 2,
    alignItems: 'center',
    marginTop: 5,
  },
  titleText: {
    color: 'white',
    fontSize: 21,
    fontFamily: fonts.titleMiddle,
  },
  bottomWrap: {
    flex: 1,
  },
  subTitleWrap: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5,
  },
  subTitleText: {
    color: 'white',
    fontSize: 15,
    fontFamily: fonts.batang,
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
    const { adType, euqiTarket } = this.props;

    this.setAdList(adType, euqiTarket);
  }

  /**
   * 광고 리스트 설정
   * @param adType 광고타입(MAIN, LOCAL, EQUIPMENT)
   * @param euqiTarket 타켓 광고할 선택장비
   */
  setAdList = (adType, euqiTarket) => {
    api
      .getAd(adType, euqiTarket)
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
        {ad.photoUrl === null || ad.photoUrl === '' ? (
          <View style={styles.bgAdWrap}>
            <AdImage title={ad.title} value={ad.photoUrl} />
            <View style={styles.subTitleWrap}>
              <Text style={styles.subTitleText}>{ad.subTitle}</Text>
            </View>
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
        ) : (
          <ImageBackground source={{ uri: ad.photoUrl }} style={styles.adImgBg}>
            <View style={styles.bgAdWrap}>
              <View style={styles.titleWrap}>
                <Text style={styles.titleText}>{ad.title}</Text>
              </View>
              <View style={styles.bottomWrap}>
                <View style={styles.subTitleWrap}>
                  <Text style={styles.subTitleText}>{ad.subTitle}</Text>
                </View>
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
            </View>
          </ImageBackground>
        )}
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
