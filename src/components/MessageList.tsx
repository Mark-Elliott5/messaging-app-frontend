import useWebsocket from 'react-use-websocket';
import { IMessage } from '../types/wsMessageTypes';
import { useEffect, useState } from 'react';
// import { getMessages } from '../fetch/fetchFunctions';
import { Action, IJoinRoom } from '../types/wsActionTypes';
import Message from './Message';

function MessageList({ room }: { room: string }) {
  // needs room id inherited from state to supply to first websocket hook arg
  const [loading] = useState(false);
  const [messageHistory, setMessageHistory] = useState<IMessage[]>([]);
  // const messageBuffer = useRef<IMessage[]>([]);

  const { readyState, sendMessage } = useWebsocket('ws://localhost:3000/chat', {
    share: true, // Shares ws connection to same URL between components
    onOpen: () => {
      console.log('connected');
      const data: Action<IJoinRoom> = {
        action: 'joinRoom',
        room: room,
      };
      sendMessage(JSON.stringify(data));
      console.log('sent join');
      // console.log(JSON.stringify(data));
      // console.log('joinRoom sent');
    },
    onClose: (e) => console.log('MessageList websocket closed: ' + e.reason),
    onMessage: (e) => {
      console.log(e);
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'message') {
          if (loading) {
            // messageBuffer.current.push(message);
          } else {
            console.log('setting history');
            setMessageHistory((prevState) => [...prevState, data]);
          }
        }
      } catch (err) {
        console.log(err);
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
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'message') {
          return true;
        }
        console.log('messagelist filtered out message');
        return false;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
  });

  const messages = (() => {
    messageHistory.map((e) => {
      console.log('logging message');
      console.log(e);
    });
    return messageHistory.length
      ? messageHistory.reverse().map((message) => <Message message={message} />)
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
