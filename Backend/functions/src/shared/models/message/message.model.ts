import { MessageType } from "./messageType.enum";
import { MessageTypeFile } from "./MessageTypes/messageTypeFile.model";
import { MessageTypeImage } from "./MessageTypes/messageTypeImage.model";
import { MessageTypeReply } from "./MessageTypes/messageTypeReply.model";
import { MessageTypeText } from "./MessageTypes/messageTypeText.model";
import { MessageTypeVideo } from "./MessageTypes/messageTypeVideo.model";
import { Reaction } from "./reaction.model";

export interface Message {
  author: FirebaseFirestore.DocumentReference;
  type: MessageType;
  content: MessageTypeText | MessageTypeReply | MessageTypeImage | MessageTypeVideo | MessageTypeFile;
  createdAt: number;
  reacts: Array<Reaction>;
}
