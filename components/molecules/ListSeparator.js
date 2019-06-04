import React from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '../../constants/Colors';

const styles = StyleSheet.create({
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: colors.pointLight,
    marginLeft: 3,
    marginRight: 3,
  },
});
const ListSepartor = () => <View style={styles.separator} />;

export default ListSepartor;
