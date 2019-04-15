import React from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '../../constants/Colors';

const styles = StyleSheet.create({
  cardWrap: {
    flex: 1,
    backgroundColor: colors.cardBatang,
  },
  card: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 15,
    margin: 10,
  },
});

export default class Card extends React.Component {
  render() {
    return (
      <View style={styles.cardWrap} ref={c => (this._root = c)} {...this.props}>
        <View style={styles.card}>{this.props.children}</View>
      </View>
    );
  }
}
