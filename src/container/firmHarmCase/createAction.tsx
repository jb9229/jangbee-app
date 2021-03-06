import * as yup from 'yup';

import { FirmHarmCaseCreateDto, FirmHarmCaseCreateErrorDto } from './type';

import { PHONENUMBER_REGULAR_EXPRESSION } from '../firm/types';
import getString from 'src/STRING';

export const validateCrateFirmHarmCase = (
  dto: FirmHarmCaseCreateDto,
  errorDto: FirmHarmCaseCreateErrorDto
): Promise<boolean> => {
  return ValidSchemeCrateFirmHarmCase.validate(dto, { abortEarly: false })
    .then(() => {
      return true;
    })
    .catch(err => {
      err.errors.forEach((e: string) => {
        if (e.startsWith('[reason]')) {
          errorDto.reason = e.replace('[reason]', '');
        }
        if (e.startsWith('[telNumber]')) {
          errorDto.telNumber = e.replace('[telNumber]', '');
        }
        if (e.startsWith('[firmName]')) {
          errorDto.firmName = e.replace('[firmName]', '');
        }
      });

      return false;
    });
};

export const ValidSchemeCrateFirmHarmCase = yup.object({
  telNumber: yup
    .string()
    .required(`[telNumber]${getString('VALIDATION_REQUIRED')}`)
    .matches(
      PHONENUMBER_REGULAR_EXPRESSION,
      `[telNumber]${getString('VALIDATION_NUMBER_INVALID')}`
    ),
  reason: yup
    .string()
    .required(`[reason]${getString('VALIDATION_REQUIRED')}`)
    .min(1, `[reason]${getString('VALIDATION_NUMBER_INVALID')}(1~ )`),
  firmName: yup
    .string()
    .required(`[firmName]${getString('VALIDATION_REQUIRED')}`)
    .min(1, `[firmName]${getString('VALIDATION_NUMBER_INVALID')}(1~ 10)`)
    .max(10, `[firmName]${getString('VALIDATION_NUMBER_INVALID')}(1~ 10)`),
});
