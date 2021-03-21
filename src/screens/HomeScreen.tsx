import * as React from 'react';

import { AdLocation } from 'src/container/ad/types';
import { BackHandler } from 'react-native';
import { DefaultNavigationProps } from 'src/types';
import FirmCntChart from 'templates/FirmCntChart';
import GPSSearchScreen from 'screens/GPSSearchScreen';
import JangbeeAdList from 'organisms/JangbeeAdList';
import colors from 'constants/Colors';
import { onPressBackbutton } from 'src/container/action';
import styled from 'styled-components/native';
import { useLoginContext } from 'src/contexts/LoginContext';
import { useScanAppVersionQuery } from 'src/apollo/generated';

const Container = styled.ScrollView`
  background-color: ${colors.batangLight};
`;

interface Props {
  navigation: DefaultNavigationProps;
  screenProps: any;
}
const HomeScreen: React.FC<Props> = props => {
  // states
  const { userProfile } = useLoginContext();

  // server data
  const scanAppVersionRsp = useScanAppVersionQuery();

  // component life cycle
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onPressBackbutton
    );

    return (): void => backHandler.remove();
  });

  return (
    <Container>
      <JangbeeAdList
        adLocation={AdLocation.MAIN}
        navigation={props.navigation}
      />
      <GPSSearchScreen {...props} />
      <FirmCntChart />
    </Container>
  );
};

export default HomeScreen;
