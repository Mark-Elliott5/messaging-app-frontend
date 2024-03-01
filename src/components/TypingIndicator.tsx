import AnimatedEllipses from './AnimatedEllipses';
import useWebsocket from 'react-use-websocket';

function TypingIndicator() {
  // const [state, setState] = useState<string[] | null>(null);
  const { lastMessage, readyState } = useWebsocket('', {
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
  });

  const usersTyping = (() => {
    // check that connection is open and typing property exists
    if (readyState !== 1 || !lastMessage?.data?.typing) {
      return null;
    }
    const { typing } = lastMessage.data;
    if (typing.length >= 3) {
      return `${typing[0]}, ${typing[1]}, and others are typing`;
    }
    if (typing.length === 2) {
      return `${typing[0]} and ${typing[1]} are typing`;
    }
    return `${typing[0]} is typing`;
  })();

  return (
    usersTyping && (
      <>
        <span>{usersTyping}</span>
        <AnimatedEllipses />
      </>
    )
  );
}

export default TypingIndicator;
