import React from 'react';
import colors from 'constants/Colors';
import styled from 'styled-components/native';

const Text = styled.Text`
  font-size: 14px;
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
