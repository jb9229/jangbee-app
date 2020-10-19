import { Alert, Dimensions, Linking, StyleSheet, Text, View } from 'react-native';

import AdImage from 'molecules/AdImage';
import { AdLocation } from 'src/container/ad/types';
import JBIcon from 'atoms/JBIcon';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import React from 'react';
import colors from 'constants/Colors';
import fonts from 'constants/Fonts';
import styled from 'styled-components/native';

interface StyledProps {
  adLocation?: AdLocation;
}

const Container = styled.View<StyledProps>`
  background-color: ${colors.batangDark};
  width: 100%;
  height: ${(Dimensions.get('window').width - 20) * 0.75};
  align-items: center;
  max-height: ${(props) => props.adLocation === AdLocation.MAIN ? '500px' : '300px'};
`;
const AdImgBg = styled.ImageBackground`
  width: 100%;
  height: ${(Dimensions.get('window').width - 20) * 0.75};
  max-width: 1600px;
  max-height: 500px;
`;
const TitleWrap = styled.View`
  flex: 3;
  align-items: center;
  justify-content: center;
`;
const Contents = styled.View`
  flex: 7;
  justify-content: flex-end;
`;

const BottomWrap = styled.View`
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 5;
  height: 40;
  margin-bottom: 15px;
  justify-content: center;
`;

const styles = StyleSheet.create({
  bgAdWrap: {
    flex: 1,
    justifyContent: 'space-between'
  },
  titleText: {
    color: 'white',
    fontSize: 21,
    fontFamily: fonts.titleMiddle,
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10
  },
  subTitleWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 40,
    marginRight: 40
  },
  subTitleText: {
    color: 'white',
    fontSize: 15,
    fontFamily: fonts.batang
  },
  telIconWrap: {},
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  }
});

const TelIconWrap = styled.View`
  position: absolute;
  top: 1;
  width: 100%;
  flex-direction: row;
  justify-content: ${props =>
    props.isMultiIcon ? 'space-between' : 'flex-end'};
  padding-left: 5;
  padding-right: 5;
`;

const telAdvertiser = (phoneNumber): void =>
{
  // if (!phoneNumber)
  // {
  //   Alert.alert(`링크 열기에 문제가 있습니다 [${phoneNumber}]`);
  //   return;
  // }

  // Linking.openURL(`tel:${phoneNumber}`)
  //   .catch(() => Alert.alert(`링크 열기에 문제가 있습니다 [${phoneNumber}]`));

  alert('phone call')
  RNImmediatePhoneCall.immediatePhoneCall('0123456789');
};

interface Props {
  ad: any;
  openFirmDetail: any;
  adLocation: AdLocation;
}
const JangbeeAd: React.FC<Props> = ({ ad, openFirmDetail, adLocation }) => (
  <Container adLocation={adLocation}>
    {ad.photoUrl === null || ad.photoUrl === '' ? (
      <View style={styles.bgAdWrap}>
        <AdImage title={ad.title} value={ad.photoUrl} />
        <View style={styles.bottomWrap}>
          <View style={styles.subTitleWrap}>
            <Text style={styles.subTitleText}>{ad.subTitle}</Text>
          </View>
          <TelIconWrap isMultiIcon={ad.accountId}>
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
          </TelIconWrap>
        </View>
      </View>
    ) : (
      <AdImgBg source={{ uri: ad.photoUrl }}>
        <View style={styles.bgAdWrap}>
          <TitleWrap>
            <Text style={styles.titleText}>{ad.title}</Text>
          </TitleWrap>
          <Contents>
            <BottomWrap>
              <View style={styles.subTitleWrap}>
                <Text style={styles.subTitleText}>{ad.subTitle}</Text>
              </View>
              <TelIconWrap isMultiIcon={ad.accountId}>
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
              </TelIconWrap>
            </BottomWrap>
          </Contents>
        </View>
      </AdImgBg>
    )}
  </Container>
);

export default JangbeeAd;
