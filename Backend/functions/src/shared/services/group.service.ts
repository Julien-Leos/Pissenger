import * as fb from "firebase-admin";

export const getGroupById = (groupId: string) => {
  return fb
    .firestore()
    .collection("groups")
    .doc(groupId)
    .get()
    .then((groupRef) => {
      if (groupRef.exists) return groupRef;
      else return null;
    })
    .catch(() => {
      return null;
    });
};
