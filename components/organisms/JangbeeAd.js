import React from 'react';
import {
  Alert, ImageBackground, Linking, StyleSheet, Text, View,
} from 'react-native';
import JBIcon from '../molecules/JBIcon';
import AdImage from './AdImage';
import colors from '../../constants/Colors';
import fonts from '../../constants/Fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.batangDark,
    width: '100%',
    height: 200,
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
    marginTop: 15,
  },
  titleText: {
    color: 'white',
    fontSize: 21,
    fontFamily: fonts.titleMiddle,
  },
  bottomWrap: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 5,
    height: 40,
    marginBottom: 8,
    justifyContent: 'center',
  },
  subTitleWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 40,
    marginRight: 40,
  },
  subTitleText: {
    color: 'white',
    fontSize: 15,
    fontFamily: fonts.batang,
  },
  telIconWrap: {
    position: 'absolute',
    top: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 5,
    paddingRight: 5,
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

function telAdvertiser(phoneNumber) {
  if (!phoneNumber) {
    Alert.alert(`링크 열기에 문제가 있습니다 [${phoneNumber}]`);
    return;
  }

  Linking.openURL(`tel:${phoneNumber}`).catch(
    Alert.alert(`링크 열기에 문제가 있습니다 [${phoneNumber}]`),
  );
}

const JangbeeAd = ({ ad, openFirmDetail }) => (
  <View style={styles.container}>
    {ad.photoUrl === null || ad.photoUrl === '' ? (
      <View style={styles.bgAdWrap}>
        <AdImage title={ad.title} value={ad.photoUrl} />
        <View style={styles.bottomWrap}>
          <View style={styles.subTitleWrap}>
            <Text style={styles.subTitleText}>{ad.subTitle}</Text>
          </View>
          <View style={styles.telIconWrap}>
            {ad.accountId ? (
              <JBIcon
                name="information-circle"
                size={40}
                color={colors.point2}
                onPress={() => openFirmDetail(ad.accountId)}
              />
            ) : null}
            <JBIcon
              name="call"
              size={40}
              color={colors.point}
              onPress={() => telAdvertiser(ad.telNumber)}
            />
          </View>
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
              {ad.accountId ? (
                <JBIcon
                  name="information-circle"
                  size={38}
                  color={colors.point2}
                  onPress={() => openFirmDetail(ad.accountId)}
                />
              ) : null}
              <JBIcon
                name="call"
                size={40}
                color={colors.pointDark}
                onPress={() => telAdvertiser(ad.telNumber)}
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    )}
  </View>
);

export default JangbeeAd;
