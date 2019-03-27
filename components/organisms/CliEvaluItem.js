import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import JBTextItem from '../molecules/JBTextItem';
import JBButton from '../molecules/JBButton';

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  topWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  likeWrap: {
    width: 200,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  commWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
export default function CliEvaluItem({ item, accountId }) {
  return (
    <View style={styles.Container}>
      <View style={styles.topWrap}>
        <JBTextItem value={`${item.cliName}(${item.telNumber})`} underline />
        <View style={styles.likeWrap}>
          <Text>{`공감: ${item.likeCount}, 비공감: ${item.unlikeCount}`}</Text>
        </View>
      </View>
      <JBTextItem title="사유" value={item.reason} />
      {accountId === item.accountId && (
        <View style={styles.commWrap}>
          <JBButton title="수정" size="small" underline />
          <JBButton title="삭제" size="small" underline />
        </View>
      )}
    </View>
  );
}
