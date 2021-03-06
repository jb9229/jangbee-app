import { DefaultTheme } from 'styled-components/native';

export interface DefaultStyledProps {
  theme: DefaultTheme;
}

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
  red: '#FF0000',
};

/**
 * fontSize:
 * 13: 바탕
 * 15: 기본
 * 17: 기본
 * 19: 타이틀
 * 21: 대 타이틀
 * */
export const koFont = {
  FontTitleTop: 'NanumPen',
  FontTitle: 'NanumBarunGothic',
  FontMiddleTitle: 'SsangmundongGulimB',
  FontBatang: 'NanumSquareRoundR',
  FontButton: 'NanumBarunGothic',
};

export const enFont = {
  FontTitleTop: 'NanumPen',
  FontTitle: 'NanumBarunGothic',
  FontMiddleTitle: 'SsangmundongGulimB',
  FontBatang: 'NanumSquareRoundR',
  FontButton: 'NanumBarunGothic',
};

export const light = {
  // Theme Color
  ColorPrimary: '#ffbb00',
  ColorPrimaryDark: 'rgb(247, 174, 67)', // #F7AE43
  ColorPrimaryLight: 'rgb(251, 198, 137)', // #FBC689
  ColorPrimaryBatang: 'rgb(253, 239, 219)', // #FBC689
  ColorBatangDark: '#175AA8',
  ColorBatang: '#82b6ed',
  ColorBatangLight: '#D3E5F9',
  ColorBatangWhite: '#ECF5FF',
  ColorSecond: '#82b6ed',
  ColorError: colors.red,
  ColorInvariable: colors.paleGray,
  ColorInputLabel: '#4D4A4A',
  ColorActivityIndicator: '#FDCA24',

  // Text Color
  ColorTextBlack: 'rgb(34,34,34)', // #222222
  ColorTextDisable: 'rgb(170,170,170)', // #aaaaaa
  ColorTextSubtitle: '#606060',
  ColorTextInput: '#000000',
  ColorTextError: colors.red,
  ColorTextPlaceholder: '#dbdbdb',
  ColorTextplaceholderDark: '#8c8c8c',

  ColorBtnPrimary: '#ffbb00', // Primary, Secondary, Success, Danger, Warning, Info, Light, Dark, Link
  ColorBtnSecondary: '#444444',
  ColorBtnSuccess: '#00b7ee',
  ColorBtnDefault: '#444444',
  ColorBtnStyle: 'white',

  // Background Color
  ColorBGBlack: 'rgb(62, 57, 54)', // #3E3936
  ColorBGDarkGray: '#3E3936',
  ColorBGGray: '#d7d7d7',
  ColorBGLightGray: 'rgb(245, 245, 245)', // #f5f5f5
  ColorBGYellowBatang: '#FDEFDB',
  ColorBGYellowBatangLight: '#fef4e7',
  background: colors.lightBackground,
  backgroundDark: colors.dodgerBlue,

  // Border
  ColorBorderList: '#E3DCDC',
  ColorBorderTextInput: 'rgb(238,238,238)', // #eeeeee
  ColorBorderBtn: 'rgb(238,238,238)', // #eeeeee

  btnPrimary: colors.skyBlue,
  btnPrimaryFont: 'white',
  btnPrimaryLight: colors.whiteGray,
  btnPrimaryLightFont: 'black',
  textDisabled: '#969696',
  btnDisabled: 'rgb(224,224,224)',
  fontColor: 'black',
  tintColor: '#333333',
  lineColor: colors.paleGray,
};

export const dark = {
  // Theme Color
  ColorPrimary: '#ffbb00',
  ColorPrimaryDark: 'rgb(247, 174, 67)', // #F7AE43
  ColorBatangDark: '#175AA8',
  ColorBatang: '#82b6ed',
  ColorBatangLight: '#D3E5F9',
  ColorBatangWhite: '#ECF5FF',
  ColorSecond: '#82b6ed',
  ColorError: colors.red,
  ColorInputLabel: '#4D4A4A',
  ColorActivityIndicator: '#FDCA24',

  // Text Color
  ColorTextBlack: 'rgb(34,34,34)', // #222222
  ColorTextDisable: 'rgb(170,170,170)', // #aaaaaa
  ColorTextSubtitle: '#606060',
  ColorTextInput: '#000000',
  ColorTextError: colors.red,
  ColorTextPlaceholder: '#dbdbdb',
  ColorTextplaceholderDark: '#8c8c8c',

  ColorBtnPrimary: '#ffbb00',
  ColorBtnSecondary: '#444444',
  ColorBtnSuccess: '#00b7ee',
  ColorBtnDefault: '#444444',
  ColorBtnStyle: 'white',

  // Background Color
  ColorBGBlack: 'rgb(62, 57, 54)', // #3E3936
  ColorBGDarkGray: '#3E3936',
  ColorBGGray: '#d7d7d7',
  ColorBGLightGray: '#E3DCDC',
  ColorBGYellowBatang: '#FDEFDB',
  ColorBGYellowBatangLight: '#fef4e7',

  // Border
  ColorBorderList: '#E3DCDC',
  ColorBorderTextInput: 'rgb(238,238,238)', // #eeeeee
  ColorBorderBtn: 'rgb(238,238,238)', // #eeeeee

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
  lineColor: colors.paleGray,
};

export const theme = {
  light,
  dark,
};

export const createTheme = (
  type: ThemeType,
  language: LanguageType
): DefaultTheme => {
  let lan;
  switch (language) {
    case LanguageType.EN:
      lan = koFont;
      break;
    default:
      lan = enFont;
      break;
  }

  switch (type) {
    case ThemeType.LIGHT:
      return { ...lan, ...theme.light };
    case ThemeType.DARK:
      return { ...lan, ...theme.dark };
    default:
      return { ...lan, ...theme.light };
  }
};
