import * as React from 'react';

import { ApolloProvider } from '@apollo/client';
import ApolloWebTest from './ApolloTest';
import GPSSearchScreen from 'screens/GPSSearchScreen';
import { apolloClient } from 'src/api/apollo';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  align-items: center;
  background-color: #117A78;
`;

interface Props {}
const WebApp: React.FC<Props> = (props) =>
{
  console.log(props);
  return (
    <ApolloProvider client={apolloClient}>
      <Container>
        <ApolloWebTest />
        <GPSSearchScreen />
      </Container>
    </ApolloProvider>
  );
};

export default WebApp;
