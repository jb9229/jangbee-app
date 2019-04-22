import React from 'react';
import { FlatList, View } from 'react-native';
import JBActIndicator from './organisms/JBActIndicator';
import JBEmptyView from './organisms/JBEmptyView';
import ListSeparator from './molecules/ListSeparator';
import WorkItem from './organisms/WorkItem';
import JBButton from './molecules/JBButton';
import WorkCommWrap from './molecules/WorkCommWrapUI';
import WorkCommText from './molecules/WorkCommTextUI';

export default class ClientOpenWorkList extends React.PureComponent {
  /**
   * 리스트 아이템 렌더링 함수
   */
  renderItem = ({ item }) => (
    <WorkItem item={item} renderCommand={() => this.renderCommand(item)} />
  );

  renderCommand = (item) => {
    const { selectFirm } = this.props;

    return (
      <WorkCommWrap>
        {item.workState === 'OPEN' && item.applicantCount === 0 && (
          <WorkCommText text="지원자 모집중..." />
        )}
        {item.workState === 'OPEN' && item.applicantCount > 0 && (
          <JBButton
            title={`지원자 선택하기(${item.applicantCount}명)`}
            onPress={() => selectFirm(item.id)}
            size="small"
          />
        )}
        {item.workState === 'SELECTED' && (
          <WorkCommText text="업체확인 대기중(확인 후 전화가 옵니다)" />
        )}
      </WorkCommWrap>
    );
  };

  render() {
    const {
      isListEmpty, list, handleRefresh, refreshing, registerWork,
    } = this.props;

    if (isListEmpty === undefined) {
      return <JBActIndicator title="정보 불러오는중.." size={35} />;
    }

    if (isListEmpty) {
      return (
        <JBEmptyView
          title="검색하고, 전화할 필요 없습니다."
          subTitle="간단히 일감 등록하고, 업무 가능한 업체를 선택 하기만 하면 됩니다."
          refresh={registerWork}
        />
      );
    }
    return (
      <View>
        <FlatList
          data={list}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ListSeparator}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
      </View>
    );
  }
}
