import React from 'react';
import {
  StyleSheet, TouchableHighlight, Text, View,
} from 'react-native';
import colors from '../../constants/Colors';
import fonts from '../../constants/Fonts';

const styles = StyleSheet.create({
  commWrap: {
    marginTop: 10,
    justifyContent: 'flex-end',
  },
  commTH: {
    backgroundColor: colors.pointDark,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 3,
  },
  fullCommTH: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: colors.point2,
    paddingLeft: 23,
    paddingRight: 23,
    paddingTop: 11,
    paddingBottom: 11,
    borderRadius: 3,
    elevation: 4,
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
    fontFamily: fonts.button,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  fullCommText: {
    fontSize: 23,
  },
  bigCommText: {
    fontSize: 25,
  },
  smallCommText: {
    fontSize: 10,
  },
  underLineText: {
    textDecorationLine: 'underline',
  },
});

const FULL_SIZE = 'full';
const BIG_SIZE = 'big';
const SMALL_SIZE = 'small';
function getCommText(size) {
  switch (size) {
    case FULL_SIZE:
      return styles.fullCommText;
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
    case FULL_SIZE:
      return styles.fullCommTH;
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
