import * as React from 'react';

import createCtx from 'src/context/CreateCtx';

interface Context {
  navigation: DefaultNavigationProps;
}

const [useCtx, Provider] = createCtx<Context>();

interface Props {
  children?: React.ReactElement;
  navigation: DefaultNavigationProps;
}

const ReviewDetailProvider = (props: Props): React.ReactElement => {
  const states = {
    navigation: props.navigation,
  };

  return (
    <Provider value={states}>{props.children}</Provider>
  );
};

export { useCtx as useReviewDetailProvider, ReviewDetailProvider };
