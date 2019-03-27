import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import styled from 'styled-components/native';
import fonts from '../../constants/Fonts';

const Contents = styled.Text`
  font-family: ${fonts.batang};
  font-size: 14px;
  ${props => props.underline !== undefined
    && `
    text-decoration-line: underline;
  `}
`;
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
});

export default class FirmTextItem extends React.PureComponent {
  render() {
    const {
      title, value, revColor, underline,
    } = this.props;
    let color = null;
    if (revColor) {
      color = { color: 'white' };
    }
    return (
      <View style={styles.itemWrap}>
        <Text style={[styles.itemTitle]}>{title === undefined ? '' : `${title}: `}</Text>
        <Contents style={[styles.itemValue, color]} underline={underline}>
          {value}
        </Contents>
      </View>
    );
  }
}
