import useWebsocket from 'react-use-websocket';
import { IMessage } from '../types/fetchTypes';
import { useEffect, useRef, useState } from 'react';
import { getMessages } from '../fetch/fetchFunctions';
import TypingIndicator from './TypingIndicator';
import { Action, IJoinRoom } from '../types/dataTransferObjects';

function MessageList({ conversation }: { conversation: string }) {
  // needs conversation id inherited from state to supply to first websocket hook arg
  const [loading, setLoading] = useState(true);
  const [messageHistory, setMessageHistory] = useState<IMessage[]>([]);
  const messageBuffer = useRef<IMessage[]>([]);

  const { readyState, sendMessage } = useWebsocket(
    'wss://echo.websocket.events',
    {
      share: true, // Shares ws connection to same URL between components
      onOpen: () => {
        const data: Action<IJoinRoom> = {
          action: 'joinRoom',
          room: conversation,
        };
        sendMessage(JSON.stringify(data));
      },
      onClose: (e) => console.log('MessageList websocket closed: ' + e.reason),
      onMessage: (e) => {
        // console.log('MessageList websocket message recieved');
        console.log(e);
        try {
          const data = JSON.parse(e.data);
          if (data.type === 'message') {
            const { message } = data;
            if (loading) {
              messageBuffer.current.push(message);
            } else {
              setMessageHistory((prevState) => [...prevState, message]);
            }
          }
        } catch (err) {
          console.log(err);
        }
      },
      onError: () => console.log('MessageList websocket error'),
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
      filter: (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.type === 'message') {
            return true;
          }
          return false;
        } catch (err) {
          console.log(err);
          return false;
        }
      },
    }
  );

  const formatDate = (date: Date) => {
    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const messages = (() => {
    return messageHistory.length
      ? messageHistory.map((message) => (
          <div>
            <img src={`${message.sender.avatar}.jpg`}></img>
            <div>
              <div>
                <span className=''>{message.sender.username}</span>
                <span className=''>{formatDate(message.date)}</span>
              </div>
              <p>{message.content}</p>
            </div>
          </div>
        ))
      : null;
  })();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await getMessages(conversation);
        const { messages } = response.data;
        if (!messages) {
          setLoading(false);
          throw new Error('No messages received.');
        }
        console.log(
          `Messages loaded: ${'app state (conversation) variable here'}`
        );
        const history = messages.concat(messageBuffer.current);
        setMessageHistory(history);
        setLoading(false);
      } catch (err) {
        console.error('getMessages error: ' + err);
      }
    };

    fetchMessages();
  }, [conversation]);

  console.log(readyState);

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

  return (
    <>
      <div className='sticky top-0 z-10 flex w-full items-center gap-2 bg-wire-400 p-2'>
        <span
          className={`h-3 w-3 ${connectionStatusClasses} rounded-full border-1`}
        />
        <span className='font-bold'>General</span>
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
      <TypingIndicator />
    </>
  );
}

export default MessageList;
