import { Gender } from "./gender.enum";

export interface Profile {
  firstName: string;
  lastName: string;
  age: number;
  gender: Gender;
  picture: string | null;
}
