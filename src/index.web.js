import * as React from 'react';

import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: #117A78;
`;
const Text = styled.Text`
  color: white;
  font-size: 34;
`;
const SubText = styled.Text`
  color: white;
  font-size: 14;
`;

const WebApp = () =>
{
  return (
    <Container>
      <Text>Comming Soon</Text>
      <SubText>- JangbeeCall Web -</SubText>
    </Container>
  );
};

export default WebApp;
