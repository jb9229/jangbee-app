import { DefaultTheme, withTheme } from 'styled-components/native';
import {
  TextProps,
  TextStyle,
  TouchableOpacityProps,
  ViewStyle
} from 'react-native';

import { Button } from 'dooboo-ui';
import React from 'react';
import { koFont } from 'src/theme';

interface Props {
  theme: DefaultTheme;
  testID?: string;
  indicatorColor?: string;
  loading?: boolean;
  disabled?: boolean;
  leftElement?: React.ReactElement;
  rightElement?: React.ReactElement;
  activeOpacity?: number;
  text?: string;
  onPress?: () => void;
  touchableOpacityProps?: Partial<TouchableOpacityProps>;
  textProps?: Partial<TextProps>;
  rootStyle?: ViewStyle;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
}
const GhostButton: React.FC<Props> = props =>
{
  const { theme, rootStyle, buttonStyle, textStyle } = props;
  const btnRootStyle = { flex: 1, ...rootStyle };
  const btnStyle = {
    width: '100%',
    borderWidth: 1,
    borderColor: theme.ColorPrimary,
    ...buttonStyle
  };
  const bntTextStyle = {
    color: theme.ColorPrimary,
    fontFamily: koFont.FontButton,
    fontSize: 15,
    ...textStyle
  };
  return (
    <Button
      {...props}
      style={{
        root: btnRootStyle,
        button: btnStyle,
        text: bntTextStyle
      }}
    />
  );
};

export default withTheme(GhostButton);
