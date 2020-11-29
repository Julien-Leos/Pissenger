import * as fb from "firebase-admin";
import * as fn from "firebase-functions";

import { Group } from "../shared/models/group/group.model";
import { Member } from "../shared/models/group/member.model";
import { MemberState } from "../shared/models/group/memberState.enum";
import { NotificationType } from "../shared/models/notification/notificationType.enum";
import { GroupMinified } from "../shared/models/user/groupMinified.model";
import { User } from "../shared/models/user/user.model";
import { createNotification } from "../shared/services/notification.service";

import { getUserById } from "../shared/services/user.service";

export const onGroupCreate = fn.region("europe-west1").https.onCall(async (data, context) => {
  if (!context.auth) return new fn.https.HttpsError("unauthenticated", "", { msg: "User unauthenticated." });

  if (data.userIds.length < 2)
    return new fn.https.HttpsError("invalid-argument", "", { msg: "A group need at least 2 members." });

  // Get creator Ref
  const creatorRef = (await getUserById(context.auth.uid))?.ref;
  if (!creatorRef) {
    return new fn.https.HttpsError("not-found", "", { msg: "User " + context.auth.uid + " not found." });
  }

  // Create new Group object
  const group: Group = {
    name: data.name,
    picture: data.picture || null,
    createdAt: Date.now(),
    members: [],
  };

  // Get members User Document and create Member object
  for (const userId of data.userIds) {
    const userSnap = await getUserById(userId);
    if (!userSnap) return new fn.https.HttpsError("not-found", "", { msg: "User " + userId + " not found." });
    const user: User = userSnap.data() as User;
    const isCreator: boolean = userSnap.ref.isEqual(creatorRef);

    const member: Member = {
      user: userSnap.ref,
      firstName: user.profile.firstName,
      lastName: user.profile.lastName,
      picture: user.profile.picture,
      state: isCreator ? MemberState.ACCEPT : MemberState.REQUEST, // The creator automatically agrees to join
    };
    group.members.push(member);
  }

  // Create new Group Document
  const groupRef = await fb.firestore().collection("groups").add(group);
  if (!groupRef) return new fn.https.HttpsError("internal", "", { msg: "Error creating group." });

  // Apply some functions to all members
  group.members.forEach(async (member: Member) => {
    const isCreator: boolean = member.user.isEqual(creatorRef);

    await addGroupRefToMember(member.user, groupRef, group, isCreator);
    if (!isCreator) {
      await createNotification(NotificationType.NEW_GROUP, member.user, groupRef, null);
    }
  });

  return new fn.https.HttpsError("ok", "", { msg: "New group successfully created." });
});

// Add reference of the group to each member's User Document
const addGroupRefToMember = async (
  memberRef: FirebaseFirestore.DocumentReference,
  groupRef: FirebaseFirestore.DocumentReference,
  group: Group,
  isCreator: boolean
) => {
  const groupMinified: GroupMinified = {
    group: groupRef,
    name: group.name,
    picture: group.picture,
    state: isCreator ? MemberState.ACCEPT : MemberState.REQUEST, // The creator automatically agrees to join
  };
  await memberRef.update({ groups: fb.firestore.FieldValue.arrayUnion(groupMinified) });
};
