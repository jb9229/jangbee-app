import * as React from 'react';

import { ApolloProvider } from '@apollo/client';
import ApolloWebTest from './ApolloTest';
import JangbeeAdList from 'organisms/JangbeeAdList';
import adLocation from 'constants/AdLocation';
import { apolloClient } from 'src/api/apollo';
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
    <ApolloProvider client={apolloClient}>
      <Container>
        <JangbeeAdList adLocation={adLocation.main} navigation={undefined} />

        <Text>Comming Soon</Text>
        <SubText>- JangbeeCall Web -</SubText>
        <ApolloWebTest />
      </Container>
    </ApolloProvider>
  );
};

export default WebApp;
