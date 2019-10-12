import * as React from 'react';
import { addDecorator } from '@storybook/react-native';
import { createTheme } from '../src/theme';
// import { withKnobs } from '@storybook/addon-ondevice-knobs';
import { withKnobs } from '@storybook/addon-knobs';
import { ThemeProvider } from 'styled-components/native';
import { ThemeType } from '../src/types';

const ThemeProviderWrapper = (props) => {
  // const { state } = useContext(AppContext);
  // console.log(state);
  const theme = 'LIGHT';

  return (
    <ThemeProvider theme={createTheme(ThemeType.LIGHT)}>{props.children}</ThemeProvider>
  );
};

const ThemeProviderDecorator = (storyFn) => (
  <ThemeProviderWrapper>{storyFn()}</ThemeProviderWrapper>
);

export const setupGlobalDecorators = () => {
  //* the order is important, the decoratos wrap from bottom to top
  addDecorator(ThemeProviderDecorator);
  addDecorator(withKnobs);
};