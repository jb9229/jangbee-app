import * as React from 'react';

import { DefaultNavigationProps } from 'src/types';
import { User } from 'firebase';
import createCtx from 'src/contexts/CreateCtx';

interface Context {
  navigation: DefaultNavigationProps;
  user: User;
  setUser: (user: User) => void;
}

const [useCtx, Provider] = createCtx<Context>();

interface Props {
  children?: React.ReactElement;
  navigation: DefaultNavigationProps;
}

const LoginProvider = (props: Props): React.ReactElement =>
{
  const [user, setUser] = React.useState<User | undefined>();
  const states = {
    navigation: props.navigation,
    user
  };

  const actions = {
    setUser
  };

  return (
    <Provider value={{ ...states, ...actions }}>{props.children}</Provider>
  );
};

export { useCtx as useLoginProvider, LoginProvider };
