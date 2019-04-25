import * as api from '../api/api';
import { notifyError } from './ErrorNotice';

/**
 * 이미지 업로드 함수
 */
export async function uploadImage(localImgUri) {
  // Validation
  if (!localImgUri) {
    return null;
  }

  // Upload Image
  let serverImgUrl = null;
  await api
    .uploadImage(localImgUri)
    .then((resImgUrl) => {
      if (resImgUrl) {
        serverImgUrl = resImgUrl;
      } else {
        notifyError(
          '이미지 업로드에 문제가 있습니다, 재 시도해 주세요.',
          `업로드 응답내용: ${resImgUrl}`,
        );
      }
    })
    .catch((error) => {
      notifyError(
        '이미지 업로드에 문제가 있습니다, 재 시도해 주세요.',
        `[${error.name}] ${error.message}`,
      );
    });

  return serverImgUrl;
}

/**
 * 이미지 삭제 함수
 */
export async function removeImage(localImgUri) {
  let result = false;
  await api
    .removeImage(localImgUri)
    .then((res) => {
      if (res) {
        result = res;
      } else {
        notifyError(
          '이미지 삭제에 문제가 있습니다, 재 시도해 주세요.',
          `이미지삭제 응답내용: ${res}`,
        );
      }
    })
    .catch((error) => {
      notifyError(
        '이미지 삭제에 문제가 있습니다, 재 시도해 주세요.',
        `[${error.name}] ${error.message}`,
      );
    });

  return result;
}
