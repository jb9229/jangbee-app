import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  errorMessage: {
    color: 'red',
  },
});
export default class FirmCreaErrMSG extends React.PureComponent {
  render() {
    const { erroMSG } = this.props;
    return (
      <View>
        <Text style={styles.errorMessage}>{erroMSG}</Text>
      </View>
    );
  }
}
