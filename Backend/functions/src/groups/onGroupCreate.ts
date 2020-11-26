import * as ad from "firebase-admin";
import * as fn from "firebase-functions";
import { User } from "../shared/models/user/user.model";

export const onGroupCreate = fn.region("europe-west1").https.onCall(async (data, context) => {
  if (!context.auth) return new fn.https.HttpsError("unauthenticated", "User unauthenticated.");

  if (data.members.length < 1)
    return new fn.https.HttpsError("invalid-argument", "A group need at least one member other than the creator.");

  const user: User = context.auth.;

  await ad.firestore().collection("groups").add({
    name: data.name,
    picture: data.picture,
  });
  return new fn.https.HttpsError("ok", "New group successfully created.");
});
