import React from 'react';
import Styled from 'styled-components/native';
import colors from '../../constants/Colors';

const Container = Styled.View`
    justify-content: center;
    background-color: ${colors.point2Dark};
    marginTop: 10;
    border-radius: 5;
    padding: 10px;
`;
const Text = Styled.Text`
    font-weight: bold;
    color: white;
    font-size: 18px;
`;

export default function EquiSelListHeader({ title }) {
  return (
    <Container>
      <Text>{title}</Text>
    </Container>
  );
}
