export interface Member {
  user: FirebaseFirestore.DocumentReference;
  firstName: string;
  lastName: string;
  picture: string | null;
  isAdmin: boolean;
  hasLeft: boolean;
}
