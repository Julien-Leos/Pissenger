import * as fb from "firebase-admin";
import * as fn from "firebase-functions";

import { Group } from "../shared/models/group/group.model";
import { Member } from "../shared/models/group/member.model";
import { MemberState } from "../shared/models/group/memberState.enum";
import { Notification } from "../shared/models/notification/notification.model";
import { NotificationType } from "../shared/models/notification/notificationType.enum";
import { GroupMinified } from "../shared/models/user/groupMinified.model";
import { User } from "../shared/models/user/user.model";

import { getUserById } from "../shared/services/user.service";

export const onGroupCreate = fn.region("europe-west1").https.onCall(async (data, context) => {
  if (!context.auth) return new fn.https.HttpsError("unauthenticated", "", { msg: "User unauthenticated." });

  if (data.userIds.length < 2)
    return new fn.https.HttpsError("invalid-argument", "", { msg: "A group need at least 2 members." });

  // Create new Group object
  const group: Group = {
    name: data.name,
    picture: data.picture || null,
    createdAt: Date.now(),
    members: [],
  };

  // Get admin Ref
  const adminRef = (await getUserById(context.auth.uid))?.ref;
  if (!adminRef) {
    return new fn.https.HttpsError("not-found", "", { msg: "User " + context.auth.uid + " not found." });
  }

  // Get members User Document and create Member object
  for (const userId of data.userIds) {
    const userSnap = await getUserById(userId);
    if (!userSnap) return new fn.https.HttpsError("not-found", "", { msg: "User " + userId + " not found." });
    const user: User = userSnap.data() as User;
    const isAdmin: boolean = userSnap.ref.isEqual(adminRef);

    const member: Member = {
      user: userSnap.ref,
      firstName: user.profile.firstName,
      lastName: user.profile.lastName,
      picture: user.profile.picture,
      isAdmin: isAdmin,
      state: isAdmin ? MemberState.ACCEPT : MemberState.REQUEST, // The admin automatically agrees to join
    };
    group.members.push(member);
  }

  // Create new Group Document
  const groupRef = await fb.firestore().collection("groups").add(group);
  if (!groupRef) return new fn.https.HttpsError("internal", "", { msg: "Error creating group." });

  // Apply some functions to all members
  group.members.forEach(async (member: Member) => {
    const isAdmin: boolean = member.user.isEqual(adminRef);

    await addGroupRefToMembers(member.user, groupRef, group, isAdmin);
    await sendNotifToMembers(member.user, groupRef, isAdmin);
  });

  return new fn.https.HttpsError("ok", "", { msg: "New group successfully created." });
});

// Add reference of the group to each member's User Document
const addGroupRefToMembers = async (
  memberRef: FirebaseFirestore.DocumentReference,
  groupRef: FirebaseFirestore.DocumentReference,
  group: Group,
  isAdmin: boolean
) => {
  const groupMinified: GroupMinified = {
    group: groupRef,
    name: group.name,
    picture: group.picture,
    state: isAdmin ? MemberState.ACCEPT : MemberState.REQUEST, // The admin automatically agrees to join
  };
  await memberRef.update({ groups: fb.firestore.FieldValue.arrayUnion(groupMinified) });

  // When group is deleted, delete the ref to it in User Document
  groupRef.onSnapshot(async (doc) => {
    if (!doc.exists) await memberRef.update({ groups: fb.firestore.FieldValue.arrayRemove(groupMinified) });
  });
};

// Send a notification to all members except the admin
const sendNotifToMembers = async (
  userRef: FirebaseFirestore.DocumentReference,
  groupRef: FirebaseFirestore.DocumentReference,
  isAdmin: boolean
) => {
  if (isAdmin) return;

  const notification: Notification = {
    type: NotificationType.NEW_GROUP,
    group: groupRef,
    message: null,
    createdAt: Date.now(),
    seenAt: null,
  };
  await userRef.collection("notifications").add(notification);
};
