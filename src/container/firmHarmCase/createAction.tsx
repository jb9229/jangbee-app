import * as api from 'api/api';
import * as yup from 'yup';

import { FirmHarmCaseCreateDto, FirmHarmCaseCreateErrorDto } from "./type";

import { PHONENUMBER_REGULAR_EXPRESSION } from '../firm/types';
import getString from 'src/STRING';

export const createFirmHarmCase = (accountId: string, dto: FirmHarmCaseCreateDto): Promise<object> => {
  console.log('>>> createDto: ', dto)
  return api.createClientEvaluation({accountId, ...dto, amount: `${dto.amount}`});
}

export const validateCrateFirmHarmCase = (dto: FirmHarmCaseCreateDto, errorDto: FirmHarmCaseCreateErrorDto): Promise<boolean> => {
  return ValidSchemeCrateFirmHarmCase.validate(dto, { abortEarly: false })
    .then((result) => { return true })
    .catch((err) =>
    {
      err.errors.forEach((e: string) =>
      {
        if (e.startsWith('[reason]')) { errorDto.reason = (e.replace('[reason]', '')) };
        if (e.startsWith('[telNumber]')) { errorDto.telNumber = (e.replace('[telNumber]', '')) };
      });

      return false;
    });
}

export const ValidSchemeCrateFirmHarmCase = yup.object({
  telNumber: yup.string()
    .required(`[telNumber]${getString('VALIDATION_REQUIRED')}`)
    .matches(PHONENUMBER_REGULAR_EXPRESSION, `[telNumber]${getString('VALIDATION_NUMBER_INVALID')}`),
  reason: yup.string()
    .required(`[reason]${getString('VALIDATION_REQUIRED')}`)
    .min(1, `[reason]${getString('VALIDATION_NUMBER_INVALID')}(1~ )`)
});