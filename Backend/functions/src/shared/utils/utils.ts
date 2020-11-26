import * as fb from "firebase-admin";

export const getUserById = (userId: string) => {
  return fb
    .firestore()
    .collection("users")
    .doc(userId)
    .get()
    .then((docRef) => {
      if (docRef.exists) return docRef.data();
      else return null;
    })
    .catch(() => {
      return null;
    });
};
