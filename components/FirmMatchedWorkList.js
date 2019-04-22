import React from 'react';
import { FlatList } from 'react-native';
import JBActIndicator from './organisms/JBActIndicator';
import JBEmptyView from './organisms/JBEmptyView';
import ListSeparator from './molecules/ListSeparator';
import WorkItem from './organisms/WorkItem';
import WorkCommWrap from './molecules/WorkCommWrapUI';
import WorkCommText from './molecules/WorkCommTextUI';

export default class FirmMatchedWorkList extends React.PureComponent {
  /**
   * 리스트 아이템 렌더링 함수
   */
  renderItem = ({ item }) => (
    <WorkItem item={item} renderCommand={() => this.renderCommand(item)} />
  );

  renderCommand = (item) => {
    const { applyWork, abandonWork, acceptWork } = this.props;

    return (
      <WorkCommWrap>
        {item.workState === 'MATCHED' && <WorkCommText text="매칭됨" />}
        {item.workState === 'WORKING' && <WorkCommText text="시작됨" />}
        {item.workState === 'CLOSED' && <WorkCommText text="종료됨" />}
      </WorkCommWrap>
    );
  };

  render() {
    const {
      isListEmpty, list, handleRefresh, refreshing,
    } = this.props;

    if (isListEmpty === undefined) {
      return <JBActIndicator title="정보 불러오는중.." size={35} />;
    }

    if (isListEmpty) {
      return (
        <JBEmptyView
          title="매칭된 일감 리스트가 비어 있습니다,"
          subTitle="다시 조회해 보세요"
          refresh={handleRefresh}
        />
      );
    }

    return (
      <FlatList
        data={list}
        renderItem={item => this.renderItem(item)}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={ListSeparator}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />
    );
  }
}
