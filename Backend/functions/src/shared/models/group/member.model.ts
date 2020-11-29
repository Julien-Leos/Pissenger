import { MemberState } from "./memberState.enum";

export interface Member {
  user: FirebaseFirestore.DocumentReference;
  firstName: string;
  lastName: string;
  picture: string | null;
  state: MemberState;
}
