// @flow
import React from 'react';
import {
  StyleSheet, Text, TouchableHighlight, View,
} from 'react-native';
import colors from '../../constants/Colors';
import fonts from '../../constants/Fonts';

const styles = StyleSheet.create({
  titleText: {
    fontFamily: fonts.titleMiddle,
    fontSize: 15,
    marginBottom: 5,
  },
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginBottom: 20,
  },
});

type Props = {
  title: string,
  searchCondition: string,
  onPressItem: Function,
};
type State = {};

export default class SearCondBox extends React.PureComponent<Props, State> {
  render() {
    const {
      title, searchCondition, onPress, defaultCondtion,
    } = this.props;

    const itemStyle = searchCondition === '' ? null : styles.selectedItem;
    const conditionStr = searchCondition === '' ? defaultCondtion : searchCondition;

    return (
      <View>
        <Text style={[styles.titleText]}>{title}</Text>
        <TouchableHighlight onPress={() => onPress()} style={[styles.touchable, itemStyle]}>
          <Text style={[styles.equiText]}>{conditionStr}</Text>
        </TouchableHighlight>
      </View>
    );
  }
}
