import React from 'react';
import {
  Linking, StyleSheet, Text, View,
} from 'react-native';
import JBButton from '../molecules/JBButton';
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
    color: colors.point2,
  },
});

export default class BugReport extends React.PureComponent {
  render() {
    const { title } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          {title}
, 죄송합니다 관리자에 문의 부탁 드립니다. 최대한 신속하게 처리 하겠습니다.
        </Text>
        <JBButton
          title="메일로 의견보내기"
          onPress={() => Linking.openURL('mailto:support@jangbeecall.com')}
          size="small"
        />
      </View>
    );
  }
}
