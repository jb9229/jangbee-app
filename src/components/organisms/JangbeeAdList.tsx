import { AdLocation, AdType } from 'src/container/ad/types';
import { Dimensions, Platform, StyleSheet, View } from 'react-native';

import { ADS } from 'src/api/queries';
import { AdMobBanner } from 'expo-ads-admob';
import BugReport from 'organisms/BugReport';
import FirmDetailModal from 'src/components/templates/FirmDetailModal';
import JBActIndicator from 'molecules/JBActIndicator';
import JangbeeAd from 'molecules/JangbeeAd';
import React from 'react';
import Swiper from 'react-native-swiper/src';
import { noticeUserError } from 'src/container/request';
import styled from 'styled-components/native';
import { useLazyQuery } from '@apollo/client';

interface StyledProps {
  height?: number;
  adLocation?: AdLocation;
}
const Container = styled.View<StyledProps>`
  min-height: 200px;
  height: ${(Dimensions.get('window').width - 20) * 0.75};
  max-height: ${(props): number =>
    props.adLocation === AdLocation.MAIN ? 800 * 0.75 : 500 * 0.75};
`;
const StyledSwiper = styled(Swiper)`
  max-height: ${(props): number =>
    props.adLocation === AdLocation.MAIN ? 800 * 0.75 : 500 * 0.75};
`;

const styles = StyleSheet.create({
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const AdMobContainer = styled.View<StyledProps>`
  width: 100%;
  height: ${(props): number => (props.height ? props.height : 120)};
  justify-content: center;
  align-items: center;
`;

interface Props {
  adLocation: AdLocation;
  euqiTarget: string;
  sidoTarget: string;
  gugunTarget: string;
  admob: boolean;
  admobUnitID: string;
  admonSize: string;
  admonHeight: number;
}

const JangbeeAdList: React.FC<Props> = props => {
  React.useEffect(() => {
    const veriables = {
      adType: AdType.SEARCH_EQUIPMENT_FIRST,
      adLocation: props.adLocation,
      equiTarget: props.euqiTarget,
      sidoTarget: props.sidoTarget,
      gugunTarget: props.gugunTarget,
    };

    adsReq({ variables: { searchAdParams: veriables } });
  }, [props.euqiTarget, props.sidoTarget, props.gugunTarget]);

  const [adsReq, adsRsp] = useLazyQuery(ADS, {
    onError: err => {
      noticeUserError('ADS Query result', err?.message);
    },
  });
  const [visibleFirmDetailModal, setVisibleFirmDetailModal] = React.useState(
    false
  );
  const [detailFirmId, setDetailFirmId] = React.useState();
  // adList: undefined,
  // isVisibleDetailModal: false
  // isEmptyAdlist,
  // detailFirmId
  /**
   * Admob 광고 요청 실패 팝업
   */

  const adList = adsRsp?.data?.ads || [];
  console.log('>>> adList: ', adList);
  // Loading
  if (adsRsp.loading) {
    return (
      <Container>
        <JBActIndicator title="광고 불러오는중..." size="large" />
      </Container>
    );
  }

  if (props.admob && adList.length === 0) {
    if (Platform.OS === 'web') {
      return null;
    }
    const unitID =
      props.admobUnitID || 'ca-app-pub-9415708670922576/6931111723';

    const bannerSize = props.admonSize || 'largeBanner';

    return (
      <AdMobContainer height={props.admonHeight}>
        <AdMobBanner
          bannerSize={bannerSize}
          adUnitID={unitID} // Test ID, Replace with your-admob-unit-id
          testDeviceID="EMULATOR"
          onDidFailToReceiveAdWithError={() => (
            <BugReport title="구글 광고 요청에 실패 했습니다" />
          )}
        />
      </AdMobContainer>
    );
  }

  if (adList === null) {
    return <BugReport title="광고 요청에 실패 했습니다" />;
  }
  console.log('>>> adList: ', adList);
  const adViewList = adList.map((ad, index) => (
    <View style={styles.slide} key={index}>
      <JangbeeAd
        ad={ad}
        adLocation={props.adLocation}
        openFirmDetail={(accountId): void => {
          setDetailFirmId(accountId);
          setVisibleFirmDetailModal(true);
        }}
      />
    </View>
  ));
  console.log('>>> adViewList: ', adViewList);
  return (
    <Container adLocation={props.adLocation}>
      <StyledSwiper
        style={styles.wrapper}
        autoplay={true}
        autoplayTimeout={3.5}
        dotStyle={{ marginBottom: 0 }}
        activeDotStyle={{ marginBottom: 0 }}
        // onIndexChanged={() => Alert.alert('chan')}
      >
        {adViewList}
      </StyledSwiper>
      <FirmDetailModal
        isVisibleModal={visibleFirmDetailModal}
        accountId={detailFirmId}
        closeModal={(): void => setVisibleFirmDetailModal(false)}
      />
    </Container>
  );
};

export default JangbeeAdList;
