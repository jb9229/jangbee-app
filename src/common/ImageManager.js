import * as api from 'api/api';

/**
 * 이미지 업로드 함수
 */
export async function uploadImage (localImgUri)
{
  // Validation
  if (!localImgUri)
  {
    return null;
  }
  console.log('>>> localImgUri');
  console.log(localImgUri);
  // Upload Image
  let serverImgUrl = null;
  await api
    .uploadImage(localImgUri)
    .then(resImgUrl =>
    {
      if (resImgUrl)
      {
        serverImgUrl = resImgUrl;
      }
    })
    .catch((error) =>
    {
      console.error(error);
    });

  return serverImgUrl;
}

/**
 * 이미지 삭제 함수
 */
export async function removeImage (localImgUri)
{
  let result = false;
  await api
    .removeImage(localImgUri)
    .then(res =>
    {
      if (res)
      {
        result = res;
      }
    })
    .catch(error =>
    {
      console.error(error);
    });

  return result;
}
