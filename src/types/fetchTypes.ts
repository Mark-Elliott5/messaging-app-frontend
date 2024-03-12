import { Types } from 'mongoose';

interface IMessage {
  // _id: Types.ObjectId;
  type: string;
  content: string;
  // sender: IUser;
  // recipient: IUser | null;
  // room: Iroom;
  user: {
    username: string;
    avatar: number;
  };
  date: string; // strigified, needs to be reconstructed with new Date(x)
  // sequence: number;
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

interface Iroom {
  _id: Types.ObjectId;
  messages: IMessage[];
  directMessage:
    | false
    | {
        participants: IUser[];
      };
  // name: string | null;
}

// interface IDirectMessage {
//   _id: Types.ObjectId;
//   message: IMessage[];
//   sender: IUser;
//   recipient: IUser;
// }

interface IDirectMessageTab {
  _id: Types.ObjectId;
  sender: IUserTab;
}

// {
//   Id: ObjectId,
//   Content: string,
//   Sender: points to Member document,
//   Recipient: points to Member document, or null if posted to a room,
//   room: points to room document,
//   Date: date,
//   Sequence: number stating from 0 to indicate order of message received,
//   }

export type {
  Iroom,
  // IDirectMessage,
  IDirectMessageTab,
  IMessage,
  IUser,
};
