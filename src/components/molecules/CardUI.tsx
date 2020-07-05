import { StyleProp, ViewStyle } from 'react-native';

import React from 'react';
import Styled from 'styled-components/native';
import colors from 'constants/Colors';

const Container = Styled.View`
  background-color: ${colors.cardBatang};
`;

const Card = Styled.View`
  flex: 1;
  justify-content: space-between;
  background-color: ${props => (props.bgColor ? props.bgColor : colors.point2Batang)};
  padding: 10px;
  border-radius: 15;
  margin: 10px;
  
  ${props => props.Finished &&
    `
    background-color: ${colors.batang};
  `}

  ${props => props.Primary &&
    `
    background-color: ${colors.pointBatang};
  `}
`;

interface Props {
  Finished?: boolean;
  Primary?: boolean;
  bgColor?: string;
  wrapperStyle?: StyleProp<ViewStyle>;
}
const CardUI: React.FC<Props> = (props) =>
{
  return (
    <Container {...props} style={props.wrapperStyle}>
      <Card Finished={props.Finished} Primary={props.Primary} bgColor={props.bgColor}>
        {props.children}
      </Card>
    </Container>
  );
};

export default CardUI;
