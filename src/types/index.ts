import { StyleProp, TextStyle } from 'react-native';

import { SFC } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';

export enum UserType {
  CLIENT = 1,
  FIRM = 2
}

export interface User {
  uid: string;
  displayName: string;
  photoURL: string;
  statusMsg: string;
}

export interface UserProfile {
  userType: UserType;
  sid?: string;
}

interface IconProps {
  style?: StyleProp<TextStyle>;
  width?: number | string;
  height?: number | string;
  children?: never;
}

export interface MapAddress {
  address: string;
  sidoAddr: string;
  sigunguAddr: string;
  addrLongitude: string;
  addrLatitude: string;
}

export class PickerItem
{
  constructor (label: string, value: any, key: any)
  {
    this.label = label;
    this.value = value;
    this.key = key;
  }

  key: string;
  label: string;
  value: string;
}

export type IconType = SFC<IconProps>;

// Firm Object Type
export interface FirmHarmCaseCountData {
  totalCnt: number;
  myCnt: number;
}

/**
 * React Navigation Types
 * */
type StackParamList = {
  Default: undefined;
};

export type DefaultNavigationProps<
  T extends keyof StackParamList = 'Default'
> = StackNavigationProp<StackParamList, T>;
