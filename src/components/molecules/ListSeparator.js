import { StyleSheet, View } from 'react-native';

import React from 'react';
import colors from 'constants/Colors';

const styles = StyleSheet.create({
  separator: {
    height: 3,
    width: '100%',
    backgroundColor: colors.batangLight
  }
});
const ListSepartor = () => <View style={styles.separator} />;

export default ListSepartor;
