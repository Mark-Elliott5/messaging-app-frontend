import AnimatedEllipses from './AnimatedEllipses';
import useWebsocket from 'react-use-websocket';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';

function TypingIndicator() {
  // const [state, setState] = useState<string[] | null>(null);
  const { lastMessage, readyState } = useWebsocket(
    'wss://echo.websocket.events',
    {
      share: true, // Shares ws connection to same URL between components
      onOpen: () => console.log('Typing indicator websocket opened'),
      onClose: (e) =>
        console.log('Typing indicator websocket closed: ' + e.reason),
      onMessage: () => console.log('Typing indicator websocket message'),
      onError: () => console.log('Typing indicator websocket error'),
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
      filter: (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.action === 'typing') {
            console.log('typing true');
            return true;
          }
          console.log('typing False');
          return false;
        } catch (err) {
          console.log(err);
          return false;
        }
      },
    }
  );

  const usersTyping = (() => {
    // check that connection is open and typing property exists
    try {
      if (!lastMessage) {
        return null;
      }
      const data = JSON.parse(lastMessage.data);
      const { typing, typers } = data;
      if (readyState !== 1 || !typing) {
        console.log('usersTyping null');
        return null;
      }
      if (typing.length >= 3) {
        console.log('usersTyping true');
        return true;
        // uncomment when backend written:
        // return `${typers[0]}, ${typers[1]}, and others are typing`;
      }
      if (typing.length === 2) {
        console.log('usersTyping true');
        return true;
        // uncomment when backend written:
        // return `${typers[0]} and ${typers[1]} are typing`;
      }
      console.log('usersTyping true');
      return true;
      // uncomment when backend written:
      // return `${typers[0]} is typing`;
    } catch (err) {
      console.log('usersTyping err: ' + err);
      return null;
    }
  })();

  return (
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
            className='px-1 absolute bottom-0 left-0'
          >
            <span className='text-2xs'>{'mark is typing'}</span>
            <AnimatedEllipses />
          </m.div>
        </LazyMotion>
      )}
    </AnimatePresence>
  );
}

export default TypingIndicator;
