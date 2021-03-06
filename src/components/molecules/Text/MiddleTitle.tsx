import * as React from 'react';

import styled, { DefaultTheme } from 'styled-components/native';

interface StyledCPorps {
  theme: DefaultTheme;
  errorText?: string;
  focused?: boolean;
  unchangeable?: boolean;
}

const TitleWrap = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

const Title = styled.Text`
  font-family: ${(props: StyledCPorps): string => props.theme.FontMiddleTitle};
  font-size: 18px;
  color: ${(props: StyledCPorps): string | null =>
    props.unchangeable
      ? props.theme.ColorInvariable
      : props.focused
      ? props.theme.ColorSecond
      : props.theme.ColorInputLabel};
`;

const SubTitle = styled.Text`
  font-family: ${(props: StyledCPorps): string => props.theme.FontTitle};
  font-size: 14px;
  font-weight: 100;
  color: ${(props: StyledCPorps): string | null =>
    props.theme.ColorTextSubtitle};
`;

interface Props {
  label: string;
  subLabel?: string;
  errorText?: string;
  focused?: boolean;
  unchangeable?: boolean;
}
const MiddleTitle: React.FC<Props> = props => {
  return (
    <TitleWrap>
      {!!props.label && (
        <Title
          errorText={props.errorText}
          focused={props.focused}
          unchangeable={props.unchangeable}
        >
          {props.label}
        </Title>
      )}
      {!!props.subLabel && (
        <SubTitle focused={props.focused}>{props.subLabel}</SubTitle>
      )}
    </TitleWrap>
  );
};

export default MiddleTitle;
