import { ApolloClient, InMemoryCache, from } from '@apollo/client';

import { createUploadLink } from 'apollo-upload-client';
import { getEnvironment } from 'src/constants/Environment';
import { onError } from '@apollo/client/link/error';

const uploadLink = createUploadLink({
  uri: getEnvironment().dbUrl,
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  // {
  //   typePolicies: {
  //     Query: {
  //       fields: {
  //         // Reusable helper function to generate a field
  //         // policy for the Query.search field, keyed by
  //         // search query:
  //         firmHarmCases: relayStylePagination([])
  //       }
  //     }
  //   }
  // }
  // link: from([
  //   errorLink,
  //   createUploadLink({
  //     uri:
  //       process.env.BUILD_TYPE === 'dev'
  //         ? 'http://10.0.2.2:4000/graphql'
  //         : 'https://jangbeecall-dev.azurewebsites.net/graphql',
  //   }),
  // ]),
  link: from([errorLink, uploadLink]),
});
