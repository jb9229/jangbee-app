import { StyleProp, TextStyle } from 'react-native';

import { SFC } from 'react';
import { number } from 'prop-types';

export interface User {
  uid: string;
  displayName: string;
  photoURL: string;
  statusMsg: string;
}

interface IconProps {
  style?: StyleProp<TextStyle>;
  width?: number | string;
  height?: number | string;
  children?: never;
}

export type IconType = SFC<IconProps>;

export enum ThemeType {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

// Firm Object Type
export interface FirmHarmCaseCountData {
  totalCnt: number;
  myCnt: number;
}