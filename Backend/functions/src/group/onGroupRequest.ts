import * as fn from "firebase-functions";

import { Group } from "../shared/models/group/group.model";
import { Member } from "../shared/models/group/member.model";
import { MemberState } from "../shared/models/group/memberState.enum";
import { GroupMinified } from "../shared/models/user/groupMinified.model";
import { User } from "../shared/models/user/user.model";

import { checkGroupViability, deleteGroupById, getGroupById } from "../shared/services/group.service";
import { getUserById } from "../shared/services/user.service";

export const onGroupRequest = fn.region("europe-west1").https.onCall(async (data, context) => {
  if (!context.auth) return new fn.https.HttpsError("unauthenticated", "", { msg: "User unauthenticated." });

  const groupSnap = await getGroupById(data.groupId);
  if (!groupSnap) return new fn.https.HttpsError("not-found", "", { msg: "Group " + data.groupId + " not found." });
  const group: Group = groupSnap.data() as Group;

  const userSnap = await getUserById(context.auth.uid);
  if (!userSnap) return new fn.https.HttpsError("not-found", "", { msg: "User " + context.auth.uid + " not found." });
  const user: User = userSnap.data() as User;

  // Check Member
  const member: Member | undefined = group.members.find((groupMember: Member) =>
    groupMember.user.isEqual(userSnap.ref)
  );
  if (!member) {
    return new fn.https.HttpsError("not-found", "", {
      msg: "Cannot find Member " + userSnap.id + " in Group " + groupSnap.id + ".",
    });
  }
  if (member.state !== MemberState.REQUEST) {
    return new fn.https.HttpsError("already-exists", "", {
      msg: "Member " + userSnap.id + " already answered Group request.",
    });
  }

  // Check User
  const groupMin: GroupMinified | undefined = user.groups.find((userGroupMin: GroupMinified) =>
    userGroupMin.group.isEqual(groupSnap.ref)
  );
  if (!groupMin) {
    return new fn.https.HttpsError("not-found", "", {
      msg: "Cannot find Group " + groupSnap.id + " in User " + userSnap.id + ".",
    });
  }
  if (groupMin.state !== MemberState.REQUEST) {
    return new fn.https.HttpsError("already-exists", "", {
      msg: "User " + userSnap.id + " already answered Group request.",
    });
  }

  // Set state property of both Member and User
  member.state = groupMin.state = data.join ? MemberState.ACCEPT : MemberState.DECLINE;

  // Check if Group is still viable
  if (checkGroupViability(group)) {
    // If yes, execute the query
    await groupSnap.ref.update({ members: group.members });
    await userSnap.ref.update({ groups: user.groups });
  } else {
    // If not, delete the group
    await deleteGroupById(groupSnap.id);
  }

  return new fn.https.HttpsError("ok", "", { msg: "User has successfully answered to the Group request." });
});
