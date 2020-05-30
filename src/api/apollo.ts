import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { NODE_SERVER_URL, NODE_SERVER_WEBSOCKET_URL } from 'src/constants/Url';

import { WebSocketLink } from '@apollo/link-ws';
import { getMainDefinition } from '@apollo/client/utilities';

console.log('>>> NODE_SERVER_URL: ', NODE_SERVER_URL);
console.log('>>> NODE_SERVER_WEBSOCKET_URL: ', NODE_SERVER_WEBSOCKET_URL);
const httpLink = new HttpLink({
  uri: 'http://www.jangbeecallapi.ap-northeast-2.elasticbeanstalk.com:4000/graphql'
});

const wsLink = new WebSocketLink({
  uri: 'ws://www.jangbeecallapi.ap-northeast-2.elasticbeanstalk.com:4000/graphql',
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
