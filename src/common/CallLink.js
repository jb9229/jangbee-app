import { Alert, Linking } from 'react-native';

/**
 * 업체 전화연결 함수
 */
export default function callLink(number, calleeIsFirm) {
  if (number === null || number === '') {
    return;
  }

  const telStr = `tel:${number}`;

  Linking.openURL(telStr).catch(
    Alert.alert(`전화앱 열기에 문제가 있습니다, 다시 시도해 주세요 [${telStr}]`),
  );
}
