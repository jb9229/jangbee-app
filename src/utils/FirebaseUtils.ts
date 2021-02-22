import { UserAssets } from 'src/types';
import firebase from 'firebase';
import { noticeUserError } from 'src/container/request';

export function getUserInfo(
  uid: string
): Promise<firebase.database.DataSnapshot> {
  return firebase
    .database()
    .ref(`users/${uid}`)
    .once('value', data => {
      return data;
    });
}

export const updateUserAssets = (
  uid: string,
  assetData: UserAssets
): Promise<void> => {
  return firebase
    .database()
    .ref(`users/${uid}/assets`)
    .update(assetData, error => {
      if (error) {
        noticeUserError(
          '사용자타입 FB DB에 저장에 문제가 있습니다, 다시 시도해 주세요.',
          `Error: ${error}`
        );
      }
    });
};

export function updateReAuthInfo(
  uid,
  accessToken,
  refreshToken,
  accTokenExpDate,
  accTokenDiscDate,
  userSeqNo,
  errorCallbackFunc
): Promise<void> {
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
      error => {
        if (error) {
          errorCallbackFunc(error);
        }
      }
    );
}

export function updatePaymentSubscription(
  uid: string,
  sid: string
): Promise<void> {
  if (!uid || !sid) {
    return new Promise((resolve): void => {
      resolve();
    });
  }
  return firebase
    .database()
    .ref(`users/${uid}`)
    .update(
      {
        sid: sid,
      },
      (error: Error | null): void => {
        if (error) {
          console.error(error);
          throw error;
        }
      }
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
