import * as React from 'react';

import { ApolloProvider } from '@apollo/client';
import ApolloWebTest from './ApolloTest';
import GPSSearchScreen from 'screens/GPSSearchScreen';
import JBTerm from './components/templates/JBTerm';
import LoginProvider from 'src/provider/LoginProvider';
import MobileStoreButton from 'react-mobile-store-button';
import { ThemeProvider } from 'src/contexts/ThemeProvider';
import { apolloClient } from 'src/api/apollo';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  align-items: center;
  background-color: #117a78;
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

const WebApp = () => {
  const iOSUrl =
    'https://play.google.com/store/apps/details?id=com.kan.jangbeecall';

  return (
    <ApolloProvider client={apolloClient}>
      <LoginProvider>
        <ThemeProvider>
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
        </ThemeProvider>
      </LoginProvider>
    </ApolloProvider>
  );
};

export default WebApp;
