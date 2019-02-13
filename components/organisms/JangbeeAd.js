import React from 'react';
import {
  Platform, StyleSheet, Text, View,
} from 'react-native';
import Swiper from 'react-native-swiper';
import JBIcon from '../molecules/JBIcon';
import AdImage from './AdImage';
import colors from '../../constants/Colors';

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
      adList: [
        {
          photoUrl: '',
          tel: '',
          title: '장비콜 런칭기념 이벤트',
          subTitle: '광고비 50% 할인, 먼저 신청하는 사람이 임자!',
        },
        {
          photoUrl:
            'https://elasticbeanstalk-ap-northeast-2-499435767786.s3.ap-northeast-2.amazonaws.com/asset/img/jangbee_photo_%2B1549579993465.jpg',
          tel: '',
          title: '대전ㆍ세종 누리5t카크레인',
          subTitle: '중부권 최고의 베테랑 입니다',
        },
        {
          photoUrl: '',
          tel: '',
          title: '',
          subTitle: '',
        },
      ],
    };
  }

  telAdvertiser = (phoneNumber) => {};

  render() {
    const { adList } = this.state;
    const slidStyles = [styles.slide1, styles.slide2, styles.slide3];
    const adViewList = adList.map((ad, index) => (
      <View style={slidStyles[index]} key={index}>
        <AdImage title={ad.title} value={ad.photoUrl} />
        <Text>{ad.subTitle}</Text>
        <View style={styles.telIconWrap}>
          <JBIcon
            name={Platform.OS === 'ios' ? 'ios-information-circle' : 'md-information-circle'}
            size={32}
            color={colors.point2}
            onPress={() => this.telAdvertiser(ad.phoneNumber)}
          />
          <JBIcon
            name={Platform.OS === 'ios' ? 'ios-call' : 'md-call'}
            size={32}
            color={colors.pointDark}
            onPress={() => this.telAdvertiser(ad.phoneNumber)}
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
