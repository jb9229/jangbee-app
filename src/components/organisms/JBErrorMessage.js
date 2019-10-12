import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from 'constants/Colors';

const styles = StyleSheet.create({
  errorWrap: {
    marginLeft: 10,
    marginRight: 10
  },
  errorMessage: {
    color: colors.errorText
  }
});

const FirmCreaErrMSG = ({ errorMSG }) => (
  <View style={styles.errorWrap}>
    <Text style={styles.errorMessage}>{errorMSG}</Text>
  </View>
);

export default FirmCreaErrMSG;
