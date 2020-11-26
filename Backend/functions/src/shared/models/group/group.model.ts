import { Member } from "./member.model";

export interface Group {
  name: string;
  picture: string | null;
  members: Array<Member>;
  createdAt: number;
}
