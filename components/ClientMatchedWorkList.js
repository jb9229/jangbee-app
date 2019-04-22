import React from 'react';
import { FlatList, View } from 'react-native';
import JBActIndicator from './organisms/JBActIndicator';
import JBEmptyView from './organisms/JBEmptyView';
import ClientMatchedWorkItem from './organisms/ClientMatchedWorkItem';
import ListSeparator from './molecules/ListSeparator';

/**
 * 리스트 아이템 렌더링 함수
 */
function renderItem({ item }, estimateFirm, openMatchedFirmInfo) {
  return (
    <ClientMatchedWorkItem
      item={item}
      estimateFirm={estimateFirm}
      openMatchedFirmInfo={openMatchedFirmInfo}
    />
  );
}

export default function ClientMatchedWorkList({
  isListEmpty,
  list,
  handleRefresh,
  refreshing,
  estimateFirm,
  openMatchedFirmInfo,
}) {
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
    <View>
      <FlatList
        data={list}
        renderItem={item => renderItem(item, estimateFirm, openMatchedFirmInfo)}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={ListSeparator}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />
    </View>
  );
}
