import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import JBTextItem from '../molecules/JBTextItem';
import JBButton from '../molecules/JBButton';
import { convertHyphen, formatTelnumber } from '../../utils/StringUtils';

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  topWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 2,
  },
  likeWrap: {
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
  openDetailModal,
}) {
  return (
    <View style={styles.Container}>
      <View style={styles.topWrap}>
        <JBButton
          title={`${convertHyphen(item.cliName)} (${convertHyphen(item.firmName)}, ${convertHyphen(
            item.firmNumber,
          )})`}
          onPress={() => openDetailModal(item)}
          size="small"
          underline
          Secondary
        />
        <View style={styles.likeWrap}>
          <View style={styles.likeWrap}>
            <JBButton
              title={`공감: ${item.likeCount}, 비공감: ${item.unlikeCount}`}
              onPress={() => openCliEvaluLikeModal(item, accountId === item.accountId)}
              size="small"
              underline
              Primary
            />
          </View>
        </View>
      </View>
      <JBTextItem
        title="전화번호"
        value={`${formatTelnumber(item.telNumber)}, ${formatTelnumber(
          item.telNumber2,
        )}, ${formatTelnumber(item.telNumber3)}`}
        small
        row
      />
      <JBTextItem title="사유" value={item.reason} small />
      {accountId === item.accountId && (
        <View style={styles.commWrap}>
          <JBButton
            title="수정"
            onPress={() => updateCliEvalu(item)}
            size="small"
            underline
            Primary
          />
          <JBButton
            title="삭제"
            onPress={() => confirmDeleteCE(item, deleteCliEvalu)}
            size="small"
            underline
            Primary
          />
        </View>
      )}
    </View>
  );
}
