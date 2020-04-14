import * as React from 'react';

import styled, { DefaultTheme } from 'styled-components/native';

import ActivityIndicator from 'atoms/ActivityIndicator';
import CliEvaluItem from 'organisms/CliEvaluItem';
import { FirmHarmCaseCountData } from 'src/types';
import FirmHarmCaseHeader from 'organisms/FirmHarmCaseHeader';
import { FlatList } from 'react-native';
import JBButton from 'molecules/JBButton';
import JangbeeAdList from 'organisms/JangbeeAdList';
import colors from 'constants/Colors';
import getString from 'src/STRING';

interface StyleProps {
  theme: DefaultTheme;
}
const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.batangLight};
`;
const LoadingContainer = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
`;
const NotExitButWrap = styled.View`
  flex: 1;
  justify-content: center;
`;
const NoticeEmptyList = styled.Text`
  font-family: ${(props: StyleProps): string => props.theme.FontBatang};
  text-align: center;
`;

interface Props {
  user: {};
  searchArea: string;
  searchWord: string;
  countData: FirmHarmCaseCountData;
  listEmpty?: boolean;
  list?: [];
  isLastList?: boolean;
  searchTime: string;
  searchNotice: string;
  setSearchArea: (a: string) => void;
  setSearchWord: (w: string) => void;
  handleLoadMore: () => void;
  onClickMyEvaluList: () => void;
  onClickNewestEvaluList: () => void;
  setVisibleCreateModal: (flag: boolean) => void;
  searchFilterCliEvalu: (searchWord: string) => void;
  shareNotExistCEvalu: (searchArea: string, searchWord: string, searchTime: string) => void;
  openDetailModal: (evalu) => void;
  openUpdateCliEvaluForm: () => void;
  deleteCliEvalu: () => void;
  openCliEvaluLikeModal: () => void;
}

export default function FirmHarmCaseLayout (props: Props): React.ReactElement
{
  if (!props.list)
  {
    return (
      <LoadingContainer>
        <ActivityIndicator />
      </LoadingContainer>
    );
  }

  if (props.list.length === 0)
  {
    return (
      <Container>
        <FirmHarmCaseHeader
          searchArea={props.searchArea}
          searchWord={props.searchWord}
          searchNotice={props.searchNotice}
          countData={props.countData}
          setSearchArea={props.setSearchArea}
          setSearchWord={props.setSearchWord}
          onClickMyEvaluList={props.onClickMyEvaluList}
          onClickNewestEvaluList={props.onClickNewestEvaluList}
          setVisibleCreateModal={props.setVisibleCreateModal}
          searchFilterCliEvalu={props.searchFilterCliEvalu}/>
        <NotExitButWrap>
          {props.searchWord ? (
            <JBButton
              title={`'${props.searchWord}' 피해사례 없음 공유`}
              onPress={(): void => props.shareNotExistCEvalu(props.searchArea, props.searchWord, props.searchTime)}
              align="center"
              Secondary
            />
          ) : (<NoticeEmptyList>{getString('firmHarmCase.NOTICE_EMPTY_LIST')}</NoticeEmptyList>)}
        </NotExitButWrap>
      </Container>
    );
  }

  return (
    <Container>
      <FirmHarmCaseHeader
        searchArea={props.searchArea}
        searchWord={props.searchWord}
        searchNotice={props.searchNotice}
        countData={props.countData}
        setSearchArea={props.setSearchArea}
        setSearchWord={props.setSearchWord}
        onClickMyEvaluList={props.onClickMyEvaluList}
        onClickNewestEvaluList={props.onClickNewestEvaluList}
        setVisibleCreateModal={props.setVisibleCreateModal}
        searchFilterCliEvalu={props.searchFilterCliEvalu}/>

      <FlatList
        data={props.list}
        renderItem={({ item }) => renderCliEvaluItem(item, props)}
        keyExtractor={(item, index) => index.toString()}
        last={props.isLastList}
        onEndReached={props.handleLoadMore}
        onEndReachedThreshold={2}
      />
      <JangbeeAdList
        admob
        admobUnitID="ca-app-pub-9415708670922576/2793380882"
        admonSize="fullBanner"
        admonHeight="60"
      />
    </Container>
  );
}

FirmHarmCaseLayout.defaultProps = {
  isLoading: true
};

/**
 * 피해사례 아이템 UI 렌더링 함수
 */
const renderCliEvaluItem = (item, props) =>
{
  return (
    <CliEvaluItem
      item={item}
      accountId={props.uid}
      updateCliEvalu={props.openUpdateCliEvaluForm}
      deleteCliEvalu={props.deleteCliEvalu}
      openCliEvaluLikeModal={props.openCliEvaluLikeModal}
      openDetailModal={evalu => props.openDetailModal(evalu)}
      searchTime={props.searchTime}
    />
  );
};
