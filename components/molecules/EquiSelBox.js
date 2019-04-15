// @flow
import React from 'react';
import { StyleSheet, Text, TouchableHighlight } from 'react-native';
import colors from '../../constants/Colors';
import fonts from '../../constants/Fonts';

const styles = StyleSheet.create({
  equiText: {
    fontFamily: fonts.batang,
    fontSize: 20,
  },
  selectedItem: {
    backgroundColor: colors.point,
  },
  touchable: {
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
    padding: 10,
    backgroundColor: colors.point2Light,
  },
});

type Props = {
  eName: string,
  eSetionName: string,
  selected: boolean,
  onPressItem: Function,
};
type State = {};

export default class EquiSelBox extends React.PureComponent<Props, State> {
  onPress = () => {
    const { eSetionName, eName, onPressItem } = this.props;

    const equipmentName = `${eSetionName}(${eName})`;
    onPressItem(equipmentName);
  };

  render() {
    const { eName, selected } = this.props;

    const itemStyle = selected ? styles.selectedItem : null;

    return (
      <TouchableHighlight onPress={() => this.onPress()} style={[styles.touchable, itemStyle]}>
        <Text style={[styles.equiText]}>{eName}</Text>
      </TouchableHighlight>
    );
  }
}
