import firebase from 'firebase';
import { noticeUserError } from 'src/container/request';

export function getUserInfo (uid): Promise<any>
{
  return firebase
    .database()
    .ref(`users/${uid}`)
    .once('value', data => data);
}

export function updateReAuthInfo (uid, accessToken, refreshToken, accTokenExpDate,
  accTokenDiscDate, userSeqNo, errorCallbackFunc): Promise<any>
{
  return firebase
    .database()
    .ref(`users/${uid}`)
    .update(
      {
        obAccessToken: accessToken,
        obRefreshToken: refreshToken,
        obAccTokenExpDate: accTokenExpDate,
        obAccTokenDiscDate: accTokenDiscDate,
        obUserSeqNo: userSeqNo
      },
      (error) =>
      {
        if (error)
        {
          errorCallbackFunc(error);
        }
      }
    );
}

export function updatePaymentSubscription (uid: string, sid: string): Promise<any>
{
  if (!uid || !sid) { return new Promise((resolve): void => { resolve(false) }) }
  return firebase
    .database()
    .ref(`users/${uid}`)
    .update(
      {
        sid: sid
      },
      (error): void =>
      {
        noticeUserError('Firebase Update Fail(updatePaymentSubscription)', '접속이 원활하지 않습니다, 재시도 해주세요', error.message);
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
