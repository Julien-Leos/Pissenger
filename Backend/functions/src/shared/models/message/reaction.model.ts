import { ReactionType } from "./reactionType.enum";

export interface Reaction {
  type: ReactionType;
  author: FirebaseFirestore.DocumentReference;
}
