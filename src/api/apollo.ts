import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { NODE_SERVER_URL, NODE_SERVER_WEBSOCKET_URL } from 'src/constants/Url';

import { WebSocketLink } from '@apollo/link-ws';
import { getMainDefinition } from '@apollo/client/utilities';

console.log('>>> NODE_SERVER_URL: ', NODE_SERVER_URL);
const httpLink = new HttpLink({
  uri: NODE_SERVER_URL
});

const wsLink = new WebSocketLink({
  uri: NODE_SERVER_WEBSOCKET_URL,
  options: {
    reconnect: true
  }
});

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) =>
  {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink
});