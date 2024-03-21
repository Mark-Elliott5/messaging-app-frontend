import useWebSocket from 'react-use-websocket';
import { MessageResponse } from '../types/wsMessageTypes';
import { useEffect, useState } from 'react';
import ErrMessage from './ErrMessage';

function ServerMessage() {
  const [error, setError] = useState<string[]>([]);

  useWebSocket(`wss://${window.location.host}/chat`, {
    share: true, // Shares ws connection to same URL between components
    retryOnError: true,
    onMessage: (e) => {
      console.log(e);
      try {
        const data: MessageResponse = JSON.parse(e.data);
        if (data.type === 'blocked') {
          setError((prev) => [...prev, data.message]);
        }
      } catch (err) {
        console.log(err);
      }
    },
    shouldReconnect: (e) => {
      // code 1000 is "Normal Closure"
      if (e.code !== 1000) {
        return true;
      }
      return false;
    },
    reconnectAttempts: 3, // Applies to retryOnError as well as reconnectInterval
    reconnectInterval: 3000, // Milliseconds?,
    filter: () => false,
  });

  useEffect(() => {
    const clearError = setTimeout(() => {
      setError([]);
    }, 3000);
    return () => clearTimeout(clearError);
  }, [error]);

  return error.length ? (
    <div className='fixed left-0 top-0 flex flex-col-reverse gap-1 p-2 md:p-4'>
      {error.map((err) => (
        <ErrMessage err={err} />
      ))}
    </div>
  ) : null;
}

export default ServerMessage;
