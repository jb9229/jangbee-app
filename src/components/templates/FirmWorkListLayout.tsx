import * as React from 'react';

import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import styled, { DefaultTheme } from 'styled-components/native';

import { DefaultNavigationProps } from 'src/types';
import { Dimensions } from 'react-native';
import FirmMatchedWorkList from 'organisms/FirmMatchedWorkList';
import FirmOpenWorkList from 'organisms/FirmOpenWorkList.tsx';
import JBButton from 'molecules/JBButton';
import { useFirmWorkProvider } from 'src/container/firmwork/FirmWorkProvider';
import { useLoginContext } from 'src/contexts/LoginContext';

interface StyledCProps {
  theme: DefaultTheme;
}
const Container = styled.View`
  flex: 1;
  background-color: ${(props: StyledCProps): string =>
    props.theme.ColorBGLightGray};
`;
const FirmListTabView = styled(TabView)``;
const FirmListTabBar = styled(TabBar).attrs({
  indicatorStyle: { backgroundColor: '#82b6ed' },
  labelStyle: {
    fontFamily: 'SsangmundongGulimB',
    fontWeight: 'bold',
    color: '#fac682',
  },
})`
  background-color: ${(props: StyledCProps): string =>
    props.theme.ColorBGDarkGray};
`;

const BottomWrap = styled.View``;

interface Props {
  navigation: DefaultNavigationProps;
}
const FirmWorkListLayout: React.FC<Props> = props => {
  const { userProfile } = useLoginContext();
  const { matchedWorkList, tabIndex, setTabIndex } = useFirmWorkProvider();
  const [routes] = React.useState([
    { key: 'first', title: '진행중인 일감' },
    { key: 'second', title: '매칭된 일감' },
  ]);

  const renderOpenWorkList = (): React.ReactElement => (
    <FirmOpenWorkList accountId={user ? userProfile.uid : undefined} />
  );

  const renderMatchedWorkList = (): React.ReactElement => (
    <FirmMatchedWorkList
      list={matchedWorkList}
      handleRefresh={(): void =>
        this.setState({ matchedWorkListRefreshing: true }, () =>
          this.setMatchedWorkListData()
        )
      }
    />
  );

  return (
    <Container>
      <FirmListTabView
        navigationState={{ index: tabIndex, routes }}
        renderScene={SceneMap({
          first: renderOpenWorkList,
          second: renderMatchedWorkList,
        })}
        onIndexChange={setTabIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={(props): React.ReactElement => (
          <FirmListTabBar {...props} />
        )}
      />
      <BottomWrap>
        <JBButton
          title="차주 일감 등록하기"
          onPress={(): void =>
            props.navigation.navigate('WorkRegister', { firmRegister: true })
          }
          size="full"
          Primary
        />
      </BottomWrap>
    </Container>
  );
};

export default FirmWorkListLayout;
