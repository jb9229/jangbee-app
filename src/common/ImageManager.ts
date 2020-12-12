import * as api from 'api/api';

import { execute, makePromise } from 'apollo-link';

import { GraphQLRequest } from '@apollo/client';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import { UPLOAD_IMAGE } from 'src/api/queries';
import { apolloClient } from 'src/api/apollo';

/**
 * 이미지 업로드 함수
 */
export const uploadImage = async(img: ImageInfo, fileName?: string): Promise<string | ''> =>
{
  // Validation
  if (!img)
  {
    return null;
  }

  const operation: GraphQLRequest = {
    query: UPLOAD_IMAGE,
    variables:
    {
      imageParams: {
        data: img.base64,
        fileName: fileName || 'img'
      }
    }
  };

  // Upload Image
  const serverImgUrl = await makePromise(execute(apolloClient.link, operation)).then(
    result =>
    {
      if (result?.data?.existRinger === undefined)
      {
        return '';
      }
      const imgUrl = result?.data?.existRinger;

      return imgUrl;
    }
  );

  return serverImgUrl;
};

/**
 * 이미지 삭제 함수
 */
export async function removeImage(localImgUri)
{
  // TODO (꼭 해야해!!!)
  return true;
}
