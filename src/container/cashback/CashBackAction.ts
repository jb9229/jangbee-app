import { CashBackCrtDto, CashBackCrtError, ValidateCrtResult } from 'src/container/cashback/type';

export const validateCrtDto = (crtDto: CashBackCrtDto, availAmount: number): ValidateCrtResult =>
{
  let result = true;
  const validError = new CashBackCrtError();

  const amountStr = crtDto.amountStr;

  const amountNum = Number.parseInt(amountStr);
  const accountNum = Number.parseInt(`${crtDto.accountNumber}`);
  console.log('>>> accountNum:', accountNum);
  if (isNaN(amountNum) || amountNum < 10000 || amountNum > availAmount)
  {
    result = false;
    result = false; validError.amount = '캐쉬백금액이 유효하지 않습니다(10,000 ~ 보유금액)';
  }
  else
  {
    crtDto.amount = amountNum;
  }

  if (!crtDto.accountHolder) { result = false; validError.accountHolder = '예금주 값은 필수 입니다' }
  if (!crtDto.accountNumber || isNaN(accountNum)) { result = false; validError.accountNumber = '계좌번호는 필수이고 숫자만 허용 합니다' }
  if (!crtDto.bank) { result = false; validError.bank = '은행명은 필수 입니다' }

  return new ValidateCrtResult(result, validError);
};
