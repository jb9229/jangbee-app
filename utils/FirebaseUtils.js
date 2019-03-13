import firebase from 'firebase';
import { Alert } from 'react-native';

export function getUserType(uid) {
  return firebase
    .database()
    .ref(`users/${uid}/userType`)
    .once('value', (data) => {
      if (data.val() === null) {
        Alert.alert('사용자정보 조회 문제', '사용자타입 조회에 문제가 있습니다, 재시도해 주세요.');
      }

      return data;
    });
}

export function test() {}
