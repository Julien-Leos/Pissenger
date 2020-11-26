import { Gender } from "./gender.model";

export interface Profile {
  firstName: string;
  lastName: string;
  age: number;
  gender: Gender;
  picture: string | null;
}
