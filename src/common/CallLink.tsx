import { Alert, Linking, Platform } from 'react-native';

import RNImmediatePhoneCall from 'react-native-immediate-phone-call';

/**
 * 업체 전화연결 함수
 */
export const callSearchFirm = (phoneNumber) =>
{
  console.log('=== callSearchFirm: ', phoneNumber);
  if (phoneNumber === null || phoneNumber === '')
  {
    return;
  }

  const telStr = `tel:${phoneNumber}`;

  if (Platform.OS === 'web')
  {
    Linking
      .openURL(telStr)
      .catch(() => alert(`전화앱 열기에 문제가 있습니다, 다시 시도해 주세요 [${telStr}]`));
  }
  else
  {
    Alert.alert(
      '전화연결',
      '해당 업체로 바로 전화 연결 하시겠습니까?',
      [
        {
          text: '취소', onPress: () => undefined
        },
        {
          text: '통화', onPress: () => RNImmediatePhoneCall.immediatePhoneCall(phoneNumber)
        }
      ]
    );
  }
};

/**
 * 업체 전화연결 함수
 */
export const callAdFirm = (phoneNumber: string): void =>
{
  console.log('=== callAdFirm: ', phoneNumber);
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
    Alert.alert(
      '전화연결',
      '해당 업체로 바로 전화 연결 하시겠습니까?',
      [
        {
          text: '취소', onPress: () => undefined
        },
        {
          text: '통화', onPress: () => RNImmediatePhoneCall.immediatePhoneCall(phoneNumber)
        }
      ]
    );
  }
};
