interface ISendMessage {
  content: FormDataEntryValue;
}

interface ITypingIndication {
  typing: boolean;
}

type Action<T = ISendMessage | ITypingIndication> = {
  action: string;
} & T;

export type { Action, ISendMessage, ITypingIndication };
