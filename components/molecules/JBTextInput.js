import React from 'react';
import {
  StyleSheet, Text, TextInput, View,
} from 'react-native';
import fonts from '../../constants/Fonts';
import colors from '../../constants/Colors';

const styles = StyleSheet.create({
  itemWrap: {
    flex: 1,
    margin: 10,
    marginBottom: 20,
  },
  itemTitle: {
    fontFamily: fonts.titleMiddle,
    color: colors.title,
    fontSize: 15,
    marginBottom: 3,
  },
  itemInput: {
    fontFamily: fonts.batang,
    fontSize: 18,
    borderBottomWidth: 1,
    borderColor: '#7A7373',
    borderStyle: 'dotted',
  },
});

export default class JBTextInput extends React.PureComponent {
  render() {
    const {
      title,
      value,
      placeholder,
      onChangeText,
      keyboardType,
      secureTextEntry,
      onFocus,
      multiline,
      numberOfLines,
      tiRefer,
    } = this.props;
    return (
      <View style={styles.itemWrap}>
        {title ? <Text style={styles.itemTitle}>{title}</Text> : null}
        <TextInput
          ref={tiRefer ? input => tiRefer(input) : null}
          style={styles.itemInput}
          value={value}
          secureTextEntry={secureTextEntry !== undefined}
          keyboardType={keyboardType === undefined ? 'default' : keyboardType}
          placeholder={placeholder}
          onChangeText={onChangeText}
          onFocus={onFocus}
          multiline={multiline !== undefined}
          numberOfLines={numberOfLines === undefined ? 1 : numberOfLines}
          ellipsizeMode="tail"
          blurOnSubmit={false}
        />
      </View>
    );
  }
}
