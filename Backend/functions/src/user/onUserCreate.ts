import * as fb from "firebase-admin";
import * as fn from "firebase-functions";

import { User } from "../shared/models/user/user.model";

export const onUserCreate = fn.region("europe-west1").https.onCall(async (data, context) => {
  if (!context.auth) return new fn.https.HttpsError("unauthenticated", "", { error: "User unauthenticated." });

  const newUser: User = {
    profile: {
      firstName: data.firstName,
      lastName: data.lastName,
      age: data.age,
      gender: data.gender,
      picture: data.picture || null,
    },
    groups: [],
    notifications: [],
  };

  await fb.firestore().collection("users").add(newUser);
  return new fn.https.HttpsError("ok", "", { error: "New user successfully created." });
});
