export class FirmChatCrtDto
{

}

export enum EvaluListType {
  NONE, MINE, LATEST, SEARCH // NONE: chatmode
}

export enum CallHistoryType {
  INCOMING = 1, OUTGOING = 2, MISSED = 3
}

export interface CallHistory {
  rawType: CallHistoryType;
  type: string;
  dateTime: string;
  timestamp: string;
  name: string;
  duration: number;
  phoneNumber: string;
}

export interface HarmCase {
  accountId: string;
  reason: string;
  local: string;
  likeCount: number;
  unlikeCount: number;
  firmName: string;
  firmNumber: string;
  cliName: string;
  telNumber: string;
  telNumber2: string;
  telNumber3: string;
  searchTime: string;
}

export class FirmHarmCaseCreateDto {
  constructor() {
    this.reason = '';
    this.local = '';
    this.firmName = '';
    this.cliName = '';
    this.telNumber = '';
    this.telNumber2 = '';
    this.telNumber3 = '';
    this.searchTime = '';
    this.equipment = '';
    this.regiTelNumber = '';
    this.amount = 0;
  }
  reason: string;
  local: string;
  firmName: string;
  firmNumber: string | undefined;
  cliName: string;
  telNumber: string;
  telNumber2: string;
  telNumber3: string;
  searchTime: string;
  equipment: string;
  regiTelNumber: string;
  amount: number;
}

export class FirmHarmCaseCreateErrorDto {
  constructor() {
    this.reason = '';
    this.local = '';
    this.firmName = '';
    this.firmNumber = '';
    this.cliName = '';
    this.telNumber = '';
    this.telNumber2 = '';
    this.telNumber3 = '';
    this.searchTime = '';
    this.equipment = '';
    this.regiTelNumber = '';
    this.amount = '';
  }

  reason: string;
  local: string;
  firmName: string;
  firmNumber: string;
  cliName: string;
  telNumber: string;
  telNumber2: string;
  telNumber3: string;
  searchTime: string;
  equipment: string;
  regiTelNumber: string;
  amount: string;
}
