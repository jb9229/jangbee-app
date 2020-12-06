import { ApolloClient, InMemoryCache } from '@apollo/client';

import { createUploadLink } from 'apollo-upload-client';

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
  link: createUploadLink({
    uri:
      process.env.BUILD_TYPE === 'dev'
        ? 'http://10.0.2.2:4000/graphql'
        : 'https://jangbeecall-dev.azurewebsites.net/graphql',
  }),
});
