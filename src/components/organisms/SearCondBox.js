import { StyleSheet, View } from 'react-native';

// @flow
import React from 'react';
import colors from 'constants/Colors';
import fonts from 'constants/Fonts';
import styled from 'styled-components/native';

const TouchableHighlight = styled.TouchableHighlight`
  border-color: ${props => (props.isSelected ? 'white' : '#E1EDAF')};
  background-color: ${props =>
    props.isSelected ? colors.batangDark : '#E1EDAF'};
  border-width: 2px;
  border-radius: 25;
  align-items: center;
  justify-content: center;
  padding: 15px 25px;
  ${props =>
    props.isSelected &&
    `
    background-color: ${colors.batangDark};
    border-radius: 15;
    border-color: ${colors.batangDark};
  `};
`;

const Text = styled.Text`
  color: ${props => (props.isSelected ? colors.point : 'black')};
  font-family: ${fonts.button};
  font-size: 20px;
  font-weight: bold;
`;

const styles = StyleSheet.create({
  container: {
    margin: 20
  },
  titleText: {
    fontFamily: fonts.titleMiddle,
    fontSize: 15,
    marginBottom: 5
  },
  equiText: {
    fontFamily: fonts.batang,
    fontSize: 20,
    color: colors.batang
  },
  selectedItem: {
    backgroundColor: colors.point
  }
});

type Props = {
  title: string,
  searchCondition: string,
  onPressItem: Function
};
type State = {};

export default class SearCondBox extends React.PureComponent<Props, State> {
  render() {
    const { title, searchCondition, onPress, defaultCondtion } = this.props;

    const isSelected = searchCondition !== '';
    const searchConditionStr =
      searchCondition === '' ? defaultCondtion : `[ ${searchCondition} ]`;

    return (
      <View style={styles.container}>
        {title ? <Text style={[styles.titleText]}>{title}</Text> : null}
        <TouchableHighlight isSelected={isSelected} onPress={() => onPress()}>
          <Text isSelected={isSelected}>{searchConditionStr}</Text>
        </TouchableHighlight>
      </View>
    );
  }
}
