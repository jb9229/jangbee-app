import { DefaultTheme } from 'styled-components';
import { ThemeType } from './types';

export interface Theme {
  ColorTextSubtitle: string;
  ColorTextError: string;
  ColorBtnPrimary: string;
  ColorBtnSecondary: string;
  ColorBtnSuccess: string;
  ColorBtnDefault: string;
  ColorBtnStyle: string;
  ColorBGGray: string;
  background: string;
  backgroundDark: string;
  btnPrimary: string;
  btnPrimaryFont: string;
  btnPrimaryLight: string;
  btnPrimaryLightFont: string;
  textDisabled: string;
  btnDisabled: string;
  fontColor: string;
  tintColor: string;
}

const colors = {
  skyBlue: '#069ccd',
  whiteGray: '#f7f6f3',
  dusk: 'rgb(65,77,107)',
  dodgerBlue: 'rgb(58,139,255)',
  green: 'rgb(29,211,168)',
  greenBlue: 'rgb(36,205,151)',
  mediumGray: 'rgb(134,154,183)',
  paleGray: 'rgb(221,226,236)',
  lightBackground: 'white',
  lightBackgroundLight: '#f7f6f3',
  darkBackground: '#323739',
  darkBackgroundLight: '#393241',
  red: '#FF0000'
};

const theme = {
  light: {
    ColorTextSubtitle: '#606060',
    ColorTextError: colors.red,
    ColorBtnPrimary: '#ffbb00', // Primary, Secondary, Success, Danger, Warning, Info, Light, Dark, Link
    ColorBtnSecondary: '#444444',
    ColorBtnSuccess: '#00b7ee',
    ColorBtnDefault: '#444444',
    ColorBtnStyle: 'white',
    ColorBGGray: '#d7d7d7',
    background: colors.lightBackground,
    backgroundDark: colors.dodgerBlue,
    btnPrimary: colors.skyBlue,
    btnPrimaryFont: 'white',
    btnPrimaryLight: colors.whiteGray,
    btnPrimaryLightFont: 'black',
    textDisabled: '#969696',
    btnDisabled: 'rgb(224,224,224)',
    fontColor: 'black',
    tintColor: '#333333',
    lineColor: colors.paleGray
  },
  dark: {
    ColorTextSubtitle: '#606060',
    ColorTextError: colors.red,
    ColorBtnPrimary: '#ffbb00',
    ColorBtnSecondary: '#444444',
    ColorBtnSuccess: '#00b7ee',
    ColorBtnDefault: '#444444',
    ColorBtnStyle: 'white',
    ColorBGGray: '#d7d7d7',
    background: colors.darkBackground,
    backgroundDark: colors.dodgerBlue,
    btnPrimary: colors.skyBlue,
    btnPrimaryFont: 'white',
    btnPrimaryLight: colors.whiteGray,
    btnPrimaryLightFont: 'black',
    textDisabled: '#969696',
    btnDisabled: 'rgb(224,224,224)',
    fontColor: 'white',
    tintColor: '#a3a3a3',
    lineColor: colors.paleGray
  }
};

export const createTheme = (type = ThemeType.LIGHT): DefaultTheme => {
  switch (type) {
    case ThemeType.LIGHT:
      return theme.light;
    case ThemeType.DARK:
      return theme.dark;
    default:
      return theme.light;
  }
};
