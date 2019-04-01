import firebase from 'firebase';

export function getUserInfo(uid) {
  return firebase
    .database()
    .ref(`users/${uid}`)
    .once('value', data => data);
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
