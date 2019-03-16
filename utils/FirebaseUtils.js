import firebase from 'firebase';
import { Alert } from 'react-native';

export function getUserInfo(uid) {
  return firebase
    .database()
    .ref(`users/${uid}`)
    .once('value', (data) => {
      if (data.val() === null) {
        Alert.alert('사용자정보 조회 문제', '사용자타입 조회에 문제가 있습니다, 재시도해 주세요.');
      }

      return data;
    });
}

export function updateReAuthInfo(
  uid,
  accessToken,
  refreshToken,
  accTokenExpDate,
  accTokenDiscDate,
  userSeqNo,
  errorCallbackFunc,
) {
  return firebase
    .database()
    .ref(`users/${uid}`)
    .update(
      {
        obAccessToken: accessToken,
        obRefreshToken: refreshToken,
        obAccTokenExpDate: accTokenExpDate,
        obAccTokenDiscDate: accTokenDiscDate,
        obUserSeqNo: userSeqNo,
      },
      (error) => {
        if (error) {
          errorCallbackFunc(error);
        }
      },
    );
}

// var connectedRef = firebase.database().ref(".info/connected");
// connectedRef.on("value", function(snap) {
//   if (snap.val() === true) {
//     alert("connected");
//   } else {
//     alert("not connected");
//   }
// });
