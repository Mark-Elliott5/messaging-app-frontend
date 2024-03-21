import AnimatedEllipses from './AnimatedEllipses';
import useWebsocket from 'react-use-websocket';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import { useEffect, useState } from 'react';
import { MessageResponse } from '../types/wsMessageTypes';

function TypingIndicator({ room }: { room: string }) {
  const [typers, setTypers] = useState<Set<string>>(new Set());
  const { readyState } = useWebsocket(`ws://${window.location.host}/chat`, {
    share: true, // Shares ws connection to same URL between components
    onMessage: (e) => {
      try {
        const data: MessageResponse = JSON.parse(e.data);
        if (data.type === 'typing') {
          const newTypers = new Set(typers);
          data.typing
            ? newTypers.add(data.user.username)
            : newTypers.delete(data.user.username);
          setTypers(newTypers);
        }
      } catch (err) {
        console.log(err);
      }
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
    reconnectInterval: 3000, // Milliseconds?
    filter: (e) => {
      try {
        const data: MessageResponse = JSON.parse(e.data);
        if (data.type === 'typing') {
          return true;
        }
        return false;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
  });

  const usersTyping = (() => {
    // check that connection is open and typing property exists
    if (readyState !== 1 || !typers.size) {
      return null;
    }
    const names = [...typers];
    if (names.length >= 3) {
      return `${names[0]}, ${names[1]}, and others are typing`;
    }
    if (names.length === 2) {
      return `${names[0]} and ${names[1]} are typing`;
    }
    return `${names[0]} is typing`;
  })();

  useEffect(() => setTypers(new Set()), [room]);

  return (
    <div className='h-4 md:h-5'>
      <AnimatePresence>
        {usersTyping && (
          <LazyMotion features={domAnimation}>
            <m.div
              animate={{
                transition: { duration: 0.2 },
                y: 0,
                opacity: 1,
              }}
              exit={{ y: 6, opacity: 0 }}
              style={{ display: 'inline-block', y: 6, opacity: 0 }}
              className='ml-1 h-4 md:h-5'
            >
              <span className='pl-2 text-2xs md:text-xs'>{usersTyping}</span>
              <AnimatedEllipses />
            </m.div>
          </LazyMotion>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TypingIndicator;
