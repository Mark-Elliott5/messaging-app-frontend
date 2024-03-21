import { motion } from 'framer-motion';
import useWebSocket from 'react-use-websocket';
import { MessageResponse } from '../types/wsMessageTypes';
import { useEffect, useState } from 'react';

function ServerMessage() {
  const [error, setError] = useState<string[]>([]);

  useWebSocket(`ws://${window.location.host}/chat`, {
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
      setError((prev) => prev.slice(1));
    }, 3000);
    return () => clearTimeout(clearError);
  }, [error]);

  return error.length ? (
    <div className='fixed left-0 top-0 flex flex-col-reverse gap-1 p-2 md:p-4'>
      {error.map((err) => (
        <motion.p
          initial={{ x: -70, opacity: 0 }}
          animate={{
            x: [-70, 0, 0, -70],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 3,
            times: [0, 0.1, 0.9, 1],
            ease: 'easeInOut',
          }}
          exit={{ opacity: 0, x: -70 }}
          style={{
            position: 'relative',
          }}
          className='rounded-md bg-rose-700 px-2 py-1 text-sm text-rose-100 shadow-wire'
          onClick={(e) => e.stopPropagation()}
        >
          🚫 Server error: {err}
        </motion.p>
      ))}
    </div>
  ) : null;
}

export default ServerMessage;
