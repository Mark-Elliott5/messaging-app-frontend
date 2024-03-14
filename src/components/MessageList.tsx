import useWebsocket from 'react-use-websocket';
import { IStoredMessage, MessageResponse } from '../types/wsMessageTypes';
import { useEffect, useState } from 'react';
import Message from './Message';

function MessageList({ room }: { room: string }) {
  // needs room id inherited from state to supply to first websocket hook arg
  const [loading] = useState(false);
  const [messageHistory, setMessageHistory] = useState<IStoredMessage[]>([]);
  // const messageBuffer = useRef<IMessage[]>([]);

  const { readyState } = useWebsocket('ws://localhost:3000/chat', {
    share: true, // Shares ws connection to same URL between components
    onOpen: () => {
      // console.log(JSON.stringify(data));
      // console.log('joinRoom sent');
    },
    onClose: (e) => console.log('MessageList websocket closed: ' + e.reason),
    onMessage: (e) => {
      const data: MessageResponse = JSON.parse(e.data);
      if (data.type === 'message') {
        const { username, avatar } = data.user;
        const latestMessage = messageHistory[messageHistory.length - 1];
        const latestUser = latestMessage?.user.username;
        if (username !== latestUser) {
          return setMessageHistory((prevState) => [...prevState, data]);
        }
        const newHistory = Array.from(messageHistory);
        const content =
          typeof latestMessage.content === 'string'
            ? [latestMessage.content, data.content]
            : [...latestMessage.content, data.content];
        const newMessage: IStoredMessage = {
          type: 'message',
          content,
          user: {
            username,
            avatar,
          },
          date: data.date,
        };
        newHistory.pop();
        newHistory.push(newMessage);
        return setMessageHistory(newHistory);
      }
    },
    onError: (err) => {
      console.log('MessageList websocket error: ');
      console.log(err);
    },
    retryOnError: true,
    shouldReconnect: (e) => {
      // code 1000 is 'Normal Closure'
      if (e.code !== 1000) {
        return true;
      }
      return false;
    },
    reconnectAttempts: 3, // Applies to retryOnError as well as reconnectInterval
    reconnectInterval: 3000, // Milliseconds?,
    // Every time readyState or lastMessage changes, the component rerenders, even
    // if it is not destructured from useWebsocket or used in the function body.
    // when filter returns false, lastMessage will not be updated. The 'on" options
    // (onMessage, etc), will still receive filtered messages though, which we
    // can then use to update our own state or reference. so filter stops unnecessary
    // automatic rerenders, then we can handle the message in onMessage
    filter: (e) => {
      console.log(e);
      try {
        const data: MessageResponse = JSON.parse(e.data);
        if (data.type === 'message') {
          return true;
        }
        return false;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
  });

  const messages = (() => {
    return messageHistory.length
      ? messageHistory
          .toReversed()
          .map((message) => <Message message={message} />)
      : null;
  })();

  const connectionStatusClasses = (() => {
    if (readyState === -1 || readyState >= 2) {
      return 'bg-red-400 border-red-500';
    }
    if (readyState === 0) {
      return 'bg-yellow-400 border-yellow-500';
    }
    if (readyState === 1) {
      return 'bg-green-400 border-green-500';
    }
  })();

  useEffect(() => {
    setMessageHistory([]);
  }, [room]);

  return (
    <>
      <div className='sticky top-0 z-10 flex w-full items-center gap-2 bg-wire-400 p-2'>
        <span
          className={`h-3 w-3 ${connectionStatusClasses} rounded-full border-1`}
        />
        <span className='font-bold'>{room}</span>
      </div>
      <div
        id='messages'
        className='relative flex h-dvh flex-[1_1_0] flex-col-reverse overflow-y-scroll'
      >
        {messages?.length ? (
          messages
        ) : loading ? (
          <p className='text-center italic'>Loading...</p>
        ) : (
          <p className='text-center italic'>No messages yet!</p>
        )}
      </div>
    </>
  );
}

export default MessageList;
