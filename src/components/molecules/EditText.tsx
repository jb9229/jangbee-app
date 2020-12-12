import * as React from 'react';

import {
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  StyleProp,
  TextInputProps,
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
  unchangeable?: boolean;
}

const Container = styled.View`
  margin-top: 15px;
  padding-top: 10px;
`;
const TextInput = styled.TextInput`
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 16px;
  padding-bottom: 16px;
  border-width: 1px;
  border-radius: 5px;
  ${(props: StyledCPorps): string | null =>
    props.focused ? `border-color: ${props.theme.ColorSecond};` : null}
  ${(props: StyledCPorps): string | null =>
    props.errorText ? `border-color: ${props.theme.ColorError};` : null}
  ${(props: StyledCPorps): string | null =>
    props.unchangeable ? `border-color: ${props.theme.ColorInvariable};` : null}
  color: ${(props: StyledCPorps): string => props.theme.ColorTextInput};
`;

export enum KeyboardType {
  default = 'defalult',
  number = 'number-pad',
}
interface Props {
  parentTestID?: string;
  titleTestID?: string;
  testID?: string;
  errorTestID?: string;

  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;

  ref?: any;
  label?: string;
  subLabel?: string;
  errorText?: string;
  text?: TextInputProps['value'];
  keyboardType?: KeyboardTypeOptions;
  placeholder?: string;
  secureTextEntry?: boolean;
  unchangeable?: boolean;
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
  onSubmitEditing?: (e: NativeSyntheticEvent<any>) => void;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
}

const EditText: React.RefForwardingComponent<null, Props> = (
  props: Props,
  ref
) => {
  const [focused, setFocus] = React.useState(false);
  const [text, setText] = React.useState<string>(props.text);

  React.useEffect(() => {
    setText(props.text);
    props.onChangeText(props.text);
  }, [props.text]);

  return (
    <Container testID={props.parentTestID} style={[props.style]}>
      <MiddleTitle
        label={props.label}
        subLabel={props.subLabel}
        errorText={props.errorText}
        focused={focused}
        unchangeable={props.unchangeable}
      />
      <TextInput
        ref={ref}
        testID={props.testID}
        style={[props.textStyle]}
        autoCapitalize={'none'}
        autoCorrect={false}
        multiline={props.multiline}
        numberOfLines={props.numberOfLines}
        focused={focused}
        onFocus={(): void => setFocus(true)}
        onBlur={(): void => setFocus(false)}
        onSubmitEditing={props.onSubmitEditing}
        placeholder={props.placeholder}
        placeholderTextColor="rgb(221,221,221)"
        value={text}
        keyboardType={props.keyboardType}
        onChangeText={(text): void => {
          props.onChangeText(text);
          setText(text);
        }}
        secureTextEntry={props.secureTextEntry}
        editable={!props.unchangeable}
        unchangeable={props.unchangeable}
        maxLength={props.maxLength}
        errorText={props.errorText}
      />
      {!!props.errorText && <ErrorText text={props.errorText} />}
    </Container>
  );
};

export default React.forwardRef(EditText);
