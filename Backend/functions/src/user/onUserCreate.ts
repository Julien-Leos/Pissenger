import * as fb from "firebase-admin";
import * as fn from "firebase-functions";
import algoliasearch from "algoliasearch";

import { User } from "../shared/models/user/user.model";

const ALGOLIA_ID = fn.config().algolia.app_id;
const ALGOLIA_ADMIN_KEY = fn.config().algolia.api_key;

export const onUserCreate = fn.region("europe-west1").https.onCall(async (data, context) => {
  if (!context.auth) return new fn.https.HttpsError("unauthenticated", "", { msg: "User unauthenticated." });

  const user: User = {
    profile: {
      firstName: data.firstName,
      lastName: data.lastName,
      age: data.age,
      gender: data.gender,
      picture: data.picture || null,
    },
    groups: [],
  };

  await fb.firestore().collection("users").doc(data.id).set(user);

  const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
  const index = client.initIndex("users");
  await index.saveObject({ objectID: data.id, ...user });

  return new fn.https.HttpsError("ok", "", { msg: "New user successfully created." });
});
