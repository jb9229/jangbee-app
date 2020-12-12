import * as React from 'react';

import { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native';
import styled, { DefaultTheme } from 'styled-components/native';

interface StyleProps {
  theme: DefaultTheme;
  iconDelete?: boolean;
}
const ButtonTO = styled.TouchableOpacity`
  height: 30;
  flex-direction: row;
  align-items: center;
  justify-content: ${(props): string =>
    props.iconDelete ? 'center' : 'space-between'};
  padding: 0 12px;
  background-color: ${(props): string => props.theme.ColorBGGray};
  border-width: 1px;
  border-color: ${(props: StyleProps): string => props.theme.ColorBorderBtn};
  border-radius: 30;
`;
const ButtonText = styled.Text`
  color: white;
`;
const DeleteIcon = styled.Image`
  width: 13;
  height: 13;
  tint-color: white;
`;

interface Props {
  text?: string;
  disabled?: boolean;
  onClick?: () => void;
  iconDelete?: boolean;
  wrapperStyle?: StyleProp<ViewStyle>;
  btnTextStyle?: StyleProp<TextStyle>;
  deletBtnTextStyle?: StyleProp<ImageStyle>;
}
const RoundButton: React.FC<Props> = props => {
  return (
    <ButtonTO
      onPress={props.onClick}
      disabled={props.disabled}
      iconDelete={props.iconDelete}
      style={props.wrapperStyle}
    >
      {props.iconDelete ? (
        <DeleteIcon
          style={props.deletBtnTextStyle}
          source={require('/assets/icons/close/close.png')}
        />
      ) : (
        <ButtonText style={props.btnTextStyle}>{props.text}</ButtonText>
      )}
    </ButtonTO>
  );
};

export default RoundButton;
