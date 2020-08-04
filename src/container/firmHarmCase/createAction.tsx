import * as api from 'api/api';
import * as yup from 'yup';

import { FirmHarmCaseCreateDto, FirmHarmCaseCreateErrorDto } from "./type";

import { PHONENUMBER_REGULAR_EXPRESSION } from '../firm/types';
import getString from 'src/STRING';

export const createFirmHarmCase = (dto: FirmHarmCaseCreateDto): Promise<object> => {
  return api.createClientEvaluation(dto);
}

export const validateCrateFirmHarmCase = (dto: FirmHarmCaseCreateDto, errorDto: FirmHarmCaseCreateErrorDto) => {
  return ValidSchemeCrateFirmHarmCase.validate(dto, { abortEarly: false })
    .then(() => { return true })
    .catch((err) =>
    {
      err.errors.forEach((e: string) =>
      {
        if (e.startsWith('[reason]')) { errorDto.reason = (e.replace('[reason]', '')) };
        if (e.startsWith('[local]')) { errorDto.local = (e.replace('[local]', '')) };
        if (e.startsWith('[firmName]')) { errorDto.firmName = (e.replace('[firmName]', '')) };
        if (e.startsWith('[telNumber]')) { errorDto.telNumber = (e.replace('[telNumber]', '')) };
        if (e.startsWith('[equipment]')) { errorDto.equipment = (e.replace('[equipment]', '')) };
      });

      return errorDto;
    });
}

export const ValidSchemeCrateFirmHarmCase = yup.object({
  reason: yup.string()
    .required(`[reason]${getString('VALIDATION_REQUIRED')}`)
    .min(1, `[reason]${getString('VALIDATION_NUMBER_INVALID')}(1~ )`),
  local: yup.string()
    .required(`[local]${getString('VALIDATION_REQUIRED')}`)
    .min(1, `[local]${getString('VALIDATION_NUMBER_INVALID')}(1~ )`),
  firmName: yup.string()
    .required(`[firmName]${getString('VALIDATION_REQUIRED')}`)
    .min(1, `[firmName]${getString('VALIDATION_NUMBER_INVALID')}(1~ )`),
  telNumber: yup.string()
    .required(`[telNumber]${getString('VALIDATION_REQUIRED')}`)
    .matches(PHONENUMBER_REGULAR_EXPRESSION, `[telNumber]${getString('VALIDATION_NUMBER_INVALID')}`),
  equipment: yup.string()
    .required(`[equipment]${getString('VALIDATION_REQUIRED')}`)
    .min(1, `[equipment]${getString('VALIDATION_NUMBER_INVALID')}(1~ )`)
});