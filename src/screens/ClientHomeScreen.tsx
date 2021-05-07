import * as Notifications from 'expo-notifications';
import * as React from 'react';

import { Alert, BackHandler, DeviceEventEmitter, Platform } from 'react-native';

import { AdLocation } from 'src/container/ad/types';
import { ClientBottomTabParamList } from 'src/navigation/types';
import FirmCntChart from 'templates/FirmCntChart';
import GPSSearchScreen from 'screens/GPSSearchScreen';
import JBTerm from 'templates/JBTerm';
import JangbeeAdList from 'organisms/JangbeeAdList';
import { StackNavigationProp } from '@react-navigation/stack';
import { Subscription } from 'src/apollo/generated';
import colors from 'constants/Colors';
import registerForPushNotificationsAsync from 'src/common/registerForPushNotificationsAsync';
import styled from 'styled-components/native';
import { useLoginContext } from 'src/contexts/LoginContext';

const Container = styled.ScrollView`
  background-color: ${colors.batangLight};
`;

interface Props {
  navigation: StackNavigationProp<ClientBottomTabParamList, 'ClientHome'>;
  screenProps: any;
}
const ClientHomeScreen: React.FC<Props> = props => {
  return (
    <Container>
      <JangbeeAdList
        adLocation={AdLocation.MAIN}
        navigation={props.navigation}
      />
      <GPSSearchScreen {...props} />
      <FirmCntChart />
      <JBTerm />
    </Container>
  );
};

export default ClientHomeScreen;
