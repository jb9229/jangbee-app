import * as React from 'react';

import { StyleProp, ViewStyle } from 'react-native';

import { DefaultStyledProps } from 'src/theme';
import styled from 'styled-components/native';

interface StyledProps extends DefaultStyledProps {
  lineColor?: string;
}
const Container = styled.TouchableOpacity`
`;

const UnderLineText = styled.Text<DefaultStyledProps>`
  font-family: ${(props): string => props.theme.FontButton};
  font-size: 19;
`;
const UnderLine = styled.View<StyledProps>`
  height: ${(props): number => props.lineColor ? 2 : 1.5};
  background-color: ${(props): string => props.lineColor || props.theme.ColorBGDarkGray};
`;

interface Props {
  text: string;
  lineColor?: string;
  onPress: () => void;
  wrapperStyle?: StyleProp<ViewStyle>;
}
const UnderLineButton: React.FC<Props> = (props) =>
{
  console.log(props.lineColor);
  return (
    <Container style={props.wrapperStyle} onPress={props.onPress}>
      <UnderLineText>{props.text}</UnderLineText>
      <UnderLine lineColor={props.lineColor} />
    </Container>
  );
};

export default UnderLineButton;
