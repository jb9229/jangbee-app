import React from 'react';
import { FlatList, Text, View } from 'react-native';
import JBActIndicator from './organisms/JBActIndicator';
import JBEmptyView from './organisms/JBEmptyView';
import ListSeparator from './molecules/ListSeparator';
import FirmOpenWorkItem from './organisms/FirmOpenWorkItem';

export default class FirmWorkingList extends React.PureComponent {
  /**
   * 리스트 아이템 렌더링 함수
   */
  renderItem = ({ item }, applyWork, acceptWork) => (
    <FirmOpenWorkItem item={item} acceptWork={acceptWork} applyWork={applyWork} />
  );

  render() {
    const {
      list, isListEmpty, handleRefresh, refreshing, applyWork, acceptWork,
    } = this.props;

    if (isListEmpty === undefined) {
      return <JBActIndicator title="정보 불러오는중.." size={35} />;
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
      <View>
        <Text>{isListEmpty}</Text>
        <FlatList
          data={list}
          renderItem={item => this.renderItem(item, applyWork, acceptWork)}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ListSeparator}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
      </View>
    );
  }
}
