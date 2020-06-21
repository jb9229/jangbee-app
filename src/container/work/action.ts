import * as api from 'src/api/api';

import { WorkCreateDto, WorkCreateErrorData, WorkCreateValidScheme } from 'src/container/work/types';

// Actions
export const validateRegisterWorkDto = (dto: WorkCreateDto): Promise<boolean | WorkCreateErrorData> =>
{
  const errorData = new WorkCreateErrorData();
  const result = true;

  return WorkCreateValidScheme.validate(dto, { abortEarly: false })
    .then(() => { return result || errorData })
    .catch((err) =>
    {
      err.errors.forEach((e: string) =>
      {
        if (e.startsWith('[equipment]')) { errorData.equipment = (e.replace('[equipment]', '')) };
        if (e.startsWith('[phoneNumber]')) { errorData.phoneNumber = (e.replace('[phoneNumber]', '')) };
        if (e.startsWith('[address]')) { errorData.address = (e.replace('[address]', '')) };
        if (e.startsWith('[addressDetail]')) { errorData.addressDetail = (e.replace('[addressDetail]', '')) };
        if (e.startsWith('[startDate]')) { errorData.startDate = (e.replace('[startDate]', '')) };
        if (e.startsWith('[period]')) { errorData.period = (e.replace('[period]', '')) };
        if (e.startsWith('[detailRequest]')) { errorData.detailRequest = (e.replace('[detailRequest]', '')) };
        if (e.startsWith('[sidoAddr]')) { errorData.sidoAddr = (e.replace('[sidoAddr]', '')) };
      });

      return errorData;
    });
};

export const requestAddWork = (uid: string, firmRegister: boolean, dto: WorkCreateDto): Promise<boolean> =>
{
  const newWork = {
    firmRegister,
    accountId: uid,
    equipment: dto.equipment,
    phoneNumber: dto.phoneNumber,
    address: dto.address,
    addressDetail: dto.addressDetail,
    sidoAddr: dto.sidoAddr,
    sigunguAddr: dto.sigunguAddr,
    startDate: dto.startDate,
    period: dto.period,
    guaranteeTime: dto.guaranteeTime,
    detailRequest: dto.detailRequest,
    modelYearLimit: dto.modelYearLimit,
    licenseLimit: dto.licenseLimit,
    nondestLimit: dto.nondestLimit,
    careerLimit: dto.careerLimit,
    addrLongitude: dto.addrLongitude,
    addrLatitude: dto.addrLatitude
  };

  return api.createWork(newWork);
};
