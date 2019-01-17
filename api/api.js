import { Alert } from 'react-native';
import * as url from '../constants/Url';
import { handleJsonResponse, handleTextResponse } from '../utils/Fetch-utils';

export function getEquipList() {
  return fetch(url.JBSERVER_EQUILIST)
    .then(handleJsonResponse)
    .catch((error) => {
      Alert.alert(
        '장비명 조회에 문제가 있습니다, 재 시도해 주세요.',
        `[${error.name}] ${error.message}`,
      );

      return undefined;
    });
}

export function uploadImage(imgUri) {
  const uriParts = imgUri.split('.');
  const fileType = uriParts[uriParts.length - 1];
  const nowTime = new Date().getTime();

  const formData = new FormData();
  formData.append('imgName', 'tobedelete');

  formData.append('img', {
    imgUri,
    name: `isa_photo_+${nowTime}.${fileType}`,
    type: `image/${fileType}`,
  });

  const options = {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  };

  return fetch(url.IMAGE_STORAGE, options)
    .then(handleTextResponse)
    .catch((error) => {
      Alert.alert(
        '이미지 업로드에 문제가 있습니다, 재 시도해 주세요.',
        `[${error.name}] ${error.message}`,
      );

      return undefined;
    });
}
