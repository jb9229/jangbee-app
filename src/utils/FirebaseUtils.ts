import firebase from 'firebase';

export function getUserInfo (uid): Promise<firebase.database.DataSnapshot>
{
  return firebase
    .database()
    .ref(`users/${uid}`)
    .once('value', data => { return data });
}

export function updateReAuthInfo (uid, accessToken, refreshToken, accTokenExpDate,
  accTokenDiscDate, userSeqNo, errorCallbackFunc): Promise<void>
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

export function updatePaymentSubscription (uid: string, sid: string): Promise<void>
{
  if (!uid || !sid) { return new Promise((resolve): void => { resolve() }) }
  return firebase
    .database()
    .ref(`users/${uid}`)
    .update(
      {
        sid: sid
      },
      (error: Error | null): void =>
      {
        if (error)
        {
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
