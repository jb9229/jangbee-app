import React from 'react';
import {
  Alert, StyleSheet, Text, View,
} from 'react-native';
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

/**
 * 블랙리스트 삭제 확인 함수
 * @param {*} id 삭제 확인할 아이디
 */
function confirmDeleteCE(item, deleteCliEvalu) {
  Alert.alert(
    '블랙리스트 삭제',
    `[${item.cliName}(${item.telNumber})] 해당 블랙리스트 내용을 삭제 하시겠습니까?`,
    [{ text: '삭제', onPress: () => deleteCliEvalu(item.id) }, { text: '취소', onPress: () => {} }],
  );
}

export default function CliEvaluItem({
  item,
  accountId,
  updateCliEvalu,
  deleteCliEvalu,
  openCliEvaluLikeModal,
}) {
  return (
    <View style={styles.Container}>
      <View style={styles.topWrap}>
        <JBTextItem value={`${item.cliName}(${item.telNumber})`} underline />
        <View style={styles.likeWrap}>
          {accountId === item.accountId && (
            <Text>{`공감: ${item.likeCount}, 비공감: ${item.unlikeCount}`}</Text>
          )}
          {accountId !== item.accountId && (
            <View style={styles.likeWrap}>
              <JBButton
                title={`공감: ${item.likeCount}, 비공감: ${item.unlikeCount}`}
                onPress={() => openCliEvaluLikeModal(item)}
                size="small"
                underline
              />
            </View>
          )}
        </View>
      </View>
      <JBTextItem title="사유" value={item.reason} />
      {accountId === item.accountId && (
        <View style={styles.commWrap}>
          <JBButton title="수정" onPress={() => updateCliEvalu(item)} size="small" underline />
          <JBButton
            title="삭제"
            onPress={() => confirmDeleteCE(item, deleteCliEvalu)}
            size="small"
            underline
          />
        </View>
      )}
    </View>
  );
}
