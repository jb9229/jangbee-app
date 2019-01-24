import React from 'react';
import {
  Image, StyleSheet, Text, View,
} from 'react-native';

const styles = StyleSheet.create({
  itemWrap: {
    flex: 1,
    margin: 10,
  },
  itemTitle: {
    fontFamily: 'yang-rounded',
    color: '#4D4A4A',
    fontSize: 20,
  },
  itemValue: {
    flex: 1,
    width: 300,
    height: 300,
    resizeMode: 'cover',
  },
});

export default class FirmTextItem extends React.PureComponent {
  render() {
    const { title, value } = this.props;
    return (
      <View style={styles.itemWrap}>
        <Text style={styles.itemTitle}>{`${title}: `}</Text>
        <Image style={styles.itemValue} source={{ uri: value }} />
      </View>
    );
  }
}
