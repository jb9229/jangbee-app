import { Platform, StyleSheet, View } from 'react-native';

import { ADS } from 'src/api/queries';
import { AdMobBanner } from 'expo-ads-admob';
import { AdType } from 'src/container/ad/types';
import BugReport from 'organisms/BugReport';
import FirmDetailModal from 'templates/FirmDetailModal';
import JBActIndicator from 'molecules/JBActIndicator';
import JangbeeAd from 'molecules/JangbeeAd';
import React from 'react';
import Swiper from 'react-native-swiper/src';
import { noticeUserError } from 'src/container/request';
import styled from 'styled-components/native';
import { useQuery } from '@apollo/client';

interface StyledProps {
  height?: number;
}
const Container = styled.View`
  min-height: 200px;
  max-height: 500px;
`;
const StyledSwiper = styled(Swiper)`
  max-height: 500px;
`;

const styles = StyleSheet.create({
  wrapper: {
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const AdMobContainer = styled.View<StyledProps>`
  width: 100%;
  height: ${(props): number => (props.height ? props.height : 120)};
  justify-content: center;
  align-items: center;
`;

interface Props {
  adLocation: string;
  euqiTarget: string;
  sidoTarget: string;
  gugunTarget: string;
  admob: boolean;
  admobUnitID: string;
  admonSize: string;
  admonHeight: number;
}

const JangbeeAdList: React.FC<Props> = (props) =>
{
  const adsRsp = useQuery(ADS, {
    variables: { searchAdParams: { adType: AdType.SEARCH_EQUIPMENT_FIRST, adLocation: 0, equiTarget: props.euqiTarget } },
    onError: (err) =>
    {
      noticeUserError('ADS Query result', err?.message);
    }
  });
  const [visibleFirmDetailModal, setVisibleFirmDetailModal] = React.useState(false);
  const [detailFirmId, setDetailFirmId] = React.useState();
  // adList: undefined,
  // isVisibleDetailModal: false
  // isEmptyAdlist,
  // detailFirmId
  /**
   * Admob 광고 요청 실패 팝업
   */

  const adList = adsRsp?.data?.ads || [];

  // Loading
  if (adsRsp.loading)
  {
    return (
      <Container>
        <JBActIndicator title="광고 불러오는중..." size="large" />
      </Container>
    );
  }

  if (props.admob && adList.length === 0)
  {
    if (Platform.OS === 'web')
    {
      return null;
    }
    const unitID = props.admobUnitID || 'ca-app-pub-9415708670922576/6931111723';

    const bannerSize = props.admonSize || 'largeBanner';

    return (
      <AdMobContainer height={props.admonHeight}>
        <AdMobBanner
          bannerSize={bannerSize}
          adUnitID={unitID} // Test ID, Replace with your-admob-unit-id
          testDeviceID="EMULATOR"
          onDidFailToReceiveAdWithError={() => <BugReport title="구글 광고 요청에 실패 했습니다" />}
        />
      </AdMobContainer>
    );
  }

  if (adList === null)
  {
    return <BugReport title="광고 요청에 실패 했습니다" />;
  }

  const adViewList = adList.map((ad, index) => (
    <View style={styles.slide} key={index}>
      <JangbeeAd
        ad={ad}
        openFirmDetail={(accountId): void =>
        {
          setDetailFirmId(accountId);
          setVisibleFirmDetailModal(true);
        }}
      />
    </View>
  ));

  return (
    <Container>
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
;
