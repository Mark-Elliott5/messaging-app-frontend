import useWebsocket from 'react-use-websocket';
import { IMessage } from '../types/fetchTypes';
import { useEffect, useRef, useState } from 'react';
import { getMessages } from '../fetch/fetchFunctions';

function MessageList() {
  // needs conversation id inherited from state to supply to first websocket hook arg
  const [loading, setLoading] = useState(true);
  const [messageHistory, setMessageHistory] = useState<IMessage[]>([]);
  const messageBuffer = useRef<IMessage[]>([]);

  useWebsocket('wss://echo.websocket.events', {
    share: true, // Shares ws connection to same URL between components
    onOpen: () => console.log('MessageList websocket opened'),
    onClose: (e) => console.log('MessageList websocket closed: ' + e.reason),
    onMessage: (e) => {
      console.log('MessageList websocket message recieved');
      console.log(e);
      if (e.data.type === 'message') {
        const { message } = e.data;
        if (loading) {
          messageBuffer.current.push(message);
        } else {
          setMessageHistory((prevState) => [...prevState, message]);
        }
      }
    },
    onError: () => console.log('MessageList websocket error'),
    retryOnError: true,
    shouldReconnect: (e) => {
      // code 1000 is "Normal Closure"
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
  });

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
        const response = await getMessages('insert app state variable here');
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
  }, []);

  return (
    <>
      {messages?.length ? (
        <div id='messages' className='flex-1 border-b-1 border-gray-500'>
          {messages}
        </div>
      ) : loading ? (
        <div
          id='messages'
          className='flex-1 flex items-center justify-center border-b-1 border-gray-500'
        >
          <p className='text-center'>Loading...</p>
        </div>
      ) : (
        <div
          id='messages'
          className='flex-1 flex items-center justify-center border-b-1 border-gray-500'
        >
          <p className='text-center'>No messages yet!</p>
        </div>
      )}
    </>
  );
}

export default MessageList;
