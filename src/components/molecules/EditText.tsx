import * as React from 'react';

import {
  NativeSyntheticEvent,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle
} from 'react-native';
import styled, { DefaultTheme } from 'styled-components/native';

import TitleText from 'atoms/TitleText';

// Styled Component
interface StyledCPorps {
  theme?: DefaultTheme;
  errorText?: string;
  focused?: boolean;
}

const Container = styled.View`
`;

const Title = styled(TitleText)`
  margin-bottom: 12;
  color: ${(props: StyledCPorps): string =>
    props.errorText
      ? props.theme.ColorError
      : props.focused
        ? props.theme.ColorPrimary
        : props.theme.ColorTextInput};
`;

const TextInput = styled.TextInput`
  padding-left: 26;
  padding-right: 16;
  padding-top: 16;
  padding-bottom: 16;
  border-width: 1;
  border-radius: 5;
  border-color: ${({ theme }: StyledCPorps): string => theme.ColorBorderInput};
`;

const ErrorUnderline = styled.View`
  border-width: 0.8;
  border-color: ${({ theme }: StyledCPorps): string => theme.ColorError};
`;

const styles = StyleSheet.create({
  input: Platform.select({
    ios: {
      paddingLeft: 5,
      paddingRight: 5,
      paddingTop: 15,
      paddingBottom: 10,
      fontSize: 15,
      fontWeight: '500',
      color: '#2C374E'
    },
    android: {
      paddingLeft: 5,
      paddingRight: 5,
      paddingTop: 10,
      paddingBottom: 8,
      fontSize: 15,
      fontWeight: '500',
      color: '#2C374E'
    }
  }),
  errorText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 5,
    color: '#ff8989'
  }
});

interface Props {
  parentTestID?: string;
  titleTestID?: string;
  testID?: string;
  errorTestID?: string;
  style?: StyleProp<ViewStyle>;
  label?: string;
  textStyle?: StyleProp<TextStyle>;
  errorText?: string;
  text: any;
  placeholder?: string;
  secureTextEntry?: boolean;
  onSubmitEditing?: (e: NativeSyntheticEvent<any>) => void;
  onTextChanged?: (text: string | number) => void;
  onFocus?: () => void;
}

const EditText: React.FC<Props> = (props: Props) => {
  const [focused, setFocus] = React.useState(false);

  return (
    <Container testID={props.parentTestID} style={[props.style]}>
      {props.label ? (
        <Title testID={props.titleTestID} errorText={props.errorText} focused={focused}>
          {props.label}
        </Title>
      ) : null}
      <TextInput
        testID={props.testID}
        style={[styles.input, props.textStyle]}
        autoCapitalize={'none'}
        onFocus={(): void => setFocus(true)}
        onBlur={(): void => setFocus(false)}
        onSubmitEditing={props.onSubmitEditing}
        placeholder={props.placeholder}
        value={props.text}
        onChangeText={props.onTextChanged}
        secureTextEntry={props.secureTextEntry}
      ></TextInput>
      {props.errorText ? (
        <>
          <ErrorUnderline errorText={props.errorText} focused={focused}/>
          <Text testID={props.errorTestID} style={styles.errorText}>
            {props.errorText}
          </Text>
        </>
      ) : null}
    </Container>
  );
};

export default EditText;
