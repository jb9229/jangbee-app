import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
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
    btnDisabled: string;
    textDisabled: string;
    fontColor: string;
    tintColor: string;
    lineColor: string;
  }
}
