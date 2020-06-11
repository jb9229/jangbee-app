import * as React from 'react';

import { KeyboardAvoidingView, Platform, View } from 'react-native';
import styled, { DefaultTheme, withTheme } from 'styled-components/native';

import ActivityIndicator from 'atoms/ActivityIndicator';
import ClientEvaluCreateModal from 'templates/ClientEvaluCreateModal';
import ClientEvaluDetailModal from 'templates/ClientEvaluDetailModal';
import ClientEvaluLikeModal from 'templates/ClientEvaluLikeModal';
import ClientEvaluUpdateModal from 'templates/ClientEvaluUpdateModal';
import { EvaluListType } from 'src/container/firmHarmCase/FirmHarmCaseProvider';
import FirmHarmCaseHeader from 'organisms/FirmHarmCaseHeader';
import FirmHarmCaseItem from 'organisms/FirmHarmCaseItem';
import { GiftedChat } from 'react-native-gifted-chat';
import JBButton from 'molecules/JBButton';
import { MaterialIcons } from '@expo/vector-icons';
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
const NotExitButWrap = styled.View`
  height: 80;
  justify-content: center;
`;
const NoticeEmptyList = styled.Text`
  font-family: ${(props: StyleProps): string => props.theme.FontBatang};
  text-align: center;
`;

interface Props{
  theme: DefaultTheme;
}
const FirmHarmCaseLayout: React.FC<Props> = (props): React.ReactElement =>
{
  const {
    user, firm, searchArea, searchWord, searchTime, searchNotice, countData, cliEvaluList, evaluListType,
    setSearchArea, setSearchWord, onClickMyEvaluList, onClickNewestEvaluList, searchFilterCliEvalu,
    openUpdateCliEvaluForm,
    openDetailModal,
    deleteCliEvalu,
    openCliEvaluLikeModal,
    updateEvalu, detailEvalu,
    evaluLikeSelected, evaluLikeList, createClientEvaluLike, cancelClientEvaluLike, mineEvaluation,
    visibleCreateModal, visibleUpdateModal, visibleDetailModal, visibleEvaluLikeModal,
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
      {!chatMode && (
        <FirmHarmCaseHeader
          searchArea={searchArea}
          searchWord={searchWord}
          searchNotice={searchNotice}
          countData={countData}
          evaluListType={evaluListType}
          setSearchArea={setSearchArea}
          setSearchWord={setSearchWord}
          onClickMyEvaluList={onClickMyEvaluList}
          onClickNewestEvaluList={onClickNewestEvaluList}
          setVisibleCreateModal={setVisibleCreateModal}
          searchFilterCliEvalu={searchFilterCliEvalu}/>
      )}
      {!chatMode && evaluListType !== EvaluListType.NONE && (!cliEvaluList ? <ActivityIndicator /> : cliEvaluList.length === 0
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
          <Swiper showsPagination={false} showsButtons={true}
            prevButton={<MaterialIcons name="navigate-before" size={30} color={props.theme.ColorBtnPrimary} />}
            nextButton={<MaterialIcons name="navigate-next" size={30} color={props.theme.ColorBtnPrimary} />}
          >
            {cliEvaluList.map((item) => renderCliEvaluItem(item))}
          </Swiper>
        ))}
      {!!chatMessge && (
        <View style={{ flex: 1, height: 200 }}>
          <GiftedChat
            messages={chatMessge}
            onSend={(messages) => { senChatMessage(messages) }}
            user={{
              _id: firm?.accountId
            }}
            placeholder="입력해 주세요.."
            dateFormat="l"
            renderUsernameOnMessage={true}
            style={{ backgroundColor: 'red' }}
          />
          {
            Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />
          }
        </View>
      )}
      {/* <JangbeeAdList
        admob
        admobUnitID="ca-app-pub-9415708670922576/2793380882"
        admonSize="fullBanner"
        admonHeight="60"
      /> */}
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
};

FirmHarmCaseLayout.defaultProps = {
  isLoading: true
};

export default withTheme(FirmHarmCaseLayout);
