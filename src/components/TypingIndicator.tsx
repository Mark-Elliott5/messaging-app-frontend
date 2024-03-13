import AnimatedEllipses from './AnimatedEllipses';
import useWebsocket from 'react-use-websocket';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import { useState } from 'react';
import { ITyping } from '../types/wsMessageTypes';

function TypingIndicator() {
  const [typers, setTypers] = useState<Set<string>>(new Set());
  const { readyState } = useWebsocket('ws://localhost:3000/chat', {
    share: true, // Shares ws connection to same URL between components
    onOpen: () => console.log('Typing indicator websocket opened'),
    onClose: (e) =>
      console.log('Typing indicator websocket closed: ' + e.reason),
    onMessage: (e) => {
      try {
        if (!e.data) {
          return;
        }
        const data: ITyping = JSON.parse(e.data);
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
    onError: () => console.log('Typing indicator websocket error'),
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
        const data = JSON.parse(e.data);
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

  return (
    <div className='h-5'>
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
              className='ml-1'
            >
              <span className='pl-2 text-2xs'>{usersTyping}</span>
              <AnimatedEllipses />
            </m.div>
          </LazyMotion>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TypingIndicator;
