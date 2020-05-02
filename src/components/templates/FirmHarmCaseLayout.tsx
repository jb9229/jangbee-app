import * as React from 'react';

import styled, { DefaultTheme } from 'styled-components/native';

import ActivityIndicator from 'atoms/ActivityIndicator';
import ClientEvaluCreateModal from 'templates/ClientEvaluCreateModal';
import ClientEvaluDetailModal from 'templates/ClientEvaluDetailModal';
import ClientEvaluLikeModal from 'templates/ClientEvaluLikeModal';
import ClientEvaluUpdateModal from 'templates/ClientEvaluUpdateModal';
import FirmHarmCaseHeader from 'organisms/FirmHarmCaseHeader';
import FirmHarmCaseItem from 'organisms/FirmHarmCaseItem';
import { FlatList } from 'react-native';
import JBButton from 'molecules/JBButton';
import JangbeeAdList from 'organisms/JangbeeAdList';
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
const HarmCaseList = styled(FlatList).attrs(() => ({
  contentContainerStyle: {
    width: '100%',
    height: 250,
    backgroundColor: 'blue'
  }
}))`
background-color: red;
`;

export default function FirmHarmCaseLayout (): React.ReactElement
{
  const {
    user,
    searchArea,
    searchWord,
    searchTime,
    searchNotice,
    countData,
    cliEvaluList,
    handleLoadMore,
    setSearchArea,
    setSearchWord,
    onClickMyEvaluList,
    onClickNewestEvaluList,
    searchFilterCliEvalu,
    openUpdateCliEvaluForm,
    openDetailModal,
    deleteCliEvalu,
    openCliEvaluLikeModal,
    updateEvalu, detailEvalu,
    evaluLikeSelected, evaluLikeList, createClientEvaluLike, cancelClientEvaluLike, mineEvaluation,
    visibleCreateModal, visibleUpdateModal, visibleDetailModal, visibleEvaluLikeModal,
    setVisibleCreateModal, setVisibleUpdateModal, setVisibleDetailModal, closeEvaluLikeModal,
    setClinetEvaluList
  } = useFirmHarmCaseContext();

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
      <FirmHarmCaseHeader
        searchArea={searchArea}
        searchWord={searchWord}
        searchNotice={searchNotice}
        countData={countData}
        setSearchArea={setSearchArea}
        setSearchWord={setSearchWord}
        onClickMyEvaluList={onClickMyEvaluList}
        onClickNewestEvaluList={onClickNewestEvaluList}
        setVisibleCreateModal={setVisibleCreateModal}
        searchFilterCliEvalu={searchFilterCliEvalu}/>

      {!cliEvaluList ? <ActivityIndicator /> : cliEvaluList.length === 0
        ? (<NotExitButWrap>
          {searchWord ? (
            <JBButton
              title={`'${searchWord}' 피해사례 없음 공유`}
              onPress={(): void => shareNotExistCEvalu(searchArea, searchWord, searchTime)}
              align="center"
              Secondary
            />
          ) : (<NoticeEmptyList>{getString('firmHarmCase.NOTICE_EMPTY_LIST')}</NoticeEmptyList>)}
        </NotExitButWrap>) : (
          <HarmCaseList
            data={cliEvaluList}
            horizontal={true}
            renderItem={({ item }) => renderCliEvaluItem(item)}
            keyExtractor={(item, index) => index.toString()}
            last={false}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={2}
          />)}
      <JangbeeAdList
        admob
        admobUnitID="ca-app-pub-9415708670922576/2793380882"
        admonSize="fullBanner"
        admonHeight="60"
      />
      <ClientEvaluCreateModal
        isVisibleModal={visibleCreateModal}
        accountId={user.uid}
        closeModal={() => setVisibleCreateModal(false)}
        completeAction={() => setClinetEvaluList()}
        size="full"
      />
      <ClientEvaluUpdateModal
        updateEvalu={updateEvalu}
        isVisibleModal={visibleUpdateModal}
        closeModal={() => setVisibleUpdateModal(false)}
        completeAction={() => setClinetEvaluList()}
      />
      <ClientEvaluDetailModal
        isVisibleModal={visibleDetailModal}
        detailEvalu={detailEvalu}
        closeModal={() => setVisibleDetailModal(false)}
        completeAction={() => {}}
        size="full"
        searchTime={searchTime}
      />
      <ClientEvaluLikeModal
        isVisibleModal={visibleEvaluLikeModal}
        accountId={user.uid}
        evaluation={evaluLikeSelected}
        evaluLikeList={evaluLikeList}
        createClientEvaluLike={createClientEvaluLike}
        cancelClientEvaluLike={cancelClientEvaluLike}
        closeModal={refresh => closeEvaluLikeModal(refresh)}
        isMine={mineEvaluation}
      />
    </Container>
  );
}

FirmHarmCaseLayout.defaultProps = {
  isLoading: true
};
