import { DefaultTheme } from 'styled-components';

export enum ThemeType {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

export type Theme = typeof light & typeof koFont;

export enum LanguageType {
  KO = 'KOREAN',
  EN = 'ENGLISH',
}

const colors = {
  gray: 'RGB: 130, 182, 237',
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

export const koFont = {
  FontTitleTop: 'NanumPen',
  FontTitle: 'NanumGothic',
  FontMiddleTitle: 'SsangmundongGulimB',
  FontBatang: 'NanumSquareRoundR',
  FontButton: 'NanumGothic'
};

export const enFont = {
  FontTitleTop: 'NanumPen',
  FontTitle: 'NanumGothic',
  FontMiddleTitle: 'SsangmundongGulimB',
  FontBatang: 'NanumSquareRoundR',
  FontButton: 'NanumGothic'
};

export const light = {
  ColorPrimary: '#ffbb00',
  ColorSecond: '#82b6ed',
  ColorError: colors.red,
  ColorInputLabel: '#4D4A4A',

  ColorTextSubtitle: '#606060',
  ColorTextInput: '#000000',
  ColorTextError: colors.red,
  ColorTextPlaceholder: '#dbdbdb',
  ColorBtnPrimary: '#ffbb00', // Primary, Secondary, Success, Danger, Warning, Info, Light, Dark, Link
  ColorBtnSecondary: '#444444',
  ColorBtnSuccess: '#00b7ee',
  ColorBtnDefault: '#444444',
  ColorBtnStyle: 'white',
  ColorBorderInput: '#000000',
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
};

export const dark = {
  ColorPrimary: '#ffbb00',
  ColorSecond: '#82b6ed',
  ColorError: colors.red,
  ColorInputLabel: '#4D4A4A',

  ColorTextSubtitle: '#606060',
  ColorTextInput: '#000000',
  ColorTextError: colors.red,
  ColorTextPlaceholder: '#dbdbdb',
  ColorBtnPrimary: '#ffbb00',
  ColorBtnSecondary: '#444444',
  ColorBtnSuccess: '#00b7ee',
  ColorBtnDefault: '#444444',
  ColorBtnStyle: 'white',
  ColorBorderInput: '#000000',
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
};

export const theme = {
  light,
  dark
};

export const createTheme = (type: ThemeType, language: LanguageType): Partial<Theme> & Partial<DefaultTheme> =>
{
  let lan;
  switch (language)
  {
    case LanguageType.EN:
      lan = koFont;
      break;
    default:
      lan = enFont;
      break;
  }

  switch (type)
  {
    case ThemeType.LIGHT:
      return { ...lan, ...theme.light };
    case ThemeType.DARK:
      return { ...lan, ...theme.dark };
    default: return { ...lan, ...theme.light };
  }
};
