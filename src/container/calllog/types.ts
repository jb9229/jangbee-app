export interface CallLog {
  callerPhoneNumber: string;
  timestamp: number;
}
export interface CallLogQueryRsp {
  callLogs: {
    callTime: number;
    _id: string;
    caller: string;
    callerPhoneNumber: string;
    callee: string;
    calleePhoneNumber: string;
    timestamp: string;
  }[];
}
