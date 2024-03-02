import {
  Action,
  ISendMessage,
  ITypingIndication,
} from '../types/dataTransferObjects';
import useWebsocket from 'react-use-websocket';

function MessageForm() {
  const { sendMessage, readyState } = useWebsocket('', {
    share: true, // Shares ws connection to same URL between components
    onOpen: () => console.log('MiddleColumn websocket opened'),
    onClose: (e) => console.log('MiddleColumn websocket closed: ' + e.reason),
    onMessage: () => console.log('MiddleColumn websocket message'),
    onError: () => console.log('MiddleColumn websocket error'),
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

  const handleTyping: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (readyState !== 1) {
      return;
    }
    const data: Action<ITypingIndication> = {
      action: 'typing',
      typing: e.target.value !== '' ?? false,
    };
    sendMessage(JSON.stringify(data));
  };

  const handleSendMessage: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (readyState !== 1) {
      return;
    }
    const formData = new FormData(e.target as HTMLFormElement);
    const content = formData.get('content');
    if (content === null) {
      return;
    }
    const data: Action<ISendMessage> = {
      action: 'submitMessage',
      content,
    };
    sendMessage(JSON.stringify(data));
  };

  return (
    <>
      <form onSubmit={handleSendMessage}>
        <input
          type='text'
          name='content'
          id='messsage-content'
          placeholder='Type here...'
          onChange={handleTyping}
        />
        <button id='send-message' type='submit'>
          Send
        </button>
      </form>
    </>
  );
}

export default MessageForm;
