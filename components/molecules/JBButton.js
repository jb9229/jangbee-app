import React from 'react';
import {
  StyleSheet, TouchableHighlight, Text, View,
} from 'react-native';
import colors from '../../constants/Colors';
import fonts from '../../constants/Fonts';

const styles = StyleSheet.create({
  commWrap: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 10,
  },
  commTH: {
    backgroundColor: colors.pointDark,
    paddingLeft: 23,
    paddingRight: 23,
    paddingTop: 11,
    paddingBottom: 11,
    borderRadius: 3,
  },
  bigCommTH: {
    backgroundColor: colors.pointDark,
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 3,
  },
  smallCommTH: {
    backgroundColor: colors.pointDark,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 3,
  },
  underLineTH: {
    backgroundColor: 'transparent',
  },
  commText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: fonts.button,
    color: 'white',
  },
  bigCommText: {
    fontSize: 25,
  },
  smallCommText: {
    fontSize: 8,
  },
  underLineText: {
    textDecorationLine: 'underline',
  },
});

const BIG_SIZE = 'big';
const SMALL_SIZE = 'small';
function getCommText(size) {
  switch (size) {
    case BIG_SIZE:
      return styles.bigCommText;
    case SMALL_SIZE:
      return styles.smallCommText;
    default:
      return null;
  }
}

function getCommTH(size) {
  switch (size) {
    case BIG_SIZE:
      return styles.bigCommTH;
    case SMALL_SIZE:
      return styles.smallCommTH;
    default:
      return null;
  }
}

export default function JBButton({
  title, onPress, size, underline,
}) {
  const sizeCommText = getCommText(size);
  const sizeCommTH = getCommTH(size);
  let underLineTH = null;
  let underLineText = null;
  if (underline) {
    underLineTH = styles.underLineTH;
    underLineText = styles.underLineText;
  }
  return (
    <View style={styles.commWrap}>
      <TouchableHighlight onPress={onPress} style={[styles.commTH, sizeCommTH, underLineTH]}>
        <Text style={[styles.commText, sizeCommText, underLineText]}>{title}</Text>
      </TouchableHighlight>
    </View>
  );
}
