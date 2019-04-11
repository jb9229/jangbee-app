import React from 'react';
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
    align-items: center;
  `}
  ${props => props.small
    && `
    margin: 5px;
    margin-bottom: 5px;
  `}
`;

const Title = styled.Text`
  font-family: ${fonts.titleMiddle};
  font-size: 18px;
  ${props => props.underline !== undefined
    && `
    text-decoration-line: underline;
  `}
  ${props => props.small
    && `
    font-size: 14px;
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

export default class JBTextItem extends React.PureComponent {
  render() {
    const {
      title, value, revColor, underline, row, small,
    } = this.props;
    let color = null;
    if (revColor) {
      color = { color: 'white' };
    }
    return (
      <Container row={row} small={small}>
        <Title small={small}>{title === undefined ? '' : `${title}: `}</Title>
        <Contents underline={underline}>{value}</Contents>
      </Container>
    );
  }
}
