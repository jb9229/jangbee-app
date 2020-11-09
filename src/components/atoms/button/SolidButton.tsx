import {
  TextProps,
  TextStyle,
  TouchableOpacityProps,
  ViewStyle
} from 'react-native';
import styled, { DefaultTheme, withTheme } from 'styled-components/native';

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
const SolidButton: React.FC<Props> = props =>
{
  const { theme, rootStyle, buttonStyle, textStyle } = props;
  const btnRootStyle = { flex: 1, ...rootStyle };
  const btnStyle: ViewStyle = {
    width: '100%',
    backgroundColor: '#82b6ed',
    ...buttonStyle
  };
  const bntTextStyle: TextStyle = {
    color: 'white',
    fontFamily: koFont.FontButton,
    fontSize: 15,
    fontWeight: 'bold',
    ...textStyle
  };

  // console.log('>>> theme: ', theme);
  // console.log('>>> props: ', props);
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

export default withTheme(SolidButton);
