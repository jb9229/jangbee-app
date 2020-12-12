import { FlatList, View } from 'react-native';

import JBActIndicator from 'molecules/JBActIndicator';
import JBButton from 'molecules/JBButton';
import JBEmptyView from 'organisms/JBEmptyView';
import React from 'react';
import WorkCommText from 'molecules/WorkCommTextUI';
import WorkCommWrap from 'molecules/WorkCommWrapUI';
import WorkItem from 'organisms/WorkItem';

export default class ClientMatchedWorkList extends React.PureComponent {
  /**
   * 리스트 아이템 렌더링 함수
   */
  renderItem = ({ item }) => (
    <WorkItem item={item} renderCommand={() => this.renderCommand(item)} />
  );

  renderCommand = item => {
    const { openMatchedFirmInfo, estimateFirm } = this.props;

    return (
      <WorkCommWrap>
        {item.workState === 'MATCHED' && (
          <JBButton
            title="매칭된 업체정보 보기"
            onPress={() => openMatchedFirmInfo(item.matchedAccId)}
            size="small"
            underline
            Secondary
          />
        )}
        {item.workState === 'WORKING' && <WorkCommText text="시작됨" />}
        {item.workState === 'CLOSED' && !item.firmEstimated && (
          <JBButton
            title="업체평가하기"
            onPress={() => estimateFirm(item.id)}
            size="small"
          />
        )}
        {item.workState === 'CLOSED' && item.firmEstimated && (
          <WorkCommText text="종료됨" />
        )}
      </WorkCommWrap>
    );
  };

  render() {
    const { isListEmpty, list, handleRefresh, refreshing } = this.props;

    if (isListEmpty === undefined) {
      return <JBActIndicator title="정보를 불러오는 중.." size={35} />;
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
      <View>
        <FlatList
          data={list}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
      </View>
    );
  }
}
