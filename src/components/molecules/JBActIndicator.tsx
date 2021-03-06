import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import React from 'react';
import colors from 'constants/Colors';
import fonts from 'constants/Fonts';

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

interface Props {
  title: string;
  size?: number;
}
const JBActIndicator: React.FC<Props> = ({ title, size }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{title || '정보를 불러오는 중..'}</Text>
      <ActivityIndicator size={size || 28} color={colors.indicator} />
    </View>
  );
};

export default JBActIndicator;
