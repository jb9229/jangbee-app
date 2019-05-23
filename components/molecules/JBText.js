import React from 'react';
import styled from 'styled-components/native';
import fonts from '../../constants/Fonts';

const Text = styled.Text`
  font-family: ${fonts.batang};
`;

export default function renderText({ text }) {
  return <Text>{text}</Text>;
}
