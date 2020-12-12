import * as api from 'src/api/api';

import { FirmCreateDto, FirmCreateErrorData, FirmCreateValidScheme, FirmEditDto } from 'src/container/firm/types';

import { ReactNativeFile } from 'apollo-upload-client';
import getString from 'src/STRING';

// Actions
export const convertFirmDto = (uid: string, dto: FirmCreateDto): object =>
{
  console.log('>>> convertFirmDto : ', dto);
  return {
    accountId: uid,
    fname: dto.fname,
    thumbnail: new ReactNativeFile({
      uri: dto.thumbnail.uri,
      name: 'firmThumbnail',
      type: 'image/png'
    }),
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
    photo1: new ReactNativeFile({
      uri: dto.photo1.uri,
      name: 'firmImage1',
      type: 'image/png'
    }),
    photo2: dto.photo2 ? new ReactNativeFile({
      uri: dto.photo2.uri,
      name: 'firmImage2',
      type: 'image/png'
    }) : undefined,
    photo3: dto.photo3 ? new ReactNativeFile({
      uri: dto.photo3.uri,
      name: 'firmImage3',
      type: 'image/png'
    }) : undefined,
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

export const validateUpdateFirmDto = (dto: FirmEditDto): Promise<boolean | FirmCreateErrorData> =>
{
  const errorData = new FirmCreateErrorData();
  let result = true;

  if (!dto.workAlarmSido && !dto.workAlarmSigungu) { errorData.workAlarm = getString('VALIDATION_REQUIRED'); result = false }
  if (dto.uploadThumbnail === null) { errorData.thumbnail = getString('VALIDATION_REQUIRED'); result = false }
  if (dto.uploadPhoto1 === null) { errorData.photo1 = getString('VALIDATION_REQUIRED'); result = false }
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

export const getUpdateFirmDto = (dto: FirmEditDto): FirmEditDto =>
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
    thumbnail: dto.thumbnail,
    photo1: dto.photo1,
    photo2: dto.photo2,
    photo3: dto.photo3,
    uploadThumbnail: dto.uploadThumbnail ? new ReactNativeFile({
      uri: dto.uploadThumbnail.uri,
      name: 'Thumbnail',
      type: 'image/png'
    }) : dto.uploadThumbnail,
    uploadPhoto1: dto.uploadPhoto1 ? new ReactNativeFile({
      uri: dto.uploadPhoto1.uri,
      name: 'firmImage1',
      type: 'image/png'
    }) : dto.uploadPhoto1,
    uploadPhoto2: dto.uploadPhoto2 ? new ReactNativeFile({
      uri: dto.uploadPhoto2.uri,
      name: 'firmImage2',
      type: 'image/png'
    }) : dto.uploadPhoto2,
    uploadPhoto3: dto.uploadPhoto3 ? new ReactNativeFile({
      uri: dto.uploadPhoto3.uri,
      name: 'firmImage3',
      type: 'image/png'
    }) : dto.uploadPhoto3,
    blog: dto.blog,
    homepage: dto.homepage,
    sns: dto.sns
  } as FirmEditDto;

  return updateFirm;
};
