import * as React from 'react';

import { ThemeProvider } from 'src/contexts/ThemeProvider';
import { addDecorator } from '@storybook/react-native';
// import { withKnobs } from '@storybook/addon-ondevice-knobs';
import { withKnobs } from '@storybook/addon-knobs';
import LoginStorybookProvider from './provider/LoginStorybookProvider';

const ThemeProviderDecorator = (storyFn) => (
  <ThemeProvider>{storyFn()}</ThemeProvider>
);

const LoginProviderDecorator = (storyFn) => (
  <LoginStorybookProvider>{storyFn()}</LoginStorybookProvider>
);

export const setupGlobalDecorators = () =>
{
  //* the order is important, the decoratos wrap from bottom to top
  addDecorator(ThemeProviderDecorator);
  addDecorator(LoginProviderDecorator);
  addDecorator(withKnobs);
};
