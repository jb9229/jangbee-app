import React from 'react';
import styled from 'styled-components/native';

const TouchableHighlight = styled.TouchableHighlight`
  flex: 1;
`;
const Text = styled.Text``;

export default function DepthSelectText({ value, action }) {
  let valueExpress = value;
  if (!value) {
    valueExpress = '-';
  }
  return (
    <TouchableHighlight onPress={() => action()}>
      <Text>{valueExpress}</Text>
    </TouchableHighlight>
  );
}
