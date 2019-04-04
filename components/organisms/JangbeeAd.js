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

function telAdvertiser(phoneNumber) {
  if (!phoneNumber) {
    Alert.alert(`링크 열기에 문제가 있습니다 [${phoneNumber}]`);
    return;
  }

  Linking.openURL(`tel:${phoneNumber}`).catch(
    Alert.alert(`링크 열기에 문제가 있습니다 [${phoneNumber}]`),
  );
}

/**
 * 광고주의 업체정보 보기 함수
 */
function gotoFirmDetail(accountId) {
  const { navigation } = this.props;

  navigation.navigate('FirmDetail', { accountId });
}

const JangbeeAd = ({ ad }) => (
  <View style={styles.container}>
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
              onPress={() => gotoFirmDetail(ad.firmId)}
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
                  onPress={() => gotoFirmDetail(ad.firmId)}
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
      </ImageBackground>
    )}
  </View>
);

export default JangbeeAd;
