import * as yup from 'yup';

import { PHONENUMBER_REGULAR_EXPRESSION } from 'src/container/firm/types';
import getString from 'src/STRING';

export class WorkCreateDto
{
  equipment: string;
  phoneNumber: string;
  address: string;
  addressDetail: string;
  startDate: string;
  period: number;
  guaranteeTime: number;
  detailRequest: string;
  modelYearLimit: number;
  licenseLimit: string;
  nondestLimit: string;
  careerLimit: number;
  sidoAddr: string;
  sigunguAddr: string;
  addrLongitude: string;
  addrLatitude: string;
}

export class WorkCreateErrorData
{
  constructor ()
  {
    this.equipment = '';
    this.phoneNumber = '';
    this.address = '';
    this.addressDetail = '';
    this.startDate = '';
    this.period = '';
    this.guaranteeTime = '';
    this.detailRequest = '';
    this.modelYearLimit = '';
    this.licenseLimit = '';
    this.nondestLimit = '';
    this.careerLimit = '';
    this.sidoAddr = '';
    this.sigunguAddr = '';
    this.addrLongitude = '';
    this.addrLatitude = '';
  }

  equipment: string;
  phoneNumber: string;
  address: string;
  addressDetail: string;
  startDate: string;
  period: string;
  guaranteeTime: string;
  detailRequest: string;
  modelYearLimit: string;
  licenseLimit: string;
  nondestLimit: string;
  careerLimit: string;
  sidoAddr: string;
  sigunguAddr: string;
  addrLongitude: string;
  addrLatitude: string;
};

export const WorkCreateValidScheme = yup.object({
  equipment: yup.string().required(`[equipment]${getString('VALIDATION_REQUIRED')}`),
  phoneNumber: yup.string()
    .required(`[phoneNumber]${getString('VALIDATION_REQUIRED')}`)
    .matches(PHONENUMBER_REGULAR_EXPRESSION, `[phoneNumber]${getString('VALIDATION_NUMBER_INVALID')}`),
  address: yup.string()
    .required(`[address]${getString('VALIDATION_REQUIRED')}`)
    .min(1, `[address]${getString('VALIDATION_NUMBER_INVALID')}(1~ )`),
  addressDetail: yup.string()
    .required(`[addressDetail]${getString('VALIDATION_REQUIRED')}`)
    .min(1, `[addressDetail]${getString('VALIDATION_NUMBER_INVALID')}(1~ )`),
  startDate: yup.string()
    .required(`[startDate]${getString('VALIDATION_REQUIRED')}`)
    .min(1, `[startDate]${getString('VALIDATION_NUMBER_INVALID')}(1~ )`),
  period: yup.number()
    .required(`[period]${getString('VALIDATION_REQUIRED')}`)
    .min(0.1, `[period]${getString('VALIDATION_NUMBER_INVALID')}(1~ )`),
  detailRequest: yup.string()
    .required(`[detailRequest]${getString('VALIDATION_REQUIRED')}`)
    .min(1, `[detailRequest]${getString('VALIDATION_NUMBER_INVALID')}`),
  sidoAddr: yup.string()
    .required(`[sidoAddr]${getString('VALIDATION_REQUIRED')}`)
    .min(1, `[sidoAddr]${getString('VALIDATION_NUMBER_INVALID')}`)
});
