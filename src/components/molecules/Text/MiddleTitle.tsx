import * as React from 'react';

import styled, { DefaultTheme } from 'styled-components/native';

interface StyledCPorps {
  theme: DefaultTheme;
  errorText?: string;
  focused?: boolean;
  disabled?: boolean;
}

const TitleWrap = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12;
`;
const Title = styled.Text`
  font-family: ${(props: StyledCPorps): string => props.theme.FontMiddleTitle};
  font-size: 18;
  color: ${(props: StyledCPorps): string | null => props.focused
    ? props.theme.ColorSecond : props.theme.ColorInputLabel};
`;
const SubTitle = styled.Text`
  font-family: ${(props: StyledCPorps): string => props.theme.FontTitle};;
  font-size: 14;
  font-weight: 100;
  color: ${(props: StyledCPorps): string | null => props.theme.ColorTextSubtitle};
`;

interface Props {
  label: string;
  subLabel?: string;
  errorText?: string;
  focused?: boolean;
}
const MiddleTitle: React.FC<Props> = (props) =>
{
  return (
    <TitleWrap>
      {!!props.label && (
        <Title errorText={props.errorText} focused={props.focused}>
          {props.label}
        </Title>
      )}
      {!!props.subLabel && <SubTitle focused={props.focused}>{props.subLabel}</SubTitle>}
    </TitleWrap>
  );
};

export default MiddleTitle;
