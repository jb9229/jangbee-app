import styled, { DefaultTheme } from 'styled-components/native';

interface StyleProps {
  theme: DefaultTheme;
  size?: number;
}

export const LText = styled.Text`
  font-Family: ${(props: StyleProps): string => props.theme.FontLight};
  font-size: ${(props: StyleProps): number => props.size ? props.size : 14};
  line-height: ${(props: StyleProps): number => props.size ? props.size + 8 : 22};
`;

export const MText = styled.Text`
  font-Family: ${(props: StyleProps): string => props.theme.FontMedium};
  font-size: ${(props: StyleProps): number => props.size ? props.size : 14};
  line-height: ${(props: StyleProps): number => props.size ? props.size + 8 : 22};
`;

/**
 * Default font-size is 14
 */
export const RText = styled.Text`
  font-Family: ${(props: StyleProps): string => props.theme.FontRegular};
  font-size: ${(props: StyleProps): number => props.size ? props.size : 14};
  line-height: ${(props: StyleProps): number => props.size ? props.size + 8 : 22};
`;
