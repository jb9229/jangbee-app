import React from 'react';
import {
  StyleSheet, Text, TextInput, View,
} from 'react-native';

const styles = StyleSheet.create({
  itemInput: {},
  itemWrap: {
    flex: 1,
    flexDirection: 'row',
  },
});

export default class FirmCreaTextInput extends React.PureComponent {
  render() {
    const {
      title, value, placeholder, onChangeText, keyboardType, secureTextEntry,
    } = this.props;

    return (
      <View style={styles.itemWrap}>
        <Text style={styles.itemTitle}>{title}</Text>
        <TextInput
          style={styles.itemInput}
          value={value}
          secureTextEntry={secureTextEntry !== null}
          keyboardType={keyboardType === undefined ? 'default' : keyboardType}
          placeholder={placeholder}
          onChangeText={onChangeText}
        />
      </View>
    );
  }
}
