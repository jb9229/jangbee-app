import * as React from 'react';

import { DefaultTheme, ThemeProvider as StyledThemeProvider } from 'styled-components/native';
import { LanguageType, ThemeType, createTheme } from 'src/theme';

import createCtx from 'src/contexts/CreateCtx';

const [useCtx, Provider] = createCtx<Context>();

interface Context {
  themeType: ThemeType;
  theme: DefaultTheme;
  changeThemeType: () => void;
  changeLanguageType: () => void;
}

interface Props {
  children?: React.ReactElement;
}

const ThemeProvider: React.FC<Props> = (props) =>
{
  const [themeType, setThemeType] = React.useState<ThemeType>(ThemeType.LIGHT);
  const [language, setLanguage] = React.useState<LanguageType>(LanguageType.KO);

  const theme: DefaultTheme = createTheme(themeType, language) as DefaultTheme;

  return (
    <Provider
      value={{
        themeType,
        changeThemeType: (): void => changeThemeType(themeType, setThemeType),
        changeLanguageType: (): void => changeLanguageType(language, setLanguage),
        theme: theme
      }}
    >
      <StyledThemeProvider theme={theme}>{props.children}</StyledThemeProvider>
    </Provider>
  );
};

// Actions
const changeThemeType = (themeType: ThemeType, setThemeType: (type: ThemeType) => void): void =>
{
  const newThemeType = themeType === ThemeType.LIGHT ? ThemeType.DARK : ThemeType.LIGHT;
  setThemeType(newThemeType);
};

const changeLanguageType = (language: LanguageType, setLanguage: (type: LanguageType) => void): void =>
{
  const newLanguage = language === LanguageType.KO ? LanguageType.EN : LanguageType.KO;
  setLanguage(newLanguage);
};

export { useCtx as useThemeContext, ThemeProvider, ThemeType };
