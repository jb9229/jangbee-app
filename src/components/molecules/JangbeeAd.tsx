import { Dimensions, StyleSheet, Text, View } from 'react-native';

import { AdLocation } from 'src/container/ad/types';
import JBIcon from 'atoms/JBIcon';
import React from 'react';
import { callAdFirm } from 'src/common/CallLink';
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
  max-height: ${(props): number =>
    props.adLocation === AdLocation.MAIN ? 800 * 0.75 : 500 * 0.75};
`;
const AdImgBg = styled.ImageBackground<StyledProps>`
  width: ${Dimensions.get('window').width >= 1600
    ? 1600
    : Dimensions.get('window').width};
  height: ${(props): number =>
    Dimensions.get('window').width > 800
      ? props.adLocation === AdLocation.MAIN
        ? 800 * 0.75
        : 500 * 0.75
      : Dimensions.get('window').width * 0.75};
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
  border-radius: 5px;
  height: 40;
  margin-bottom: 15px;
  justify-content: center;
`;

const styles = StyleSheet.create({
  bgAdWrap: {
    flex: 1,
    justifyContent: 'space-between',
    width: '100%',
  },
  titleText: {
    color: 'white',
    fontSize: 21,
    fontFamily: fonts.titleMiddle,
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
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
  telIconWrap: {},
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
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

interface Props {
  ad: any;
  openFirmDetail: any;
  adLocation: AdLocation;
}
const JangbeeAd: React.FC<Props> = ({ ad, openFirmDetail, adLocation }) => (
  <Container adLocation={adLocation}>
    {ad.photoUrl === null || ad.photoUrl === '' ? (
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
                  size={40}
                  color={colors.point2}
                  onPress={() => openFirmDetail(ad.accountId)}
                />
              ) : null}
              {ad.telNumber && (
                <JBIcon
                  name="call"
                  size={40}
                  color={colors.point}
                  onPress={() => callAdFirm(ad.telNumber)}
                />
              )}
            </TelIconWrap>
          </BottomWrap>
        </Contents>
      </View>
    ) : (
      <AdImgBg
        adLocation={adLocation}
        source={{ uri: ad.photoUrl }}
        resizeMode="cover"
      >
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
                  onPress={() => callAdFirm(ad.telNumber)}
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
