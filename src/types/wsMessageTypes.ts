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

interface IMessageHistoryMessage {
  type: 'messageHistory';
  messageHistory: IContentMessage[];
}

interface IDMTabMessage {
  type: 'dmTab';
  sender: IResponseUser;
  room: string;
}

interface ITypingMessage {
  type: 'typing';
  typing: boolean;
  user: IResponseUser;
}

interface IBlockedMessage {
  type: 'blocked';
  message: string;
}

interface IJoinRoomMessage {
  type: 'joinRoom';
  room: string;
}

interface IRoomUsersMessage {
  type: 'roomUsers';
  roomUsers: IResponseUser[]; // sets cannot be stringified, so must be array
}

interface IUsersOnlineMessage {
  type: 'usersOnline';
  usersOnline: IResponseUser[]; // sets cannot be stringified, so must be array
}

interface IProfileMessage {
  type: 'profile';
  profile: IResponseUser;
}

interface ILoggedOutMessage {
  type: 'loggedOut';
}

type MessageResponse =
  | IContentMessage
  | IDMTabMessage
  | ITypingMessage
  | IBlockedMessage
  | IJoinRoomMessage
  | IRoomUsersMessage
  | IUsersOnlineMessage
  | IMessageHistoryMessage
  | IProfileMessage
  | ILoggedOutMessage;

export type {
  ITypingMessage,
  IBlockedMessage,
  IJoinRoomMessage,
  IUsersOnlineMessage,
  IContentMessage,
  IDMTabMessage,
  MessageResponse,
  IStoredMessage,
  IResponseUser,
};
