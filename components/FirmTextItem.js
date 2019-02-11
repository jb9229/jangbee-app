import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import fonts from '../constants/Fonts';

const styles = StyleSheet.create({
  itemWrap: {
    flex: 1,
    alignItems: 'flex-start',
    margin: 10,
    marginBottom: 20,
  },
  itemTitle: {
    fontFamily: fonts.titleMiddle,
    color: '#4D4A4A',
    fontSize: 18,
  },
  itemValue: {
    fontFamily: fonts.batang,
    fontSize: 18,
  },
});

export default class FirmTextItem extends React.PureComponent {
  render() {
    const { title, value, revColor } = this.props;
    let color = null;
    if (revColor) {
      color = { color: 'white' };
    }
    return (
      <View style={styles.itemWrap}>
        <Text style={[styles.itemTitle]}>{title === undefined ? '' : `${title}: `}</Text>
        <Text style={[styles.itemValue, color]}>{value}</Text>
      </View>
    );
  }
}
