import * as React from 'react';

import {
  NativeSyntheticEvent,
  StyleProp,
  TextStyle,
  ViewStyle,
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
  padding-top: 10px;
`;
const TextTO = styled.TouchableOpacity`
  padding-left: 16;
  padding-right: 16;
  padding-top: 21;
  padding-bottom: 21;
  background-color: ${(props: StyledCPorps): string =>
    props.theme.ColorBGYellowBatangLight};
  border-width: 1px;
  border-radius: 5px;
  ${(props: StyledCPorps): string | null =>
    props.focused ? `border-color: ${props.theme.ColorSecond};` : null}
  ${(props: StyledCPorps): string | null =>
    props.errorText ? `border-color: ${props.theme.ColorError};` : null}
  color: ${(props: StyledCPorps): string => props.theme.ColorTextInput};
`;
const Placeholder = styled.Text`
  font-size: 14px;
  color: ${(props: StyledCPorps): string =>
    props.theme.ColorTextplaceholderDark};
`;
const Text = styled.Text`
  font-size: 14px;
`;

export enum KeyboardType {
  default = 'defalult',
  number = 'number-pad',
}
interface Props {
  label: string;
  subLabel?: string;
  text: string;
  placeholder?: string;
  errorText?: string;
  style?: ViewStyle;
  onPress: () => void;
}

function SelectText(props: Props): React.ReactElement {
  // const [selectText, setSelectText] = React.useState(props.text);
  // React.useEffect(() =>
  // {
  //   setSelectText(props.text);
  // }, [props.text]);

  return (
    <Container style={props.style}>
      <MiddleTitle label={props.label} subLabel={props.subLabel} />
      <TextTO onPress={props.onPress} errorText={props.errorText}>
        {props.text ? (
          <Text>{props.text}</Text>
        ) : (
          !!props.placeholder && <Placeholder>{props.placeholder}</Placeholder>
        )}
      </TextTO>
      {!!props.errorText && <ErrorText text={props.errorText} />}
    </Container>
  );
}

export default SelectText;
