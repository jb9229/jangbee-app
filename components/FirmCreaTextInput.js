import React from 'react';
import {
  StyleSheet, Text, TextInput, View,
} from 'react-native';

const styles = StyleSheet.create({
  itemWrap: {
    flex: 1,
    margin: 10,
    marginBottom: 20,
  },
  itemTitle: {
    fontFamily: 'yang-rounded',
    color: '#4D4A4A',
    fontSize: 20,
  },
  itemInput: {
    fontFamily: 'Hamchorong-batang',
    fontSize: 24,
    borderBottomWidth: 1,
    borderColor: '#7A7373',
    borderStyle: 'dotted',
  },
});

export default class FirmCreaTextInput extends React.PureComponent {
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
      refer,
    } = this.props;
    return (
      <View style={styles.itemWrap}>
        <Text style={styles.itemTitle}>{title}</Text>
        <TextInput
          ref={refer}
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
        />
      </View>
    );
  }
}
