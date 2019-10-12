import { Alert, Linking } from 'react-native';

export function openLinkUrl(url) {
  if (url === null || url === '') {
    return;
  }

  Linking.openURL(url).catch(Alert.alert(`링크 열기에 문제가 있습니다 [${url}]`));
}

export function test() {}
