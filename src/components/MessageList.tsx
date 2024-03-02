import useWebsocket from 'react-use-websocket';
import { IMessage } from '../types/fetchTypes';
import { useEffect, useRef, useState } from 'react';
import { getMessages } from '../fetch/fetchFunctions';

function MessageList() {
  const [loading, setLoading] = useState(true);
  const [messageHistory, setMessageHistory] = useState<IMessage[]>([]);
  const messageBuffer = useRef<IMessage[]>([]);

  useWebsocket('', {
    share: true, // Shares ws connection to same URL between components
    onOpen: () => console.log('MessageList websocket opened'),
    onClose: (e) => console.log('MessageList websocket closed: ' + e.reason),
    onMessage: (e) => {
      console.log('MessageList message recieved');
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
    reconnectInterval: 3000, // Milliseconds?
  });

  const formatDate = (date: Date) => {
    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const messages = (() => {
    return messageHistory?.map((message) => (
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
    ));
  })();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await getMessages('insert app state variable here');
        const messages = response.data;
        if (!messages) {
          throw new Error('No characters received.');
        }
        console.log(`Messages loaded: ${'app state variable here'}`);
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
    <div id='messages'>
      {messages?.length ? (
        messages
      ) : loading ? (
        <p>Loading...</p>
      ) : (
        <p>No messages yet!</p>
      )}
    </div>
  );
}

export default MessageList;
