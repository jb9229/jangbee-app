import React from 'react';
import { StyleSheet, View } from 'react-native';
import FirmTextItem from '../FirmTextItem';

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
});
export default function CliEvaluItem({ item }) {
  return (
    <View style={styles.Container}>
      <FirmTextItem title="성명/기관명" value={item.cliName} />
      <FirmTextItem title="사유" value={item.reason} />
    </View>
  );
}
