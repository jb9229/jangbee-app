import React from 'react';
import { StyleSheet, Text } from 'react-native';
import styled from 'styled-components/native';
import fonts from '../../constants/Fonts';

const Container = styled.View`
  flex: 1;
  align-items: flex-start;
  margin: 10px;
  margin-bottom: 20px;
  ${props => props.row
    && `
    flex-direction: row;
  `}
`;

const Contents = styled.Text`
  font-family: ${fonts.batang};
  font-size: 14px;
  ${props => props.underline !== undefined
    && `
    text-decoration-line: underline;
  `}
`;

const styles = StyleSheet.create({
  itemTitle: {
    fontFamily: fonts.titleMiddle,
    color: '#4D4A4A',
    fontSize: 18,
  },
});

export default class JBTextItem extends React.PureComponent {
  render() {
    const {
      title, value, revColor, underline, row,
    } = this.props;
    let color = null;
    if (revColor) {
      color = { color: 'white' };
    }
    return (
      <Container row={row}>
        <Text style={[styles.itemTitle]}>{title === undefined ? '' : `${title}: `}</Text>
        <Contents style={[styles.itemValue, color]} underline={underline}>
          {value}
        </Contents>
      </Container>
    );
  }
}
