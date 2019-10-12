import React from 'react';
import Styled from 'styled-components/native';
import fonts from 'constants/Fonts';

const Text = Styled.Text`
  fontFamily: ${fonts.batang}
`;

export default function WorkCommTextUI({ text }) {
  return <Text>{text}</Text>;
}
