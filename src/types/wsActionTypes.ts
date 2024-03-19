interface ISendMessage {
  action: 'sendMessage';
  content: string; // FormDataEntryValue
}

interface ITypingIndication {
  action: 'typing';
  typing: boolean;
}

interface IJoinRoom {
  action: 'joinRoom';
  room: string;
}

interface IJoinDMRoom {
  action: 'joinDMRoom';
  room: string;
}

interface ICreateDMRoom {
  action: 'createDMRoom';
  receiver: string;
}

interface IUpdateProfile {
  action: 'updateProfile';
  profile: {
    avatar: number;
    bio: string;
  };
}

interface ILogout {
  action: 'logout';
}

type UserAction =
  | ISendMessage
  | ITypingIndication
  | IJoinRoom
  | IJoinDMRoom
  | ICreateDMRoom
  | IUpdateProfile
  | ILogout;

export type {
  UserAction,
  IJoinRoom,
  ISendMessage,
  ITypingIndication,
  IJoinDMRoom,
  ICreateDMRoom,
  IUpdateProfile,
  ILogout,
};
