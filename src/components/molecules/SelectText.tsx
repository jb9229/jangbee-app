import * as React from 'react';

import {
  NativeSyntheticEvent,
  StyleProp,
  TextStyle,
  ViewStyle
} from 'react-native';
import styled, { DefaultTheme } from 'styled-components/native';

import ErrorText from 'src/components/molecules/Text/ErrorText';
import MiddleTitle from 'src/components/molecules/Text/MiddleTitle';

// Styled Component
interface StyledCPorps {
  theme: DefaultTheme;
  errorText?: string;
  focused?: boolean;
  disabled?: boolean;
}

const Container = styled.View`
  margin-top: 15px;
`;
const TextTO = styled.TouchableOpacity`
  padding-left: 16;
  padding-right: 16;
  padding-top: 21;
  padding-bottom: 21;
  border-width: 1;
  border-radius: 5;
  ${(props: StyledCPorps): string | null => props.focused ? `border-color: ${props.theme.ColorSecond};` : null}
  ${(props: StyledCPorps): string | null => props.errorText ? `border-color: ${props.theme.ColorError};` : null}
  color: ${(props: StyledCPorps): string => props.theme.ColorTextInput};
`;
const Placeholder = styled.Text`
  font-size: 14;
  color: ${(props: StyledCPorps): string => props.theme.ColorTextPlaceholder};
`;
const Text = styled.Text`
  font-size: 14;
`;

export enum KeyboardType {
  default = 'defalult',
  number = 'number-pad'
}
interface Props {
  label: string;
  subLabel?: string;
  text: string;
  placeholder?: string;
  errorText?: string;
  onPress: () => void;
}

function SelectText (props: Props): React.ReactElement
{
  return (
    <Container>
      <MiddleTitle label={props.label} subLabel={props.subLabel} />
      <TextTO onPress={props.onPress} errorText={props.errorText}>
        {props.text ? <Text>{props.text}</Text>
          : (!!props.placeholder && <Placeholder>{props.placeholder}</Placeholder>)}
      </TextTO>
      {!!props.errorText && <ErrorText text={props.errorText} />}
    </Container>
  );
}

export default SelectText;
