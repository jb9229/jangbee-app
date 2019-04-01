import React from 'react';
import styled from 'styled-components/native';
import colors from '../../constants/Colors';
import fonts from '../../constants/Fonts';

const FULL_SIZE = 'full';
const BIG_SIZE = 'big';
const SMALL_SIZE = 'small';
const Container = styled.View`
  flex-direction: row;
  margin: 5px 5px;
  ${props => props.align === 'right'
    && `
    justify-content: flex-end;
  `}
  ${props => props.align === 'center'
    && `
    justify-content: center;
  `}
`;

const TouchableHighlight = styled.TouchableHighlight`
  background-color: ${props => (props.color ? props.color : colors.pointDark)};
  ${props => props.size === undefined
    && `
    padding: 12px 20px;
    border-radius: 3;
  `};
  ${props => props.size === FULL_SIZE
    && `
    width: 100%;
    align-items: center;
    background-color: ${colors.point2};
    padding: 10px 0;
    border-radius: 3;
    elevation: 4;
  `};
  ${props => props.size === BIG_SIZE
    && `
    padding: 15px 30px;
    border-radius: 3;
  `};
  ${props => props.size === SMALL_SIZE
    && `
    padding: 10px 10px;
    border-radius: 3;
  `};
  ${props => props.underline
    && `
    background-color: transparent;
  `};
`;

const Text = styled.Text`
  font-family: ${fonts.button};
  font-weight: bold;
  color: white;
  ${props => props.size === undefined
    && `
      font-size: 20px;
  `};
  ${props => props.size === FULL_SIZE
    && `
      font-size: 21px;
    `};
  ${props => props.size === BIG_SIZE
    && `
      font-size: 25px;
    `};
  ${props => props.size === SMALL_SIZE
    && `
      font-size: 14px;
    `};
  ${props => props.underline
    && `
      color: ${colors.point2};
      text-decoration-line: underline;
    `};
`;

export default function JBButton({
  title, onPress, size, underline, color, align,
}) {
  return (
    <Container align={align}>
      <TouchableHighlight
        size={size}
        color={color}
        onPress={onPress}
        underline={underline ? true : null}
      >
        <Text size={size} underline={underline ? true : null}>
          {title}
        </Text>
      </TouchableHighlight>
    </Container>
  );
}
