import { Member } from "./member.model";

export interface Group {
  name: string;
  picture: string | null;
  members: [Member];
  createdAt: number;
}
