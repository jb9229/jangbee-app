import * as Sentry from 'sentry-expo';

import { Alert } from 'react-native';
import { User } from 'src/types';

export const noticeUserError = (location: string, error: any, user?: User): void =>
{
  /**
   * TODO redux-tools? reconcil? call onpen kakaoaskmodal
   */
  console.error(error);
  Alert.alert('불편을 드려 죄송합니다.', '\n예기치 못한 문제가 발생하였습니다.\n\n 해당 문제는 잘 보고 되었습니다.\n 조속히 조치 하겠습니다!\n\n추가 불편한 점은\n 내 정보 -> [카톡상담하기]로 해주세요.');
  Sentry.captureMessage(`Location: ${location}\n\n Error Message: ${error?.message}\nn User: ${user?.uid}`);
  error && Sentry.captureException(error);
};
