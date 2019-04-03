import React from 'react';
import {
  StyleSheet, TouchableHighlight, Text, View,
} from 'react-native';

const styles = StyleSheet.create({
  accListItemWrap: {
    padding: 10,
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 5,
  },
});
/**
 * 오픈뱅크 계좌UI 렌더링 함수
 */
export default function renderAccListItem(item, selFinUseNum, onPress) {
  return (
    <View>
      <TouchableHighlight
        onPress={() => onPress(item.fintech_use_num)}
        selected={selFinUseNum.includes(item.fintech_use_num)}
      >
        <View style={[styles.accListItemWrap]}>
          <Text>{item.account_alias}</Text>
          <Text>{item.bank_name}</Text>
          <Text>{item.account_holder_name}</Text>
          <Text>{item.fintech_use_num}</Text>
        </View>
      </TouchableHighlight>
    </View>
  );
}
