import * as React from 'react';

import styled, { DefaultTheme, withTheme } from 'styled-components/native';

import FirmHarmCaseHeader from 'organisms/FirmHarmCaseHeader';
import FirmHarmCaseItem from 'organisms/FirmHarmCaseItem';
import RoundButton from '../atoms/button/RoundButton';
import colors from 'constants/Colors';
import { firmHarmCaseCountUserId } from 'src/container/firmHarmCase/store';
import { useFirmHarmCaseContext } from 'src/contexts/FirmHarmCaseContext';
import { useSetRecoilState } from 'recoil';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.batangLight};
`;
const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-left: 20;
  margin-right: 10;
  margin-top: 40;
`;
const Contents = styled.View`
  flex: 1;
  justify-content: center;
`;

// SearchWrap
const SearchWrap = styled.View`
  margin: 10px;
  background-color: ${(props): string => props.theme.ColorBGDarkGray};
  border-radius: 8px;
`;
const HelloWrap = styled.View``;
const HelloText = styled.Text`
  font-family: ${props => props.theme.FontTitleTop};
  font-size: 23;
`;
const HelloTextWrap = styled.View`
  flex-direction: row;
`;
const HelloPointText = styled.Text`
  font-family: ${props => props.theme.FontTitleTop};
  font-size: 23;
  color: ${props => props.theme.ColorPrimaryDark};
`;
const FirmHarmCaseAddBtn = styled(RoundButton).attrs(() => ({
  wrapperStyle: {
    height: 50,
    borderRadius: 50,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 11,
    paddingBottom: 11,
  },
}))``;

interface Props {
  theme: DefaultTheme;
}
const FirmHarmCaseLayout: React.FC<Props> = (props): React.ReactElement => {
  const {
    user,
    searchArea,
    searchTime,
    searchNotice,
    countData,
    onClickSearch,
    onClickAddFirmHarmCase,
    onClickMyEvaluList,
    onClickNewestEvaluList,
    searchFilterCliEvalu,
    openUpdateCliEvaluForm,
    openDetailModal,
    deleteCliEvalu,
    openCliEvaluLikeModal,
    onClickTotalEvaluList,
    setVisibleCreateModal,
  } = useFirmHarmCaseContext();
  const [chatMode, setChatMode] = React.useState(false);
  const [rerender, setRerender] = React.useState(false);
  const setFirmHarmCaseCountUserId = useSetRecoilState(firmHarmCaseCountUserId);
  // const resetList = useResetRecoilState(firmHarmCaseCountState);
  // const resetList = useSetRecoilState(firmHarmCaseCountState);

  /**
   * 피해사례 아이템 UI 렌더링 함수
   */
  const renderCliEvaluItem = item => {
    return (
      <FirmHarmCaseItem
        item={item}
        accountId={user.uid}
        updateCliEvalu={openUpdateCliEvaluForm}
        deleteCliEvalu={deleteCliEvalu}
        openCliEvaluLikeModal={openCliEvaluLikeModal}
        openDetailModal={(evalu): void => openDetailModal(evalu)}
        searchTime={searchTime}
      />
    );
  };

  return (
    <Container>
      <Header>
        <HelloWrap>
          {/* <Button title="re-render" onPress={() => {const data = fetchData(); console.log(data); resetList(data) }} /> */}
          <HelloText>안녕하세요.</HelloText>
          <HelloTextWrap>
            <HelloText>장비대금</HelloText>
            <HelloPointText> 체불이 </HelloPointText>
            <HelloText>발생 했나요?</HelloText>
          </HelloTextWrap>
        </HelloWrap>
        <FirmHarmCaseAddBtn
          text="피해사례 등록하기"
          onClick={onClickAddFirmHarmCase}
        />
      </Header>
      <Contents>
        <FirmHarmCaseHeader
          searchArea={searchArea}
          searchNotice={searchNotice}
          countData={countData}
          onClickSearch={onClickSearch}
          onClickMyEvaluList={onClickMyEvaluList}
          onClickNewestEvaluList={onClickNewestEvaluList}
          setVisibleCreateModal={setVisibleCreateModal}
          searchFilterCliEvalu={searchFilterCliEvalu}
          onClickTotalEvaluList={onClickTotalEvaluList}
        />
        <SearchWrap>
          {/* <SearchTO onPress={() => navigation.navigate("FirmHarmCaseSearch")}>
            <MaterialCommunityIcons name="account-search" size={34} color="black" />
            <SearchText>피해사례를 조회해 드릴게요.</SearchText>
          </SearchTO> */}
        </SearchWrap>
      </Contents>
      {/* <JangbeeAdList
        admob
        admobUnitID="ca-app-pub-9415708670922576/2793380882"
        admonSize="fullBanner"
        admonHeight="60"
      /> */}
    </Container>
  );
};

export default withTheme(FirmHarmCaseLayout);
