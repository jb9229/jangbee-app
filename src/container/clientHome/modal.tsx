import * as React from 'react'
import styled from 'styled-components/native';
import JangbeeAdList from 'src/components/organisms/JangbeeAdList';
import { DefaultNavigationProps } from 'src/types';
import GPSSearchScreen from 'screens/GPSSearchScreen';
import FirmCntChart from 'templates/FirmCntChart';
import adLocation from 'constants/AdLocation';
import HeaderClose from 'src/components/molecules/HeaderClose';
import { BackHandler } from 'react-native';

const Container = styled.View`flex: 1;`;
const ScrollView = styled.ScrollView`flex: 1;`;

interface Props {
    navigation: DefaultNavigationProps;
};

const ClientHomeModalContainer:React.FC<Props> = (props): React.ReactElement => {
    // 안드로이드 백버튼 대응
    React.useEffect(() => {
        // android back button listener
        const onBackbutton = (): boolean => { props.navigation.goBack(); return true };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackbutton);

        return (): void => backHandler.remove();
    }, []);

    return(
        <Container>
            <HeaderClose title="화주 앱 화면" onClick={() => { props.navigation.goBack() }}/>
            <ScrollView>
                <JangbeeAdList adLocation={adLocation.main} navigation={props.navigation} />
                <GPSSearchScreen {...props} />
                <FirmCntChart />
            </ScrollView>
        </Container>
    )
}

export default ClientHomeModalContainer;