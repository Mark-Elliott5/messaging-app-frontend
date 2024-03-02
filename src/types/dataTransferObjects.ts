interface ISendMessage {
  content: FormDataEntryValue;
  // need to add current channel property inherited from App.tsx
}

interface ITypingIndication {
  typing: boolean;
}

type Action<T = ISendMessage | ITypingIndication> = {
  action: string;
} & T;

export type { Action, ISendMessage, ITypingIndication };
