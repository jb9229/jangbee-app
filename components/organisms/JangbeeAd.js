import React from 'react';
import {
  Image, StyleSheet, Text, View,
} from 'react-native';
import Swiper from 'react-native-swiper';
import JBIcon from '../molecules/JBIcon';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    height: 100,
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
          url: '',
          tel: '',
          title: '',
          subTitle: '',
        },
        {
          url: '',
          tel: '',
          title: '',
          subTitle: '',
        },
      ],
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Swiper style={styles.wrapper} showsButtons autoplay>
          <View style={styles.slide1}>
            <Text style={styles.text}>Hello Swiper</Text>
          </View>
          <View style={styles.slide2}>
            <Text style={styles.text}>Beautiful</Text>
          </View>
          <View style={styles.slide3}>
            <Text style={styles.text}>And simple</Text>
          </View>
        </Swiper>
        <JBIcon name="ios-close" size={32} onPress={() => setVisibleModal(false)} />
      </View>
    );
  }
}
