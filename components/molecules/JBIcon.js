import React from 'react';
import { Platform, StyleSheet, TouchableHighlight } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/Colors';

const styles = StyleSheet.create({
  iconTH: {
    marginBottom: 5,
    marginRight: 5,
    marginLeft: 5,
  },
  icon: {},
});

export default class JBIcon extends React.PureComponent {
  render() {
    const {
      name, size, onPress, color,
    } = this.props;
    return (
      <TouchableHighlight onPress={onPress} style={styles.iconTH}>
        <Ionicons
          name={Platform.OS === 'ios' ? `ios-${name}` : `md-${name}`}
          size={size}
          style={styles.icon}
          color={color || colors.iconDefault}
        />
      </TouchableHighlight>
    );
  }
}
