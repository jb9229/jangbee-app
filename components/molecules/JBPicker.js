import React from 'react';
import {
  StyleSheet, Text, Picker, View,
} from 'react-native';
import fonts from '../../constants/Fonts';
import colors from '../../constants/Colors';

const styles = StyleSheet.create({
  itemWrap: {
    width: 100,
  },
  itemTitle: {
    fontFamily: fonts.titleMiddle,
    color: colors.title,
    fontSize: 15,
    marginBottom: 3,
  },
  itemPicker: {},
});

export default function JBPicker({
  title, selectedValue, items, onValueChange,
}) {
  return (
    <View style={styles.itemWrap}>
      {title ? <Text style={styles.itemTitle}>{title}</Text> : null}
      <Picker
        selectedValue={selectedValue}
        style={styles.itemPicker}
        onValueChange={itemValue => onValueChange(itemValue)}
      >
        <Picker.Item label="선택" value="" key={-1} />
        {items}
      </Picker>
    </View>
  );
}
