import * as React from 'react';

import { ADS } from './api/queries';
import { FIRMHARMCASE_COUNT } from './api/queries';
import JangbeeAd from 'molecules/JangbeeAd';
import Swiper from 'react-native-swiper/src';
import { noticeUserError } from './container/request';
import styled from 'styled-components/native';
import { useQuery } from '@apollo/client';

const Container = styled.View``;
const Count = styled.Text``;
const Slide = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ApolloWebTest: React.FC = (): React.ReactElement =>
{
  const adsRsp = useQuery(ADS, {
    variables: { searchAdParams: { adType: 5, adLocation: 0 } },
    onError: (err) =>
    {
      noticeUserError('ADS Query result', err?.message);
    }
  });
console.log('>>> adsRsp?.data?.ads:', adsRsp?.data?.ads)
  const adViewList = adsRsp?.data?.ads ? adsRsp.data.ads.map((ad, index) => (
    <Slide key={index}>
      <JangbeeAd
        ad={ad}
      />
    </Slide>
  )) : [];

  return (
    <Container>
      <Swiper
        autoplay={true}
        autoplayTimeout={3.5}
        dotStyle={{ marginBottom: 0 }}
        activeDotStyle={{ marginBottom: 0 }}
        // onIndexChanged={() => Alert.alert('chan')}
      >
        {adViewList}
      </Swiper>
    </Container>
  );
};

export default ApolloWebTest;
