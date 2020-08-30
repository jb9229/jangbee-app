import * as React from 'react';

import { StyleProp, ViewStyle } from 'react-native';
import { graphql, useQueryLoader } from 'react-relay/hooks';

import { DefaultNavigationProps } from 'src/types';
import FirmHarmCaseSearchLayout from 'src/components/templates/FirmHarmCaseSearchLayout';
import FirmHarmCaseSearchProvider from './FirmHarmCaseSearchProvider';
import LoadingIndicator from 'src/components/molecules/LoadingIndicator';
import styled from 'styled-components/native';

export const searchAllQuery = graphql`
  query searchProviderAllQuery ($pageQueryInfo: PageQueryInfo) {
    firmHarmCases(pageQueryInfo: $pageQueryInfo) {
      edges {
        cursor
        node {
          accountId
          telNumber
          reason
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

const Container = styled.View``;
const Button = styled.TouchableOpacity``;
const ButtonText = styled.Text``;

interface Props {
  navigation: DefaultNavigationProps;
}
const FirmHarmCaseSearchContainer: React.FC<Props> = (props) =>
{
  const searchWord = props.navigation.getParam('searchWord', undefined);
  const initMyHarmCaseSearch = props.navigation.getParam('myHarmCase', undefined);
  const initSearchAll = props.navigation.getParam('initSearchAll', true);
  const [queryReference, loadQuery, disposeQuery] = useQueryLoader(searchAllQuery, {});

  React.useEffect(() => {
    if (initSearchAll)
    {
      loadQuery({ pageQueryInfo: { first: 3 } });
    }
  }, [initSearchAll]);

  if (initSearchAll && queryReference === null)
  {
    return (<LoadingIndicator loading={true} />);
  }

  if (!initSearchAll)
  {
      <FirmHarmCaseSearchProvider
        navigation={props.navigation}
        searchWord={searchWord}
        initMyHarmCaseSearch={initMyHarmCaseSearch}
        queryReference={queryReference}
        initSearchAll={initSearchAll}
      >
        <FirmHarmCaseSearchLayout />
      </FirmHarmCaseSearchProvider>
  }

  return (
    <React.Suspense fallback={<LoadingIndicator loading={true} />}>
      <FirmHarmCaseSearchProvider
        navigation={props.navigation}
        searchWord={searchWord}
        initMyHarmCaseSearch={initMyHarmCaseSearch}
        queryReference={queryReference}
        initSearchAll={initSearchAll}
      >
        <FirmHarmCaseSearchLayout />
      </FirmHarmCaseSearchProvider>
    </React.Suspense>
  );
};

export default FirmHarmCaseSearchContainer;