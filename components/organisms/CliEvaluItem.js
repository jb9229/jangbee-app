import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import styled from 'styled-components/native';
import * as Icon from '@expo/vector-icons';
import JBButton from '../molecules/JBButton';
import JBTextItem from '../molecules/JBTextItem';
import colors from '../../constants/Colors';
import { shareClientEvalu } from '../../common/JBCallShare';
import { formatTelnumber } from '../../utils/StringUtils';

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    margin: 10,
    backgroundColor: colors.pointBatang,
  },
  topWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 5,
  },
  topLeftWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentsWrap: {
    marginLeft: 10,
    marginRight: 10,
  },
  likeWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

const CommWrap = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  ${props => props.mine
    && `
    justify-content: space-between;
  `}
`;

const EditCommWrap = styled.View`
  flex-direction: row;
`;

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
  let titleStr = '';
  if (item.firmName) {
    titleStr = item.firmName;
  } else if (item.firmNumber) {
    titleStr = item.firmNumber;
  } else if (item.cliName) {
    titleStr = item.cliName;
  } else {
    titleStr = '이름없음';
  }

  let telStr = formatTelnumber(item.telNumber);

  if (item.telNumber2) {
    telStr = `${telStr}, ${formatTelnumber(item.telNumber2)}`;
  }

  if (item.telNumber3) {
    telStr = `${telStr}, ${formatTelnumber(item.telNumber3)}`;
  }

  return (
    <View style={styles.Container}>
      <View style={styles.topWrap}>
        <View style={styles.topLeftWrap}>
          <JBButton
            title={titleStr}
            onPress={() => openDetailModal(item)}
            size="small"
            underline
            Secondary
          />
          <Icon.AntDesign name="right" size={16} color={colors.pointDark} />
        </View>
        <View style={styles.likeWrap}>
          <JBButton
            title={`공감: ${item.likeCount}, 비공감: ${item.unlikeCount}`}
            onPress={() => openCliEvaluLikeModal(item, accountId === item.accountId)}
            size="small"
            underline
            Primary
          />
          <Icon.AntDesign name="right" size={16} color={colors.point2} />
        </View>
      </View>
      <View style={styles.contentsWrap}>
        <JBTextItem title="전화번호" value={telStr} small row ellipsis={20} />
        {item.local ? <JBTextItem title="지역" value={item.local} small row /> : null}
        <JBTextItem title="사유" value={item.reason} small />
      </View>
      <CommWrap mine={accountId === item.accountId}>
        {accountId === item.accountId && (
          <EditCommWrap>
            <JBButton
              title="수정"
              onPress={() => updateCliEvalu(item)}
              size="small"
              underline
              Secondary
            />
            <JBButton
              title="삭제"
              onPress={() => confirmDeleteCE(item, deleteCliEvalu)}
              size="small"
              underline
              Secondary
            />
          </EditCommWrap>
        )}
        <JBButton
          title="공유하기 >"
          onPress={() => shareClientEvalu(item)}
          size="small"
          underline
          Primary
        />
      </CommWrap>
    </View>
  );
}
