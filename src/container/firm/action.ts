import * as api from 'src/api/api';
import * as imageManager from 'common/ImageManager';

import { FirmCreateDto, FirmCreateErrorData, FirmCreateValidScheme } from 'src/container/firm/types';

import getString from 'src/STRING';

// Actions
export const convertFirmDto = (uid: string, dto: FirmCreateDto): object =>
{
  console.log('>>> convertFirmDto : ', dto);
  return {
    accountId: uid,
    fname: dto.fname,
    thumbnail: dto.thumbnail,
    phoneNumber: dto.phoneNumber,
    equiListStr: dto.equiListStr,
    modelYear: dto.modelYear,
    address: dto.address,
    addressDetail: dto.addressDetail,
    sidoAddr: dto.sidoAddr,
    sigunguAddr: dto.sigunguAddr,
    addrLongitude: Number.parseFloat(dto.addrLongitude),
    addrLatitude: Number.parseFloat(dto.addrLatitude),
    workAlarmSido: dto.workAlarmSido,
    workAlarmSigungu: dto.workAlarmSigungu,
    introduction: dto.introduction,
    photo1: dto.uploadedPhoto1Url,
    photo2: dto.uploadedPhoto2Url,
    photo3: dto.uploadedPhoto3Url,
    blog: dto.blog,
    homepage: dto.homepage,
    sns: dto.sns
  };
};
export const validateCreatFirmDto = (dto: FirmCreateDto): Promise<boolean | FirmCreateErrorData> =>
{
  const errorData = new FirmCreateErrorData();
  let result = true;

  if (!dto.workAlarmSido && !dto.workAlarmSigungu) { errorData.workAlarm = getString('VALIDATION_REQUIRED'); result = false }
  return FirmCreateValidScheme.validate(dto, { abortEarly: false })
    .then(() => { return result || errorData })
    .catch((err) =>
    {
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

export const uploadImage = async (dto: FirmCreateDto, popLoading): Promise<boolean> =>
{
  let uploaded = true;
  if (dto.thumbnail)
  {
    if (dto.thumbnail.startsWith('http'))
    {
      dto.uploadedThumbnailUrl = dto.thumbnail;
    }
    else
    {
      popLoading(true, '대표사진 업로드중...');
      dto.uploadedThumbnailUrl = await imageManager.uploadImage(dto.thumbnail);

      if (!dto.uploadedThumbnailUrl) { uploaded = false }
    }
  }
  if (dto.photo1)
  {
    if (dto.photo1.startsWith('http'))
    {
      dto.uploadedPhoto1Url = dto.photo1;
    }
    else
    {
      popLoading(true, '작업사진1 업로드중...');
      dto.uploadedPhoto1Url = await imageManager.uploadImage(dto.photo1);

      if (!dto.uploadedPhoto1Url) { uploaded = false }
    }
  }
  if (dto.photo2)
  {
    if (dto.photo2.startsWith('http'))
    {
      dto.uploadedPhoto2Url = dto.photo2;
    }
    else
    {
      popLoading(true, '작업사진2 업로드중...');
      dto.uploadedPhoto2Url = await imageManager.uploadImage(dto.photo2);

      if (!dto.uploadedPhoto2Url) { uploaded = false }
    }
  }
  if (dto.photo3)
  {
    if (dto.photo3.startsWith('http'))
    {
      dto.uploadedPhoto3Url = dto.photo3;
    }
    else
    {
      popLoading(true, '작업사진3 업로드중...');
      dto.uploadedPhoto3Url = await imageManager.uploadImage(dto.photo3);

      if (!dto.uploadedPhoto3Url) { uploaded = false }
    }
  }

  popLoading(false);

  return uploaded;
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

  return api.createFirm(newFirm);
};

export const requestModifyFirm = (uid: string, firmId: string, dto: FirmCreateDto): Promise<boolean> =>
{
  const updateFirm = {
    id: firmId,
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

  return api.updateFirm(updateFirm);
};

export const getUpdateFirmDto = (dto: FirmCreateDto): FirmCreateDto =>
{
  const updateFirm = {
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

  return updateFirm;
};
