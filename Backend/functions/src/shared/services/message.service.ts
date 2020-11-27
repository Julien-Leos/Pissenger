import * as fb from "firebase-admin";

export const getMessageById = (groupId: string, messageId: string) => {
  return fb
    .firestore()
    .collection("groups")
    .doc(groupId)
    .collection("messages")
    .doc(messageId)
    .get()
    .then((messageRef) => {
      if (messageRef.exists) return messageRef;
      else return null;
    })
    .catch(() => {
      return null;
    });
};
