import * as fb from "firebase-admin";
import * as fn from "firebase-functions";

import { User } from "../shared/models/user/user.model";

import { getUserById } from "../shared/utils/utils";

export const onGroupCreate = fn.region("europe-west1").https.onCall(async (data, context) => {
  if (!context.auth) return new fn.https.HttpsError("unauthenticated", "", { error: "User unauthenticated." });

  if (data.members.length < 1)
    return new fn.https.HttpsError("invalid-argument", "", {
      error: "A group need at least one member other than the creator.",
    });

  const user = (await getUserById(context.auth.uid)) as User;
  if (!user) return new fn.https.HttpsError("internal", "", { error: "Can't access to User data." });

  await fb.firestore().collection("groups").add({
    name: data.name,
    picture: data.picture,
  });
  return new fn.https.HttpsError("ok", "", { error: "New group successfully created." });
});
