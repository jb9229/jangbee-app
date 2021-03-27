import search from 'src/container/firmHarmCase/search';

export type AuthStackParamList = {
  NotFound: undefined;
  SignIn: undefined;
  Signup: { fbUser?: firebase.User };
  AuthLoading: undefined;
};

/********************
 * Client Navigation Params
 *********************/
export type ClientBottomTabParamList = {
  ClientHome: undefined;
  WorkList: { refresh: boolean };
  ClientInfo: undefined;
  NotFound: undefined;
};

export type ClientWorkParamList = {
  WorkList: undefined;
  WorkRegister: undefined;
  AppliFirmList: undefined;
};

/********************
 * Firm Navigation Params
 *********************/
export type FirmBottomTabParamList = {
  NotFound: undefined;
  FirmHome: undefined;
  WorkList: undefined;
  FirmSetting: undefined;
  Ad: undefined;
  ClientEvalu: undefined;
};

export type FirmWorkParamList = {
  WorkList: { refresh?: boolean };
  WorkRegister: { firmRegister?: boolean };
  AppliFirmList: undefined;
};

export type FirmSettingParamList = {
  FirmSetting: undefined;
  FirmMyInfo: undefined;
  FirmRegister: undefined;
  FirmUpdate: undefined;
  ServiceTerms: undefined;
  Cashback: undefined;
  ClientHomeModal: undefined;
  CallLog: undefined;
};

export type AdParamList = {
  Ad: undefined;
  AdCreate: undefined;
};

export type ClientEvaluParamList = {
  ClientEvalu: { search?: string };
  FirmHarmCaseCreate: undefined;
  FirmHarmCaseUpdate: undefined;
  FirmHarmCaseSearch: {
    searchWord?: string;
    initSearch?: string;
    initSearchAll?: boolean;
    initSearchMine?: boolean;
  };
};
