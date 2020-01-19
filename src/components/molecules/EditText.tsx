import * as React from 'react';

import {
  NativeSyntheticEvent,
  StyleProp,
  TextStyle,
  ViewStyle
} from 'react-native';
import styled, { DefaultTheme } from 'styled-components/native';

// Styled Component
interface StyledCPorps {
  theme: DefaultTheme;
  errorText?: string;
  focused?: boolean;
  disabled?: boolean;
}

const Container = styled.View`
`;
const TitleWrap = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12;
`;
const Title = styled.Text`
  font-family: ${(props: StyledCPorps): string => props.theme.FontMiddleTitle};
  font-size: 16;
  color: ${(props: StyledCPorps): string => props.disabled ? props.theme.ColorBGGray : props.theme.ColorInputLabel};
`;
const SubTitle = styled.Text`
  font-family: ${(props: StyledCPorps): string => props.theme.FontMiddleTitle};;
  color: ${(props: StyledCPorps): string => props.theme.ColorInputLabel};
  font-size: 14;
`;
const TextInput = styled.TextInput`
  padding-left: 16;
  padding-right: 16;
  padding-top: 16;
  padding-bottom: 16;
  border-width: 1;
  border-radius: 5;
  ${(props: StyledCPorps): string | null => props.focused ? `border-color: ${props.theme.ColorPrimary};` : null}
  ${(props: StyledCPorps): string | null => props.errorText ? `border-color: ${props.theme.ColorError};` : null}
  color: ${(props: StyledCPorps): string => props.theme.ColorTextInput};
`;
const ErrorText = styled.Text`
  font-family: Rubik-Regular;
  font-size: 12;
  font-weight: 500;
  margin-top: 5;
  color: ${(props: StyledCPorps): string => props.theme.ColorError};
`;

export enum KeyboardType {
  default = 'defalult',
  number = 'number-pad'
}
interface Props {
  parentTestID?: string;
  titleTestID?: string;
  testID?: string;
  errorTestID?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  label?: string;
  subLabel?: string;
  errorText?: string;
  text: string;
  keyboardType?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  disabled?: boolean;
  maxLength?: number;
  onSubmitEditing?: (e: NativeSyntheticEvent<any>) => void;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
}

function EditText (props: Props): React.ReactElement
{
  const [focused, setFocus] = React.useState(false);
  const [text, setText] = React.useState<string>(props.text);

  return (
    <Container testID={props.parentTestID} style={[props.style]}>
      <TitleWrap>
        {!!props.label && (
          <Title testID={props.titleTestID} errorText={props.errorText} focused={focused} disabled={props.disabled}>
            {props.label}
          </Title>
        )}
        {!!props.subLabel && <SubTitle>{props.subLabel}</SubTitle>}
      </TitleWrap>
      <TextInput
        testID={props.testID}
        style={[props.textStyle]}
        autoCapitalize={'none'}
        autoCorrect={false}
        focused={focused}
        onFocus={(): void => setFocus(true)}
        onBlur={(): void => setFocus(false)}
        onSubmitEditing={props.onSubmitEditing}
        placeholder={props.placeholder}
        placeholderTextColor="rgb(221,221,221)"
        value={text}
        keyboardType={props.keyboardType}
        onChangeText={(text): void =>
        {
          props.onChangeText(text);
          setText(text);
        }}
        secureTextEntry={props.secureTextEntry}
        disabled={props.disabled}
        maxLength={props.maxLength}
        errorText={props.errorText}
      ></TextInput>
      {props.errorText ? (
        <ErrorText testID={props.errorTestID}>
          {props.errorText}
        </ErrorText>
      ) : null}
    </Container>
  );
}

export default EditText;
