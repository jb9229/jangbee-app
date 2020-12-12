import * as React from 'react';

import { ApolloProvider } from '@apollo/client';
import ApolloWebTest from './ApolloTest';
import GPSSearchScreen from 'screens/GPSSearchScreen';
import JBTerm from './components/templates/JBTerm';
import MobileStoreButton from 'react-mobile-store-button';
import { apolloClient } from 'src/api/apollo';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  align-items: center;
  background-color: #117A78;
`;
const EquipmentSearchWrap = styled.View`
  height: 500px;
  width: 100%;
`;
const StoreLinkWrap = styled.View`
  position: sticky;
  width: 100%;
  bottom: 10px;
  right: 10px;
`;

interface Props {}
const WebApp: React.FC<Props> = (props) =>
{
  const iOSUrl = 'https://play.google.com/store/apps/details?id=com.kan.jangbeecall';
  console.log(props);
  return (
    <ApolloProvider client={apolloClient}>
      <Container>
        <ApolloWebTest />
        <EquipmentSearchWrap>
          <GPSSearchScreen />
        </EquipmentSearchWrap>
        <JBTerm />
        <StoreLinkWrap>
          <MobileStoreButton
            store="android"
            url={iOSUrl}
            linkProps={{ title: 'iOS Store Button' }}
          />
        </StoreLinkWrap>
      </Container>
    </ApolloProvider>
  );
};

export default WebApp;
