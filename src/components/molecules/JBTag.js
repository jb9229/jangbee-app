import React from 'react';
import styled from 'styled-components/native';
import colors from 'constants/Colors';

const Text = styled.Text`
  font-size: 14;
  background-color: ${colors.point2Light};
  font-weight: bold;
  padding: 1px;
  padding-left: 4px;
  padding-right: 4px;
  margin: 2px;
`;

export default function renderTag({ name }) {
  if (!name) {
    return null;
  }

  return <Text>{name}</Text>;
}
