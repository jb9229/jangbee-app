import * as React from 'react';

import LoginStorybookProvider from './provider/LoginStorybookProvider';
import { ThemeProvider } from 'src/contexts/ThemeProvider';
import { View } from 'react-native';
import { addDecorator } from '@storybook/react-native';
// import { withKnobs } from '@storybook/addon-ondevice-knobs';
import { withKnobs } from '@storybook/addon-knobs';

const ThemeProviderDecorator = (storyFn) => (
  <ThemeProvider>{storyFn()}</ThemeProvider>
);

const LoginProviderDecorator = (storyFn) => (
  <LoginStorybookProvider>{storyFn()}</LoginStorybookProvider>
);

const SafeZonDecorator = (storyFn) => (
  <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 25 }}>
    {storyFn()}
  </View>
);

export const setupGlobalDecorators = () =>
{
  //* the order is important, the decoratos wrap from bottom to top
  addDecorator(SafeZonDecorator);
  addDecorator(ThemeProviderDecorator);
  addDecorator(LoginProviderDecorator);
  addDecorator(withKnobs);
};
