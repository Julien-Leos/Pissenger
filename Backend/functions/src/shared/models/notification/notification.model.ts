import { NotificationType } from "./notificationType.enum";

export interface Notification {
  type: NotificationType;
  group: FirebaseFirestore.DocumentReference;
  message: FirebaseFirestore.DocumentReference | null;
  createdAt: number;
  seenAt: number | null;
}
