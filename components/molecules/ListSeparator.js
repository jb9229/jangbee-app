import React from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '../../constants/Colors';

const styles = StyleSheet.create({
  separator: {
    height: 3,
    width: '100%',
    backgroundColor: colors.batangLight,
  },
});
const ListSepartor = () => <View style={styles.separator} />;

export default ListSepartor;
