import { MemberState } from "../group/memberState.enum";

export interface GroupMinified {
  group: FirebaseFirestore.DocumentReference;
  name: string;
  picture: string | null;
  state: MemberState;
}
