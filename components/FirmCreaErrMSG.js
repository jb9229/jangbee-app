import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../constants/Colors';

const styles = StyleSheet.create({
  errorWrap: {
    marginLeft: 10,
    marginRight: 10,
  },
  errorMessage: {
    color: colors.errorText,
  },
});
export default class FirmCreaErrMSG extends React.PureComponent {
  render() {
    const { errorMSG } = this.props;
    return (
      <View style={styles.errorWrap}>
        <Text style={styles.errorMessage}>{errorMSG}</Text>
      </View>
    );
  }
}
