import * as React from 'react';

import ActivityIndicator from 'atoms/ActivityIndicator';
import CountBoard from 'organisms/CountBoard';
import { StyleSheet } from 'react-native';
import colors from 'constants/Color';
import fonts from 'constants/Fonts';
import styled from 'styled-components/native';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.batangLight};
  align-items: center;
  justify-content: center;
`;
const LoadingContainer = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
`;
const CounterContainer = styled.SafeAreaView`
  width: 90%;
  aspect-ratio: 4;
`;

const NotExitButWrap = styled.View`
  flex: 1;
  justify-content: center;
  border-width: 1;
`;

interface Props {
  counter?: [];
  listEmpty?: boolean;
  list?: [];
  isLoading: boolean;
}

export default function FirmHarmCaseLayout (props: Props): React.ReactElement {
  if (props.isLoading) {
    return (
      <LoadingContainer>
        <ActivityIndicator />
      </LoadingContainer>
    );
  }

  if (!props.list) {
    return (
      <Container>
        <CounterContainer>
          <CountBoard data={props.counter} />
        </CounterContainer>
      </Container>
    );
  }

  if (props.listEmpty) {
    <NotExitButWrap>
      <JBButton
        title={`'${searchedWord}' 피해사례 없음 공유`}
        onPress={() => shareNotExistCEvalu(searchArea, searchWord, searchTime)}
        align="center"
        Secondary
      />
    </NotExitButWrap>;
  }

  return (
    <Container>
      <FlatList
        data={cliEvaluList}
        renderItem={this.renderCliEvaluItem}
        keyExtractor={(item, index) => index.toString()}
        last={isLastList}
        onEndReached={this.handleLoadMore}
        onEndReachedThreshold={2}
      />
      <JangbeeAdList
        admob
        admobUnitID="ca-app-pub-9415708670922576/2793380882"
        admonSize="fullBanner"
        admonHeight="60"
      />
      <ClientEvaluCreateModal
        isVisibleModal={isVisibleCreateModal}
        accountId={user.uid}
        closeModal={() => this.setState({ isVisibleCreateModal: false })}
        completeAction={() => this.setClinetEvaluList()}
        size="full"
      />
      <ClientEvaluUpdateModal
        updateEvalu={updateEvalu}
        isVisibleModal={isVisibleUpdateModal}
        closeModal={() => this.setState({ isVisibleUpdateModal: false })}
        completeAction={() => this.setClinetEvaluList()}
      />
      <ClientEvaluDetailModal
        isVisibleModal={isVisibleDetailModal}
        detailEvalu={detailEvalu}
        closeModal={() => this.setState({ isVisibleDetailModal: false })}
        completeAction={() => {}}
        size="full"
        searchTime={searchTime}
      />
      <ClientEvaluLikeModal
        isVisibleModal={isVisibleEvaluLikeModal}
        accountId={user.uid}
        evaluation={evaluLikeSelected}
        evaluLikeList={evaluLikeList}
        createClientEvaluLike={this.createClientEvaluLike}
        cancelClientEvaluLike={this.cancelClientEvaluLike}
        closeModal={refresh => this.closeEvaluLikeModal(refresh)}
        isMine={isMineEvaluation}
      />
    </Container>
  );
}

FirmHarmCaseLayout.defaultProps = {
  isLoading: true
};
