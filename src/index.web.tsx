import * as React from 'react';

import { ApolloProvider } from '@apollo/client';
import ApolloWebTest from './ApolloTest';
import GPSSearchScreen from 'screens/GPSSearchScreen';
import JBTerm from './components/templates/JBTerm';
import { apolloClient } from 'src/api/apollo';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  align-items: center;
  background-color: #117A78;
`;
const EquipmentSearchWrap = styled.View`
  flex: 1;
  width: 100%;
`;

interface Props {}
const WebApp: React.FC<Props> = (props) =>
{
  console.log(props);
  return (
    <ApolloProvider client={apolloClient}>
      <Container>
        <ApolloWebTest />
        <EquipmentSearchWrap>
          <GPSSearchScreen />
        </EquipmentSearchWrap>
        <JBTerm />
      </Container>
    </ApolloProvider>
  );
};

export default WebApp;
