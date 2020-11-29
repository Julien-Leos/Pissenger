import * as fn from "firebase-functions";

import { getGroupById } from "../shared/services/group.service";
import { getNotificationsByGroup } from "../shared/services/notification.service";
import { getUserById } from "../shared/services/user.service";

export const onNotificationRead = fn.region("europe-west1").https.onCall(async (data, context) => {
  if (!context.auth) return new fn.https.HttpsError("unauthenticated", "", { msg: "User unauthenticated." });

  const userRef = (await getUserById(context.auth.uid))?.ref;
  if (!userRef) return new fn.https.HttpsError("not-found", "", { msg: "User " + context.auth.uid + " not found." });

  const groupRef = (await getGroupById(data.groupId))?.ref;
  if (!groupRef) {
    return new fn.https.HttpsError("not-found", "", { msg: "Group " + data.groupId + " not found." });
  }

  // Mark as "seen" all notifications related to the Group
  await getNotificationsByGroup(userRef, groupRef).then((notifsSnap) =>
    notifsSnap.forEach((notifSnap) => notifSnap.ref.update({ seenAt: Date.now() }))
  );

  return new fn.https.HttpsError("ok", "", { msg: "All notifications successfully read." });
});
