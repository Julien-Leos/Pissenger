import * as fb from "firebase-admin";

import { Group } from "../models/group/group.model";
import { Member } from "../models/group/member.model";
import { MemberState } from "../models/group/memberState.enum";
import { GroupMinified } from "../models/user/groupMinified.model";
import { User } from "../models/user/user.model";

export const getGroupById = (groupId: string) => {
  return fb
    .firestore()
    .collection("groups")
    .doc(groupId)
    .get()
    .then((groupRef) => {
      if (groupRef.exists) return groupRef;
      else return null;
    })
    .catch(() => {
      return null;
    });
};

export const deleteGroupById = async (groupRef: FirebaseFirestore.DocumentReference, group: Group) => {
  // Delete the ref to the group to each members
  for (const member of group.members) {
    const groupMinToDelete: GroupMinified | undefined = await ((
      await member.user.get()
    ).data() as User).groups.find((groupMin: GroupMinified) => groupMin.group.isEqual(groupRef));
    if (!groupMinToDelete) return false;
    await member.user.update({ groups: fb.firestore.FieldValue.arrayRemove(groupMinToDelete) });
  }

  await fb.firestore().collection("groups").doc(groupRef.id).delete();
  return true;
};

export const checkGroupViability = (group: Group): boolean => {
  if (
    group.members.filter(
      (member: Member) => member.state === MemberState.REQUEST || member.state === MemberState.ACCEPT
    ).length < 2
  ) {
    return false;
  }
  return true;
};
