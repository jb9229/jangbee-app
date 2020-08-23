import { FetchFunction } from 'relay-runtime';
import { NODE_SERVER_URL } from 'src/constants/Url';

const fetchGraphQL: FetchFunction = async (request, variables) => {
  console.log(
    `fetching query ${request.name} with ${JSON.stringify(variables)}`,
  );
//   const authorization = (await AsyncStorage.getItem('token')) || '';
  const config = {
    method: 'POST',
    headers: {
    //   authorization,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: request.text,
      variables,
    }),
  };
  return fetch(NODE_SERVER_URL, config)
    .then((response) => response.json())
    .catch((err) => {
      throw new Error(err);
    });
};

export default fetchGraphQL;
