import * as fn from "firebase-functions";

import { User } from "../shared/models/user/user.model";
import { Group } from "../shared/models/group/group.model";
import { Message } from "../shared/models/message/message.model";
import { Notification } from "../shared/models/notification/notification.model";
import { NotificationType } from "../shared/models/notification/notificationType.enum";
import { getUserById } from "../shared/services/user.service";

export const onNotificationListen = fn.firestore
  .document("users/{userId}/notifications/{notificationId}")
  .onCreate(async (snap, context) => {
    const notification: Notification = snap.data() as Notification;

    const user: User = (await getUserById(context.params.userId))?.data() as User;
    console.log(
      "NOTIFICATION: " + user.profile.firstName + " " + user.profile.lastName + " has received a new notification:"
    );

    switch (notification.type) {
      case NotificationType.NEW_GROUP:
        await notificationNewGroup(notification);
        break;
      case NotificationType.NEW_MESSAGE:
        await notificationNewMessage(notification);
        break;
    }
  });

const notificationNewGroup = async (notification: Notification) => {
  const group: Group = (await notification.group.get()).data() as Group;
  console.log("NOTIFICATION: You have been invited to join " + group.name + ".");
};

const notificationNewMessage = async (notification: Notification) => {
  const group: Group = (await notification.group.get()).data() as Group;
  if (!notification.message) return;
  const message: Message = (await notification.message.get()).data() as Message;
  const author: User = (await message.author.get()).data() as User;
  console.log(
    "NOTIFICATION: " + author.profile.firstName + " " + author.profile.lastName + " send a new message in " + group.name
  );
};
