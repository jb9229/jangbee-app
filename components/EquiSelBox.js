// @flow
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import colors from '../constants/Colors';

const styles = StyleSheet.create({
  equiText: {
    fontFamily: 'Hamchorong-batang',
    fontSize: 20,
  },
  selectedItem: {
    backgroundColor: colors.point,
  },
  touchable: {
    borderWidth: 1,
    flexDirection: 'row',
    padding: 10,
    marginBottom: 20,
  },
});

type Props = {
  eName: string,
  selected: boolean,
  onPressItem: Function,
};
type State = {};

export default class EquiSelBox extends React.PureComponent<Props, State> {
  onEquiSel = () => {
    const { eName, onPressItem } = this.props;

    onPressItem(eName);
  };

  render() {
    const { eName, selected } = this.props;

    const itemStyle = selected ? styles.selectedItem : null;

    return (
      <TouchableOpacity onPress={() => this.onEquiSel()} style={[styles.touchable, itemStyle]}>
        <Text style={[styles.equiText]}>{eName}</Text>
      </TouchableOpacity>
    );
  }
}
