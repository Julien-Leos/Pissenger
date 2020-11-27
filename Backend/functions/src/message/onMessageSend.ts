import * as fn from "firebase-functions";

import { Group } from "../shared/models/group/group.model";
import { Member } from "../shared/models/group/member.model";
import { Message } from "../shared/models/message/message.model";
import { Notification } from "../shared/models/notification/notification.model";
import { NotificationType } from "../shared/models/notification/notificationType.enum";
import { MessageType } from "../shared/models/message/messageType.enum";
import { MessageTypeReply } from "../shared/models/message/MessageTypes/messageTypeReply.model";
import { MessageTypeText } from "../shared/models/message/MessageTypes/messageTypeText.model";
import { MessageTypeImage } from "../shared/models/message/MessageTypes/messageTypeImage.model";
import { MessageTypeVideo } from "../shared/models/message/MessageTypes/messageTypeVideo.model";
import { MessageTypeFile } from "../shared/models/message/MessageTypes/messageTypeFile.model";

import { getUserById } from "../shared/services/user.service";
import { getGroupById } from "../shared/services/group.service";
import { MemberState } from "../shared/models/group/memberState.enum";

export const onMessageSend = fn.region("europe-west1").https.onCall(async (data, context) => {
  if (!context.auth) return new fn.https.HttpsError("unauthenticated", "", { msg: "User unauthenticated." });

  const authorRef = (await getUserById(context.auth.uid))?.ref;
  if (!authorRef) return new fn.https.HttpsError("not-found", "", { msg: "User " + context.auth.uid + " not found." });

  const groupSnap = await getGroupById(data.groupId);
  if (!groupSnap) return new fn.https.HttpsError("not-found", "", { msg: "Group " + data.groupId + " not found." });
  const group: Group = groupSnap.data() as Group;

  // Define Message content depending on message type
  let messageContent: MessageTypeText | MessageTypeReply | MessageTypeImage | MessageTypeVideo | MessageTypeFile;
  switch (data.type) {
    case MessageType.TEXT:
      messageContent = { text: data.content.text };
      break;
    case MessageType.REPLY:
      const replyMessage = await groupSnap.ref.collection("messages").doc(data.content.replyId).get();
      if (!replyMessage.exists) return new fn.https.HttpsError("not-found", "", { msg: "Reply Message not found." });
      messageContent = { reply: replyMessage.ref, text: data.content.text };
      break;
    case MessageType.IMAGE:
      messageContent = { url: data.content.url };
      break;
    case MessageType.VIDEO:
      messageContent = { url: data.content.url };
      break;
    case MessageType.FILE:
      messageContent = { url: data.content.url };
      break;
    default:
      return new fn.https.HttpsError("invalid-argument", "", { msg: "Message type is not valid." });
  }

  // Create new Message object
  const message: Message = {
    author: authorRef,
    type: data.type,
    content: messageContent,
    createdAt: Date.now(),
    reacts: [],
  };

  // Create new Message Document
  const messageRef = await groupSnap.ref.collection("messages").add(message);
  if (!messageRef) return new fn.https.HttpsError("internal", "", { msg: "Error creating message." });

  // Send a notification to all members expect message's author
  group.members.forEach(async (member: Member) => {
    if (!member.user.isEqual(authorRef) && member.state === MemberState.ACCEPT)
      await sendNotifToMembers(member.user, groupSnap.ref, messageRef);
  });

  return new fn.https.HttpsError("ok", "", { msg: "New message successfully send." });
});

// Send a notification to all members
const sendNotifToMembers = async (
  userRef: FirebaseFirestore.DocumentReference,
  groupRef: FirebaseFirestore.DocumentReference,
  messageRef: FirebaseFirestore.DocumentReference
) => {
  const notification: Notification = {
    type: NotificationType.NEW_MESSAGE,
    group: groupRef,
    message: messageRef,
    createdAt: Date.now(),
    seenAt: null,
  };
  await userRef.collection("notifications").add(notification);
};
