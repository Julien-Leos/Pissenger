import { NotificationType } from "./notificationType.model";

export interface Notification {
  recipient: string;
  type: NotificationType;
  group: string;
  message: string;
  createdAt: number;
  seenAt: number | null;
}
