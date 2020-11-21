import * as fb from "firebase-admin";
import * as fn from "firebase-functions";

export const onGroupGetById = fn.region("europe-west1").https.onCall(async (data, context) => {
  if (!context.auth) return new fn.https.HttpsError("unauthenticated", "User unauthenticated.");

  return await fb
    .firestore()
    .collection("groups")
    .doc(data.id)
    .get()
    .then((docRef) => {
      if (docRef.exists) return docRef.data();
      else return new fn.https.HttpsError("not-found", "Group " + data.id + " not found.");
    })
    .catch((error) => {
      return new fn.https.HttpsError("internal", "Error getting document.");
    });
});
