import React from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

const styles = StyleSheet.create({
  equiText: {
    padding: 7,
    margin: 3,
    fontSize: 21,
  },
  selectedItem: {
    backgroundColor: '#fffbdd',
  },
});

export default class EquiSelBox extends React.PureComponent {
  onEquiSel = () => {
    const { eName, onPressItem } = this.props;

    onPressItem(eName);
  };

  render() {
    const { eName, selected } = this.props;

    const itemStyle = selected ? styles.selectedItem : null;

    return (
      <View>
        <TouchableOpacity onPress={() => this.onEquiSel()}>
          <Text style={[styles.equiText, itemStyle]}>{eName}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
