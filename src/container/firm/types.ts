import * as yup from 'yup';

import getString from 'src/STRING';

export const PHONENUMBER_REGULAR_EXPRESSION =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const FirmCreateValidScheme = yup.object({
  fname: yup.string().required(`[fname]${getString('VALIDATION_REQUIRED')}`),
  phoneNumber: yup.string()
    .required(`[phoneNumber]${getString('VALIDATION_REQUIRED')}`)
    .matches(PHONENUMBER_REGULAR_EXPRESSION, `[phoneNumber]${getString('VALIDATION_NUMBER_INVALID')}`),
  equiListStr: yup.string()
    .required(`[equiListStr]${getString('VALIDATION_REQUIRED')}`)
    .min(1, `[equiListStr]${getString('VALIDATION_NUMBER_INVALID')}(1~ )`),
  modelYear: yup.number()
    .required(`[modelYear]${getString('VALIDATION_REQUIRED')}`)
    .min(1991, `[modelYear]${getString('VALIDATION_NUMBER_INVALID')}(1991 ~ )`),
  address: yup.string()
    .required(`[address]${getString('VALIDATION_REQUIRED')}`)
    .min(1, `[address]${getString('VALIDATION_NUMBER_INVALID')}(1~ )`),
  introduction: yup.string()
    .required(`[introduction]${getString('VALIDATION_REQUIRED')}`)
    .min(1, `[introduction]${getString('VALIDATION_NUMBER_INVALID')}(1~ )`),
  photo1: yup.string()
    .required(`[photo1]${getString('VALIDATION_REQUIRED')}`)
    .min(1, `[photo1]${getString('VALIDATION_NUMBER_INVALID')}`)
});

export class FirmCreateDto
{
  fname: string;
  phoneNumber: string;
  equiListStr: string;
  modelYear: number;
  address: string;
  addressDetail: string;
  sidoAddr: string;
  sigunguAddr: string;
  addrLongitude: string;
  addrLatitude: string;
  workAlarmSido: string;
  workAlarmSigungu: string;
  introduction: string;
  thumbnail: string;
  photo1: string;
  photo2: string;
  photo3: string;
  blog: string;
  homepage: string;
  sns: string;
}

export class FirmCreateErrorData
{
  fname: string;
  phoneNumber: string;
  equiListStr: string;
  modelYear: string;
  address: string;
  addressDetail: string;
  sidoAddr: string;
  sigunguAddr: string;
  addrLongitude: string;
  addrLatitude: string;
  workAlarm: string;
  introduction: string;
  thumbnail: string;
  photo1: string;
  photo2: string;
  photo3: string;
  blog: string;
  homepage: string;
  sns: string;
}
