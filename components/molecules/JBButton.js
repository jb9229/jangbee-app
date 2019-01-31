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
    marginRight: 20,
  },
  commTH: {
    backgroundColor: colors.pointDark,
    paddingLeft: 23,
    paddingRight: 23,
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 10,
  },
  bigCommTH: {
    paddingLeft: 42,
    paddingRight: 42,
    paddingTop: 25,
    paddingBottom: 25,
    borderRadius: 15,
  },
  smallCommTH: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 6,
  },
  commText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: fonts.button,
    color: 'white',
  },
  bigCommText: {
    fontSize: 28,
  },
  smallCommText: {
    fontSize: 8,
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

export default function JBButton({ title, onPress, size }) {
  const sizeCommText = getCommText(size);
  const sizeCommTH = getCommTH(size);
  return (
    <View style={styles.commWrap}>
      <TouchableHighlight onPress={onPress} style={[styles.commTH, sizeCommTH]}>
        <Text style={[styles.commText, sizeCommText]}>{title}</Text>
      </TouchableHighlight>
    </View>
  );
}
