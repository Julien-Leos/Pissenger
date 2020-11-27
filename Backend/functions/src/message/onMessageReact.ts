import * as fb from "firebase-admin";
import * as fn from "firebase-functions";

import { Reaction } from "../shared/models/message/reaction.model";
import { Message } from "../shared/models/message/message.model";

import { getUserById } from "../shared/services/user.service";
import { getMessageById } from "../shared/services/message.service";

export const onMessageReact = fn.region("europe-west1").https.onCall(async (data, context) => {
  if (!context.auth) return new fn.https.HttpsError("unauthenticated", "", { msg: "User unauthenticated." });

  const authorRef = (await getUserById(context.auth.uid))?.ref;
  if (!authorRef) return new fn.https.HttpsError("not-found", "", { msg: "User " + context.auth.uid + " not found." });

  const messageSnap = await getMessageById(data.groupId, data.messageId);
  if (!messageSnap) {
    return new fn.https.HttpsError("not-found", "", { msg: "Message " + data.messageId + " not found." });
  }
  const message: Message = messageSnap.data() as Message;

  let reaction: Reaction | undefined = message.reacts.find((react) => react.author.isEqual(authorRef));

  // If reaction from this User already exist, remove it.
  if (reaction) {
    await messageSnap.ref.update({ reacts: fb.firestore.FieldValue.arrayRemove(reaction) });
  }

  reaction = {
    type: data.reactionType,
    author: authorRef,
  };
  await messageSnap.ref.update({ reacts: fb.firestore.FieldValue.arrayUnion(reaction) });

  return new fn.https.HttpsError("ok", "", { msg: "New reaction successfully send." });
});
