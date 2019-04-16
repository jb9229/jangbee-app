import React from 'react';
import { FlatList, View } from 'react-native';
import ListSeparator from '../molecules/ListSeparator';
import Item from './JBListItem';

/**
 * 리스트 아이템 렌더링 함수
 */
function renderItem({ item }) {
  console.log(item);
  return <Item item={item} />;
}

export default function FirmWorkingList({ list }) {
  return (
    <View>
      <FlatList
        data={list}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={ListSeparator}
      />
    </View>
  );
}
