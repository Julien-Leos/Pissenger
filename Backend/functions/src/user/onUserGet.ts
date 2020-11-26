import * as fn from "firebase-functions";

import { getUserById } from "../shared/services/user.service";

export const onUserGet = fn.region("europe-west1").https.onCall(async (data, context) => {
  if (!context.auth) return new fn.https.HttpsError("unauthenticated", "", { msg: "User unauthenticated." });

  return (await getUserById(data.id))?.data();
});
