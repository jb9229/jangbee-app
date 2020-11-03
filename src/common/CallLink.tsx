import { Linking, Platform } from 'react-native';

import RNImmediatePhoneCall from 'react-native-immediate-phone-call';

/**
 * 업체 전화연결 함수
 */
export const callSearchFirm = (number, calleeIsFirm) =>
{
  if (number === null || number === '')
  {
    return;
  }

  const telStr = `tel:${number}`;

  Linking
    .openURL(telStr)
    .catch(() => alert(`전화앱 열기에 문제가 있습니다, 다시 시도해 주세요 [${telStr}]`));
};

/**
 * 업체 전화연결 함수
 */
export const callAdFirm = (phoneNumber: string): void =>
{
  if (!phoneNumber)
  {
    alert(`링크 열기에 문제가 있습니다 [${phoneNumber}]`);
    return;
  }

  if (Platform.OS === 'web')
  {
    Linking.openURL(`tel:${phoneNumber}`)
      .catch(() => alert(`링크 열기에 문제가 있습니다 [${phoneNumber}]`));
  }
  else
  {
    RNImmediatePhoneCall.immediatePhoneCall(phoneNumber);
  }
};
