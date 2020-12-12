import * as React from 'react';

import { DefaultNavigationProps } from 'src/types';
import createCtx from 'src/contexts/CreateCtx';

interface Context {
  navigation: DefaultNavigationProps;
}

const [useCtx, Provider] = createCtx<Context>();

interface Props {
  children?: React.ReactElement;
  navigation: DefaultNavigationProps;
}

const TemplateProvider = (props: Props): React.ReactElement =>
{
  const states = {
    navigation: props.navigation
  };

  return (
    <Provider value={states}>{props.children}</Provider>
  );
};

export { useCtx as useTemplateProvider, TemplateProvider };
