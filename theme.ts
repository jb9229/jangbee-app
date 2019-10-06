import { ThemeType } from './types';
interface LocalColors {
  blue: string;
  darkGray: string;
  deepGray: string;
  gray: string;
  lightGray: string;
  paleGray: string;
  pale: string;
  lineGray: string;
  bgGray: string;
  red: string;
  marine: string;
  rosa: string;
  white: string;
  black: string;
}

interface Colors {
  headerBackgroundLight: string;
  headerBackgroundDark: string;
  backgroundLight: string;
  backgroundDark: string;
  highlightLight: string;
  highlightDark: string;
  textPrimaryLight: string;
  textPrimaryDark: string;
  textSecondaryLight: string;
  textSecondaryDark: string;
  disabledLight: string;
  disabledDark: string;
  rosa: string;
  marine: string;
  blue: string;
  gray: string;
}

const localColors: LocalColors = {
  blue: '#4981f2',
  darkGray: '#323b43',
  deepGray: '#596570',
  gray: '#99a2aa',
  lightGray: '#c6ccd1',
  paleGray: '#e1e4e7',
  pale: '#e6eaee',
  lineGray: '#f3f5f7',
  bgGray: '#f9fafb',
  red: '#ff3b30',
  marine: '#023059',
  rosa: '#ff84a5',
  white: '#ffffff',
  black: '#000000'
};

export const colors: Colors = {
  headerBackgroundLight: localColors.white,
  headerBackgroundDark: '#323739',
  backgroundLight: localColors.bgGray,
  backgroundDark: '#333333',
  highlightLight: localColors.blue,
  highlightDark: localColors.blue,
  textPrimaryLight: localColors.black,
  textPrimaryDark: localColors.white,
  textSecondaryLight: localColors.gray,
  textSecondaryDark: '#696969',
  disabledLight: localColors.gray,
  disabledDark: localColors.gray,
  rosa: localColors.rosa,
  marine: localColors.marine,
  blue: localColors.blue,
  gray: localColors.gray
};

const theme = {
  light: {
    background: colors.backgroundLight,
    headerBackground: colors.headerBackgroundLight,
    highlight: colors.highlightLight,
    fontColor: colors.textPrimaryLight,
    fontSecondaryColor: colors.textSecondaryLight,
    disabled: colors.disabledLight,
    rosa: colors.rosa,
    marine: colors.marine,
    gray: colors.gray,
    blue: colors.blue
  },
  dark: {
    background: colors.backgroundDark,
    headerBackground: colors.headerBackgroundDark,
    highlight: colors.highlightDark,
    fontColor: colors.textPrimaryDark,
    fontSecondaryColor: colors.textSecondaryDark,
    disabled: colors.disabledDark,
    rosa: colors.rosa,
    marine: colors.marine,
    gray: colors.gray,
    blue: colors.blue
  }
};

export const createTheme = (type = ThemeType.LIGHT) => {
  switch (type) {
    case ThemeType.LIGHT:
      return theme.light;
    case ThemeType.DARK:
      return theme.dark;
  }
};
