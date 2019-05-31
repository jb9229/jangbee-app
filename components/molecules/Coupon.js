import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import styled from 'styled-components/native';
import colors from '../../constants/Colors';
import fonts from '../../constants/Fonts';

const TouchableHighlight = styled.TouchableHighlight`
  ${props => props.selected
    && `
    background-color: ${colors.point};
  `};
`;

const styles = StyleSheet.create({
  containerTH: {
    borderColor: colors.pointDark,
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
  },
  contentsWrap: {
    padding: 5,
  },
  topWrap: {
    padding: 2,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  middleWrap: {
    alignItems: 'center',
  },
  bottomWrap: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  aliasText: {
    fontFamily: fonts.batang,
    fontSize: 20,
  },
  bankNameText: {
    fontFamily: fonts.titleMiddle,
    fontSize: 10,
    backgroundColor: colors.point2,
    padding: 5,
  },
  holderText: {
    fontFamily: fonts.titleMiddle,
    fontSize: 10,
    backgroundColor: colors.point2,
    padding: 5,
  },
});
/**
 * 오픈뱅크 계좌UI 렌더링 함수
 */
export default function renderCoupon({
  name, count, selected, onPress,
}) {
  return (
    <TouchableHighlight
      onPress={() => onPress(selected)}
      selected={selected}
      style={styles.containerTH}
    >
      <View style={[styles.contentsWrap]}>
        <View style={styles.topWrap}>
          <Text style={styles.holderText}>보유량: </Text>
          <Text style={styles.holderText}>
            {count}
개
          </Text>
        </View>
        <View style={styles.middleWrap}>
          <Text style={styles.aliasText}>{name}</Text>
        </View>
        <View style={styles.bottomWrap} />
      </View>
    </TouchableHighlight>
  );
}
