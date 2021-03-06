import { StyleProp, TextStyle } from 'react-native';

import { SFC } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';

export enum UserType {
  CLIENT = 1,
  FIRM = 2,
}

export interface User {
  uid: string;
  displayName: string;
  photoURL: string;
  statusMsg: string;
  phoneNumber: string;
}

export interface UserProfile {
  userType: UserType;
  uid: string;
  sid?: string;
  scanAppVersion?: string;
  phoneNumber: string;
}

export interface UserAssets {
  balance?: number;
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

export class PickerItem {
  constructor(label: string, value: any, key: any) {
    this.label = label;
    this.value = value;
    this.key = key;
  }

  key: string;
  label: string;
  value: string;
}

export type IconType = SFC<IconProps>;

/// /////////////////////////////////////////
/// ////// Work Type //////
/// /////////////////////////////////////////
export interface Work {
  accountId: string;
  addrLatitude: number;
  addrLongitude: number;
  address: string;
  addressDetail: string;
  applicantCount: number;
  applied: boolean;
  careerLimit: number;
  detailRequest: string;
  endDate: string;
  equipment: string;
  firmEstimated: string;
  firmRegister: boolean;
  guarTimeExpire: boolean;
  id: number;
  licenseLimit: string | null;
  matchedAccId: string | null;
  modelYearLimit: number;
  nondestLimit: string | null;
  overAcceptTime: boolean;
  period: number;
  selectNoticeTime: string | null;
  sidoAddr: string;
  sigunguAddr: string;
  startDate: string;
  workState: string;
}

export interface WebViewModalData {
  visible: boolean;
  url: string;
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
