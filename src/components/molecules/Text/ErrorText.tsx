import * as React from 'react';

import styled, { DefaultTheme } from 'styled-components/native';

interface StyledCPorps {
  theme: DefaultTheme;
}
const Error = styled.Text`
  font-size: 12;
  font-weight: 500;
  margin-top: 5;
  color: ${(props: StyledCPorps): string => props.theme.ColorError};
`;

interface Props {
  text: string;
}
const ErrorText: React.FC<Props> = (props) => <Error>{props.text}</Error>;

export default ErrorText;
