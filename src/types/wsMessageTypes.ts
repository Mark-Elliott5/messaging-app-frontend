interface IResponseUser {
  username: string;
  avatar: number;
  bio: string;
}

interface IMessageBase {
  type: 'message';
  user: IResponseUser;
  date: Date; // will be stringified on frontend
}

interface IStoredMessage extends IMessageBase {
  content: string | string[];
}

interface IMessageModel extends IMessage {
  room: string;
}

interface IMessage extends IMessageBase {
  content: string;
}

interface IDMTab {
  type: 'dmTab';
  sender: IResponseUser;
  room: string;
}

interface ITyping {
  type: 'typing';
  typing: boolean;
  user: IResponseUser;
}

interface IBlocked {
  type: 'blocked';
  message: string;
}

interface IJoinRoom {
  type: 'joinRoom';
  room: string;
}

interface IRoomUsers {
  type: 'roomUsers';
  roomUsers: IResponseUser[]; // sets cannot be stringified, so must be array
}

interface IUsersOnline {
  type: 'usersOnline';
  usersOnline: IResponseUser[]; // sets cannot be stringified, so must be array
}

interface IMessageHistory {
  type: 'messageHistory';
  messageHistory: IMessageModel[];
}

type MessageResponse =
  | IMessage
  | IDMTab
  | ITyping
  | IBlocked
  | IJoinRoom
  | IRoomUsers
  | IUsersOnline
  | IMessageHistory;

export type {
  ITyping,
  IBlocked,
  IJoinRoom,
  IUsersOnline,
  IMessage,
  IDMTab,
  MessageResponse,
  IStoredMessage,
  IResponseUser,
};
