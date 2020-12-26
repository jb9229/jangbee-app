import styled, { DefaultTheme } from 'styled-components/native';

interface StyleProps {
  theme: DefaultTheme;
  size?: number;
}

export const LText = styled.Text<StyleProps>`
  font-family: ${(props: StyleProps): string => props.theme.FontMiddleTitle};
  font-size: ${({ size }): number => (size ? size : 16)}px;
  line-height: ${(props: StyleProps): number =>
    props.size ? props.size + 8 : 24};
  color: ${({ theme }) => theme.ColorTextBlack};
`;

export const MText = styled.Text<StyleProps>`
  font-family: ${(props: StyleProps): string => props.theme.FontTitle};
  font-size: ${({ size }): number => (size ? size : 16)}px;
  line-height: ${(props: StyleProps): number =>
    props.size ? props.size + 8 : 24}px;
  color: ${({ theme }) => theme.ColorTextBlack};
`;

/**
 * Default font-size is 14
 */
export const RText = styled.Text<StyleProps>`
  font-family: ${({ theme }): string => theme.FontBatang};
  font-size: ${({ size }): number => (size ? size : 16)}px;
  line-height: ${({ size }): number => (size ? size + 8 : 24)}px;
  color: ${({ theme }) => theme.ColorTextBlack};
`;
