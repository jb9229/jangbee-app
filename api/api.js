import * as url from '../constants/Url';
import {
  handleJsonResponse,
  handleTextResponse,
  handleNoContentResponse,
} from '../utils/Fetch-utils';

export function getEquipList() {
  return fetch(url.JBSERVER_EQUILIST).then(handleJsonResponse);
}

export function createFirm(newFirm) {
  return fetch(url.JBSERVER_FIRM, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newFirm),
  }).then(handleJsonResponse);
}

export function getFirm(accountId) {
  const param = encodeURIComponent(accountId);
  return fetch(`${url.JBSERVER_FIRM}/${param}`);
}

export function updateFirm(updateFirm) {
  return fetch(url.JBSERVER_FIRM, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateFirm),
  }).then(handleJsonResponse);
}

export function uploadImage(uri) {
  const uriParts = uri.split('.');
  const fileType = uriParts[uriParts.length - 1];
  const nowTime = new Date().getTime();

  const formData = new FormData();

  formData.append('img', {
    uri,
    name: `jangbee_photo_+${nowTime}.${fileType}`,
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

  return fetch(url.IMAGE_STORAGE, options).then(handleTextResponse);
}

export function removeImage(imgUrl) {
  const index = imgUrl.lastIndexOf('/');
  let fileName = imgUrl.substr(index + 1);

  fileName = decodeURIComponent(fileName);

  const formData = new FormData();

  formData.append('imgName', fileName);
  const options = {
    method: 'POST',
    body: formData,
    headers: {},
  };

  return fetch(`${url.IMAGE_STORAGE}/remove`, options).then(handleNoContentResponse);
}
