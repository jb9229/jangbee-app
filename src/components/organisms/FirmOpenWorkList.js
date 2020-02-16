import { FlatList } from 'react-native';
import JBActIndicator from 'molecules/JBActIndicator';
import JBButton from 'molecules/JBButton';
import JBEmptyView from 'organisms/JBEmptyView';
import React from 'react';
import Styled from 'styled-components/native';
import WorkCommText from 'molecules/WorkCommTextUI';
import WorkCommWrap from 'molecules/WorkCommWrapUI';
import WorkItem from 'organisms/WorkItem';

const CommWrap = Styled.View`
  flexDirection: row;
`;

export default class FirmWorkingList extends React.PureComponent {
  /**
   * 리스트 아이템 렌더링 함수
   */
  renderItem = ({ item }) => (
    <WorkItem
      item={item}
      renderCommand={() => this.renderCommand(item)}
      hideAddress
      cardColor="white"
    />
  );

  renderCommand = item => {
    const {
      applyWork,
      applyFirmWork,
      abandonWork,
      acceptWork,
      accountId
    } = this.props;

    if (item.firmRegister && item.accountId === accountId) {
      return (
        <WorkCommWrap>
          <WorkCommText text="내가올린 일감" />
        </WorkCommWrap>
      );
    }

    return (
      <WorkCommWrap>
        {item.workState === 'OPEN' && !item.applied && !item.firmRegister && (
          <JBButton
            title="지원하기"
            onPress={() => applyWork(item.id)}
            size="small"
          />
        )}
        {item.workState === '' &&
          !item.applied &&
          item.firmRegister &&
          !item.guarTimeExpire && (
            <JBButton
              title="차주일감 지원하기(선착순 바로매칭)"
              onPress={() => applyFirmWork(item)}
              size="small"
            />
          )}
        {item.workState === 'OPEN' &&
          !item.applied &&
          item.firmRegister &&
          item.guarTimeExpire && (
            <WorkCommText text="차주일감 매칭시간 만료됨" />
          )}
        {item.workState === 'OPEN' && item.applied && (
          <WorkCommText text="지원중.." />
        )}
        {item.workState === 'SELECTED' && (
          <CommWrap>
            <JBButton
              title="포기하기"
              onPress={() => abandonWork(item.id)}
              size="small"
              Secondary
            />
            <JBButton
              title="수락하기"
              onPress={() => acceptWork(item.id)}
              size="small"
              Primary
            />
          </CommWrap>
        )}
      </WorkCommWrap>
    );
  };

  render() {
    const { list, isListEmpty, handleRefresh, refreshing } = this.props;

    if (isListEmpty === undefined) {
      return <JBActIndicator title="정보를 불러오는 중.." size={35} />;
    }

    if (isListEmpty) {
      return (
        <JBEmptyView
          title="현재 일감 리스트가 비어 있습니다,"
          subTitle="다시 조회해 보세요"
          refresh={handleRefresh}
        />
      );
    }

    return (
      <FlatList
        data={list}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => index.toString()}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />
    );
  }
}
