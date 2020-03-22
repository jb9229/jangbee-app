import * as yup from 'yup';

import getString from 'src/STRING';

export const ValidScheme = yup.object({
  adType: yup.string()
    .required(`[comment]${getString('VALIDATION_REQUIRED')}`)
    .min(2, `[comment]${getString('VALIDATION_STRING_EXCEED')}(2~1000 자)`)
    .max(1000, `[comment]${getString('VALIDATION_STRING_EXCEED')}(2~1000 자)`),
  forMonths: yup.number()
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
  modelYear: number;
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
