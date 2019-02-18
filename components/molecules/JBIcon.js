import React from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/Colors';

const styles = StyleSheet.create({
  iconTH: {
    marginBottom: 5,
    marginRight: 15,
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
          name={name}
          size={size}
          style={styles.icon}
          color={color ? color : colors.iconDefault}
        />
      </TouchableHighlight>
    );
  }
}
