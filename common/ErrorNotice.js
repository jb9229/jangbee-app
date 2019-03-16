import { Alert } from 'react-native';

export function notifyError(eName, eMessage) {
  return Alert.alert(eName, eMessage);
}

export function test() {}
