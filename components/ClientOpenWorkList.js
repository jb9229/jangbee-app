import React from 'react';
import { FlatList, View } from 'react-native';
import JBActIndicator from './organisms/JBActIndicator';
import JBEmptyView from './organisms/JBEmptyView';
import ListSeparator from './molecules/ListSeparator';
import ClientOpenWorkItem from './organisms/ClientOpenWorkItem';

/**
 * 리스트 아이템 렌더링 함수
 */
function renderItem({ item }, selectFirm) {
  return <ClientOpenWorkItem item={item} selectFirm={selectFirm} />;
}

export default function ClientOpenWorkList({
  isListEmpty,
  list,
  handleRefresh,
  refreshing,
  registerWork,
  selectFirm,
}) {
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
        renderItem={item => renderItem(item, selectFirm)}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={ListSeparator}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />
    </View>
  );
}
