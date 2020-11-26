import { Profile } from "./profile.model";

export interface User {
  profile: Profile;
  groups: [
    {
      group: string;
      name: string;
      picture: string | null;
      hasJoined: boolean;
    }
  ];
  notifications: [string];
}
