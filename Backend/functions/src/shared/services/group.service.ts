import * as fb from "firebase-admin";

import { Group } from "../models/group/group.model";
import { Member } from "../models/group/member.model";
import { MemberState } from "../models/group/memberState.enum";

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

export const deleteGroupById = async (groupId: string) => {
  await fb.firestore().collection("groups").doc(groupId).delete();
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
