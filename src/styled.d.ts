import 'styled-components';

declare module 'styled-components/native' {
  export interface DefaultTheme {
    ColorPrimary: string;
    ColorError: string;
    ColorTextSubtitle: string;
    ColorTextInput: string;
    ColorTextError: string;
    ColorBtnPrimary: string;
    ColorBtnSecondary: string;
    ColorBtnSuccess: string;
    ColorBtnDefault: string;
    ColorBtnStyle: string;
    ColorBorderInput: string;
    ColorBGGray: string;
    background: string;
    backgroundDark: string;
    btnPrimary: string;
    btnPrimaryFont: string;
    btnPrimaryLight: string;
    btnPrimaryLightFont: string;
    btnDisabled: string;
    textDisabled: string;
    fontColor: string;
    tintColor: string;
    lineColor: string;
  }
}
