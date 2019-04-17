import React from 'react';
import { FlatList, View } from 'react-native';
import ListSeparator from './molecules/ListSeparator';
import FirmWorkingListItem from './organisms/FirmWorkingListItem';

/**
 * 리스트 아이템 렌더링 함수
 */
function renderItem({ item }) {
  return <FirmWorkingListItem item={item} />;
}

export default function FirmWorkingList({ list, handleRefresh, refreshing }) {
  return (
    <View>
      <FlatList
        data={list}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={ListSeparator}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />
    </View>
  );
}
