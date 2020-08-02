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
