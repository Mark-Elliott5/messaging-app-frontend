import { Types } from 'mongoose';

interface IMessage {
  _id: Types.ObjectId;
  content: string;
  sender: IUser;
  recipient: IUser | null;
  conversation: IConversation | null;
  directMessage: IDirectMessage | null;
  date: Date;
  sequence: number;
}

interface IUser {
  _id: Types.ObjectId;
  username: string;
  bio: string;
  avatar: number;
}

interface IUserTab {
  _id: Types.ObjectId;
  username: string;
  avatar: number;
}

interface IConversation {
  _id: Types.ObjectId;
  messages: IMessage[];
  // name: string | null;
}

interface IDirectMessage {
  _id: Types.ObjectId;
  message: IMessage[];
  sender: IUser;
  recipient: IUser;
}

interface IDirectMessageTab {
  _id: Types.ObjectId;
  sender: IUserTab;
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

export type {
  IConversation,
  IDirectMessage,
  IDirectMessageTab,
  IMessage,
  IUser,
};
