export interface GroupMinified {
  group: FirebaseFirestore.DocumentReference;
  name: string;
  picture: string | null;
  hasJoined: boolean;
}
