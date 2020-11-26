import * as fn from "firebase-functions";

import { getGroupById } from "../shared/services/group.service";

export const onGroupGet = fn.region("europe-west1").https.onCall(async (data, context) => {
  if (!context.auth) return new fn.https.HttpsError("unauthenticated", "", { msg: "User unauthenticated." });

  return (await getGroupById(data.id))?.data();
});
