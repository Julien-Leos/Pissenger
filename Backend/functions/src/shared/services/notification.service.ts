import * as fb from "firebase-admin";

import { Notification } from "../models/notification/notification.model";
import { NotificationType } from "../models/notification/notificationType.enum";

export const createNotification = async (
  type: NotificationType,
  userRef: FirebaseFirestore.DocumentReference,
  groupRef: FirebaseFirestore.DocumentReference,
  messageRef: FirebaseFirestore.DocumentReference | null
) => {
  const notification: Notification = {
    type: type,
    group: groupRef,
    message: messageRef,
    createdAt: Date.now(),
    seenAt: null,
  };

  const notificationRef = await userRef.collection("notifications").add(notification);

  // On Group deletion, delete all notifications related to this Group
  groupRef.onSnapshot(async (groupSnap) => {
    if (!groupSnap.exists) await notificationRef.delete();
  });
};

export const getNotificationsByGroup = async (
  userRef: FirebaseFirestore.DocumentReference,
  groupRef: FirebaseFirestore.DocumentReference
): Promise<FirebaseFirestore.QuerySnapshot> => {
  return await fb.firestore().doc(userRef.path).collection("notifications").where("group", "==", groupRef).get();
};
