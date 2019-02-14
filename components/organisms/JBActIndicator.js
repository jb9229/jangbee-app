import React from 'react';
import {
  ActivityIndicator, StyleSheet, Text, View,
} from 'react-native';
import colors from '../../constants/Colors';
import fonts from '../../constants/Fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    fontSize: 15,
    fontFamily: fonts.batang,
    marginBottom: 20,
    color: colors.pointDark,
  },
});

export default class JBActIndicator extends React.PureComponent {
  render() {
    const { title, size } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.message}>{title}</Text>
        <ActivityIndicator size={size} color={colors.indicator} />
      </View>
    );
  }
}
