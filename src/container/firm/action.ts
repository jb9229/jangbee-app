import * as api from 'api/api';
import * as imageManager from 'common/ImageManager';

import { FirmCreateDto, FirmCreateErrorData, FirmCreateValidScheme } from 'src/container/firm/types';

import getString from 'src/STRING';

// Actions
export const validateCreatFirmDto = (dto: FirmCreateDto): Promise<boolean | FirmCreateErrorData> =>
{
  const errorData = new FirmCreateErrorData();
  let result = true;
  console.log('>>>> validateCreatFirmDto dto');
  console.log(dto);
  if (!dto.workAlarmSido && !dto.workAlarmSigungu) { errorData.workAlarm = getString('VALIDATION_REQUIRED'); result = false }
  return FirmCreateValidScheme.validate(dto, { abortEarly: false })
    .then(() => { return result || errorData })
    .catch((err) =>
    {
      console.log('>>>> validateCreatFirmDto.errors');
      console.log(err);
      err.errors.forEach((e: string) =>
      {
        if (e.startsWith('[fname]')) { errorData.fname = (e.replace('[fname]', '')) };
        if (e.startsWith('[phoneNumber]')) { errorData.phoneNumber = (e.replace('[phoneNumber]', '')) };
        if (e.startsWith('[equiListStr]')) { errorData.equiListStr = (e.replace('[equiListStr]', '')) };
        if (e.startsWith('[modelYear]')) { errorData.modelYear = (e.replace('[modelYear]', '')) };
        if (e.startsWith('[address]')) { errorData.address = (e.replace('[address]', '')) };
        if (e.startsWith('[introduction]')) { errorData.introduction = (e.replace('[introduction]', '')) };
        if (e.startsWith('[thumbnail]')) { errorData.thumbnail = (e.replace('[thumbnail]', '')) };
        if (e.startsWith('[photo1]')) { errorData.photo1 = (e.replace('[photo1]', '')) };
      });

      return errorData;
    });
};

export const uploadImage = async (dto: FirmCreateDto, popLoading): Promise<void> =>
{
  let uploaded = false;
  if (dto.thumbnail)
  {
    popLoading(true, '대표사진 업로드중...'); uploaded = true; dto.uploadedThumbnailUrl = await imageManager.uploadImage(dto.thumbnail);
  }
  if (dto.photo1)
  {
    popLoading(true, '작업사진1 업로드중...'); uploaded = true; dto.uploadedPhoto1Url = await imageManager.uploadImage(dto.photo1);
  }
  if (dto.photo2)
  {
    popLoading(true, '작업사진2 업로드중...'); uploaded = true; dto.uploadedPhoto2Url = await imageManager.uploadImage(dto.photo2);
  }
  if (dto.photo3)
  {
    popLoading(true, '작업사진3 업로드중...'); uploaded = true; dto.uploadedPhoto3Url = await imageManager.uploadImage(dto.photo3);
  }

  if (uploaded) { popLoading(false) }
};

export const requestAddFirm = (uid: string, dto: FirmCreateDto): Promise<boolean> =>
{
  const newFirm = {
    accountId: uid,
    fname: dto.fname,
    phoneNumber: dto.phoneNumber,
    equiListStr: dto.equiListStr,
    modelYear: dto.modelYear,
    address: dto.address,
    addressDetail: dto.addressDetail,
    sidoAddr: dto.sidoAddr,
    sigunguAddr: dto.sigunguAddr,
    addrLongitude: dto.addrLongitude,
    addrLatitude: dto.addrLatitude,
    workAlarmSido: dto.workAlarmSido,
    workAlarmSigungu: dto.workAlarmSigungu,
    introduction: dto.introduction,
    thumbnail: dto.uploadedThumbnailUrl,
    photo1: dto.uploadedPhoto1Url,
    photo2: dto.uploadedPhoto2Url,
    photo3: dto.uploadedPhoto3Url,
    blog: dto.blog,
    homepage: dto.homepage,
    sns: dto.sns
  };
  console.log('>>> newFirm', newFirm);
  return api.createFirm(newFirm);
};
