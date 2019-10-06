import * as Font from 'expo-font';
import * as Icon from '@expo/vector-icons';
import React, { useContext } from 'react';
import { addDecorator } from '@storybook/react-native';
import { ThemeProvider } from 'styled-components';
// import { createTheme, ThemeType } from "../theme";
// import { AppContext, AppProvider } from "../providers/AppProvider";

/**
 * 루트 앱 프로바이더 데코레이터
 * @param {StoryRootComponent} story 스토리 루트 컴포넌트
 */
// const AppProviderDecorator = story => <AppProvider>{story()}</AppProvider>;

/**
 * 테마 프로바이더 Wrapper
 *
 * @param {Props} props 상위 컴포넌트의 Props들
 */
// const ThemeProviderWrapper = props => {
//   const { state } = useContext(AppContext);
//   const { theme } = state;

//   return (
//     <ThemeProvider theme={createTheme(theme)}>{props.children}</ThemeProvider>
//   );
// };

/**
 * 테마 프로바이더 테코레이터
 *
 * @param {Component} story 스토리 Root Component
 */
// const ThemeProviderDecorator = story => (
//   <ThemeProviderWrapper>{story()}</ThemeProviderWrapper>
// );

_loadResourcesAsync = async () =>
  Promise.all([
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Icon.Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free
      // to remove this if you are not using it in your app
      SsangmundongGulimB: require('../assets/fonts/Typo_SsangmundongGulimB.ttf'),
      NanumSquareRoundR: require('../assets/fonts/NanumSquareRoundR.ttf'),
      NanumGothic: require('../assets/fonts/NanumGothic.ttf'),
      NanumPen: require('../assets/fonts/NanumPen.ttf')
    })
  ]);

export const setupGlobalDecorators = () => {
  // ※ the order is important, the decorators warp from bottom to top
  // addDecorator(ThemeProviderDecorator);
  // addDecorator(AppProviderDecorator);

  _loadResourcesAsync();
};
