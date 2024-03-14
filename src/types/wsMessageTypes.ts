import { Types } from 'mongoose';

interface IMessageBase {
  type: 'message';
  user: {
    username: string;
    avatar: number;
  };
  date: string; // strigified, needs to be reconstructed with new Date(x)
}

interface IMessage extends IMessageBase {
  content: string;
}

interface IStoredMessage extends IMessageBase {
  content: string | string[];
}

interface IDMTab {
  type: 'dmTab';
  sender: {
    username: string;
    avatar: number;
  };
  room: string;
}

interface ITyping {
  type: 'typing';
  typing: boolean;
  user: {
    username: string;
    avatar: number;
  };
}

interface IBlocked {
  type: 'blocked';
  message: string;
}

interface IJoinRoom {
  type: 'joinRoom';
  users: string[];
}

type IUsersOnline = { username: string; avatar: number; bio: string }[];

interface IUsersOnlineMessage {
  type: 'usersOnline';
  usersOnline: IUsersOnline;
}

interface IUser {
  _id: Types.ObjectId;
  username: string;
  bio: string;
  avatar: number;
}

type MessageResponse =
  | IMessage
  | IDMTab
  | ITyping
  | IBlocked
  | IJoinRoom
  | IUsersOnlineMessage;

export type {
  ITyping,
  IBlocked,
  IJoinRoom,
  IUsersOnline,
  IUsersOnlineMessage,
  IMessage,
  IStoredMessage,
  IDMTab,
  IUser,
  MessageResponse,
};
