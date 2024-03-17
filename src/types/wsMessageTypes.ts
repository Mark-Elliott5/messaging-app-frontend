interface IResponseUser {
  username: string;
  avatar: number;
  bio: string;
}

interface IMessageBase {
  type: 'message';
  user: IResponseUser;
  date: string; // will be stringified on frontend, needs new Date() constructor
}

interface IContentMessage extends IMessageBase {
  content: string;
}

interface IStoredMessage extends IMessageBase {
  content: string | string[];
}

// interface IMessageModel extends IMessage {
//   room: string;
// }

interface IMessageHistory {
  type: 'messageHistory';
  messageHistory: IContentMessage[];
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

type MessageResponse =
  | IContentMessage
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
  IContentMessage,
  IDMTab,
  MessageResponse,
  IStoredMessage,
  IResponseUser,
};
