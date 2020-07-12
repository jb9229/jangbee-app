/*******************
 * ENUM
 ******************/
export enum ScreenMode {
  LIST, REGISTER
}

export enum CashBackStatus {
  ENROLL = 'ENROLL',
  PAID = 'PAID'
}

/*******************
 * interface
 ******************/
export interface CashBack
{
  id?: string;
  accountId?: string;
  bank: string | undefined;
  amount: number | undefined;
  accountNumber: number | undefined;
  accountHolder: string | undefined;
  status?: CashBackStatus;
}

/*******************
 * class
 ******************/
export class CashBackCrtDto implements CashBack
{
  constructor (accountId: string)
  {
    this.accountId = accountId;
  }

  accountId: string;
  bank: string | undefined;
  amount: number | undefined;
  accountNumber: number | undefined;
  accountHolder: string | undefined;
  amountStr: string | undefined;
}

export class CashBackCrtError
{
  bank: string | undefined;
  amount: string | undefined;
  accountNumber: string | undefined;
  accountHolder: string | undefined;
}

export class ValidateCrtResult
{
  constructor (result: boolean, error: CashBackCrtError)
  {
    this.result = result;
    this.error = error;
  }

  result: boolean
  error: CashBackCrtError;
}
