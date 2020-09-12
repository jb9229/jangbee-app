import * as React from 'react';

import { Alert, DeviceEventEmitter, Platform } from 'react-native';

import { DefaultNavigationProps } from 'src/types';
import FirmCntChart from 'templates/FirmCntChart';
import GPSSearchScreen from 'screens/GPSSearchScreen';
import JangbeeAdList from 'organisms/JangbeeAdList';
import adLocation from 'constants/AdLocation';
import colors from 'constants/Colors';
import styled from 'styled-components/native';
import { useLoginContext } from 'src/contexts/LoginContext';

const Container = styled.ScrollView`
  background-color: ${colors.batangLight};
`;

interface Props {
  navigation: DefaultNavigationProps;
  screenProps: any;
}
const HomeScreen: React.FC<Props> = (props) =>
{
  return (
    <Container>
      <JangbeeAdList adLocation={adLocation.main} navigation={props.navigation} />
      <GPSSearchScreen {...props} />
      <FirmCntChart />
    </Container>
  );
};

export default HomeScreen;
