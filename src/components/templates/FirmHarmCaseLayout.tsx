import * as React from 'react';

import { KeyboardAvoidingView, Platform, View } from 'react-native';
import styled, { DefaultTheme, withTheme } from 'styled-components/native';

import ActivityIndicator from 'atoms/ActivityIndicator';
import ClientEvaluCreateModal from 'src/components/templates/FirmHarmCaseCreateLayout';
import { EvaluListType } from 'src/container/firmHarmCase/type';
import FirmHarmCaseHeader from 'organisms/FirmHarmCaseHeader';
import FirmHarmCaseItem from 'organisms/FirmHarmCaseItem';
import { GiftedChat } from 'react-native-gifted-chat';
import JBButton from 'molecules/JBButton';
import JangbeeAdList from '../organisms/JangbeeAdList';
import { MaterialIcons } from '@expo/vector-icons';
import RoundButton from '../atoms/button/RoundButton';
import { SearchBar } from 'react-native-elements';
import Swiper from 'react-native-swiper';
import colors from 'constants/Colors';
import getString from 'src/STRING';
import { shareNotExistCEvalu } from 'common/JBCallShare';
import { useFirmHarmCaseContext } from 'src/contexts/FirmHarmCaseContext';

interface StyleProps {
  theme: DefaultTheme;
}
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
  border-radius: 8;
`;

const NotExitButWrap = styled.View`
  height: 80;
  justify-content: center;
`;
const NoticeEmptyList = styled.Text`
  font-family: ${(props: StyleProps): string => props.theme.FontBatang};
  text-align: center;
`;
const HelloWrap = styled.View``;
const HelloText = styled.Text`
 font-family: ${(props) => props.theme.FontTitleTop};
 font-size: 23;
`;
const HelloTextWrap = styled.View`
  flex-direction: row;
`;
const HelloPointText = styled.Text`
  font-family: ${(props) => props.theme.FontTitleTop};
  font-size: 23;
  color: ${(props) => props.theme.ColorPrimaryDark};
`;
const FirmHarmCaseAddBtn = styled(RoundButton).attrs(() => ({
  wrapperStyle: {
    height: 50,
    borderRadius: 50,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 11,
    paddingBottom: 11
  }
}))``;

interface Props{
  theme: DefaultTheme;
}
const FirmHarmCaseLayout: React.FC<Props> = (props): React.ReactElement =>
{
  const {
    navigation, user, searchArea, searchTime, searchNotice, countData, evaluListType,
    onClickSearch, onClickAddFirmHarmCase, onClickMyEvaluList, onClickNewestEvaluList, searchFilterCliEvalu,
    openUpdateCliEvaluForm,
    openDetailModal,
    deleteCliEvalu,
    openCliEvaluLikeModal,
    updateEvalu,
    evaluLikeSelected, evaluLikeList, createClientEvaluLike, cancelClientEvaluLike, mineEvaluation,
    visibleCreateModal,
    setVisibleCreateModal, setVisibleUpdateModal, setVisibleDetailModal, closeEvaluLikeModal,
    setClinetEvaluList,
    chatMessge, senChatMessage
  } = useFirmHarmCaseContext();
  const [chatMode, setChatMode] = React.useState(false);
  /**
   * 피해사례 아이템 UI 렌더링 함수
   */
  const renderCliEvaluItem = (item) =>
  {
    return (
      <FirmHarmCaseItem
        item={item}
        accountId={user.uid}
        updateCliEvalu={openUpdateCliEvaluForm}
        deleteCliEvalu={deleteCliEvalu}
        openCliEvaluLikeModal={openCliEvaluLikeModal}
        openDetailModal={evalu => openDetailModal(evalu)}
        searchTime={searchTime}
      />
    );
  };

  return (
    <Container>
      <Header>
        <HelloWrap>
          <HelloText>안녕하세요.</HelloText>
          <HelloTextWrap>
          <HelloText>장비대금</HelloText>
            <HelloPointText> 체불이 </HelloPointText>
            <HelloText>발생 했나요?</HelloText>
          </HelloTextWrap>
        </HelloWrap>
        <FirmHarmCaseAddBtn text="피해사례 등록하기" onClick={onClickAddFirmHarmCase} />
      </Header>
      <Contents>
        <FirmHarmCaseHeader
          searchArea={searchArea}
          searchNotice={searchNotice}
          countData={countData}
          evaluListType={evaluListType}
          onClickSearch={onClickSearch}
          onClickMyEvaluList={onClickMyEvaluList}
          onClickNewestEvaluList={onClickNewestEvaluList}
          setVisibleCreateModal={setVisibleCreateModal}
          searchFilterCliEvalu={searchFilterCliEvalu}/>
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
