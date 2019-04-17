import React from 'react';
import Styled from 'styled-components/native';

const Container = Styled.View``;
const Text = Styled.Text``;
export default function JBListItem(item) {
  return (
    <Container>
      <Text>{item}</Text>
    </Container>
  );
}
