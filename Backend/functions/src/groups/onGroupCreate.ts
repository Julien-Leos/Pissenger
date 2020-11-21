import * as ad from "firebase-admin";
import * as fn from "firebase-functions";

export const onGroupCreate = fn.region("europe-west1").https.onCall(async (data, context) => {
  if (!context.auth) return new fn.https.HttpsError("unauthenticated", "User unauthenticated.");

  await ad
    .firestore()
    .collection("groups")
    .add({
      name: data.name,
      picture: data.picture || ad.storage().bucket().get()
    });
  return new fn.https.HttpsError("ok", "New group successfully created.");
});
