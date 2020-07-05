import * as api from 'api/api';

import { Alert, StyleSheet, View } from 'react-native';

import { AdMobBanner } from 'expo-ads-admob';
import BugReport from 'organisms/BugReport';
import FirmDetailModal from 'templates/FirmDetailModal';
import JBActIndicator from 'molecules/JBActIndicator';
import JangbeeAd from 'molecules/JangbeeAd';
import React from 'react';
import Swiper from 'react-native-swiper';
import styled from 'styled-components/native';

const styles = StyleSheet.create({
  container: {
    height: 200
  },
  wrapper: {
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const AdMobContainer = styled.View`
  height: ${props => (props.height ? props.height : '120')};
  align-items: center;
  justify-content: center;
`;

export default class JangbeeAdList extends React.Component
{
  _isMounted = false;

  constructor (props)
  {
    super(props);
    this.state = {
      adList: undefined,
      isVisibleDetailModal: false
    };
  }

  componentDidMount ()
  {
    this._isMounted = true;

    const {
      adLocation,
      euqiTarget,
      sidoTarget,
      gugunTarget,
      admob
    } = this.props;

    if (!admob)
    {
      this.setAdList(adLocation, euqiTarget, sidoTarget, gugunTarget);
    }
  }

  componentWillReceiveProps (nextProps)
  {
    const {
      admob,
      adLocation,
      euqiTarget,
      sidoTarget,
      gugunTarget
    } = this.props;

    if (!admob && nextProps.adLocation !== adLocation)
    {
      this.setAdList(nextProps.adLocation, euqiTarget, sidoTarget, gugunTarget);
    }
  }

  componentWillUnmount ()
  {
    this._isMounted = false;
  }

  /**
   * 광고 리스트 설정
   * @param adLocation 광고위치(MAIN, LOCAL, EQUIPMENT)
   * @param euqiTarket 타켓 광고할 선택장비
   */
  setAdList = (adLocation, euqiTarget, sidoTarget, gugunTarget) =>
  {
    api
      .getAd(adLocation, euqiTarget, sidoTarget, gugunTarget)
      .then(jsonRes =>
      {
        if (!this._isMounted)
        {
          return;
        }

        if (jsonRes != null && jsonRes.length === 0)
        {
          this.setState({ isEmptyAdlist: true });
          return;
        }
        this.setState({ isEmptyAdlist: false, adList: jsonRes });
      })
      .catch(error =>
      {
        if (!this._isMounted)
        {
          return;
        }

        Alert.alert(
          '광고리스트 요청에 문제가 있습니다',
          `다시 시도해 주세요 -> [${error.name}] ${error.message}`
        );
        this.setState({ adList: null });
      });
  };

  /**
   * Admob 광고 요청 실패 팝업
   */
  renderAdmobError = () => <BugReport title="구글 광고 요청에 실패 했습니다" />;

  render ()
  {
    const { admob, admobUnitID, admonSize, admonHeight } = this.props;
    const {
      adList,
      isEmptyAdlist,
      isVisibleDetailModal,
      detailFirmId
    } = this.state;

    if (admob || isEmptyAdlist)
    {
      const unitID = admobUnitID || 'ca-app-pub-9415708670922576/6931111723';

      const bannerSize = admonSize || 'largeBanner';
      return (
        <AdMobContainer height={admonHeight}>
          <AdMobBanner
            bannerSize={bannerSize}
            adUnitID={unitID} // Test ID, Replace with your-admob-unit-id
            testDeviceID="EMULATOR"
            onDidFailToReceiveAdWithError={this.renderAdmobError}
          />
        </AdMobContainer>
      );
    }

    if (adList === undefined)
    {
      return (
        <View style={styles.container}>
          <JBActIndicator title="광고 불러오는중..." size="large" />
        </View>
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
          openFirmDetail={accountId =>
            this.setState({
              detailFirmId: accountId,
              isVisibleDetailModal: true
            })
          }
        />
      </View>
    ));

    return (
      <View style={styles.container}>
        <FirmDetailModal
          isVisibleModal={isVisibleDetailModal}
          accountId={detailFirmId}
          closeModal={() => this.setState({ isVisibleDetailModal: false })}
        />
        <Swiper
          style={styles.wrapper}
          autoplay={true}
          autoplayTimeout={3.5}
          dotStyle={{ marginBottom: 0 }}
          activeDotStyle={{ marginBottom: 0 }}
          // onIndexChanged={() => Alert.alert('chan')}
        >
          {adViewList}
        </Swiper>
      </View>
    );
  }
}
