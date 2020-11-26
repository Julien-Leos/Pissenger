import * as fb from "firebase-admin";

export const getUserById = (userId: string) => {
  return fb
    .firestore()
    .collection("users")
    .doc(userId)
    .get()
    .then((UserRef) => {
      if (UserRef.exists) return UserRef;
      else return null;
    })
    .catch(() => {
      return null;
    });
};
