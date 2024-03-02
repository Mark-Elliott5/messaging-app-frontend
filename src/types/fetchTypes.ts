import { Types } from 'mongoose';

interface IMessage {
  _id: Types.ObjectId;
  content: string;
  sender: IUser;
  recipient: IUser | null;
  conversation: IConversation | null;
  date: Date;
  sequence: number;
}

interface IUser {
  _id: Types.ObjectId;
  username: string;
  bio: string;
  avatar: number;
}

interface IConversation {
  _id: Types.ObjectId;
  messages: IMessage[];
}

// {
//   Id: ObjectId,
//   Content: string,
//   Sender: points to Member document,
//   Recipient: points to Member document, or null if posted to a Conversation,
//   Conversation: points to Conversation document,
//   Date: date,
//   Sequence: number stating from 0 to indicate order of message received,
//   }

export type { IConversation, IMessage, IUser };
