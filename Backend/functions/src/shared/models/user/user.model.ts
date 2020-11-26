import { Profile } from "./profile.model";
import { GroupMinified } from "./groupMinified.model";

export interface User {
  profile: Profile;
  groups: Array<GroupMinified>;
}
