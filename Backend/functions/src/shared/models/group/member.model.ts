export interface Member {
  user: string;
  firstName: string;
  lastName: string;
  picture: string | null;
  isAdmin: boolean;
  hasLeft: boolean;
}
