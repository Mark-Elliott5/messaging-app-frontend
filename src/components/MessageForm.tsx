import {
  Action,
  ISendMessage,
  ITypingIndication,
} from '../types/dataTransferObjects';
import useWebsocket from 'react-use-websocket';

function MessageForm() {
  const { sendMessage, readyState } = useWebsocket(
    'wss://echo.websocket.events',
    {
      share: true, // Shares ws connection to same URL between components
      onOpen: () => console.log('MessageForm websocket opened'),
      onClose: (e) => console.log('MessageForm websocket closed: ' + e.reason),
      onMessage: () => console.log('MessageForm websocket message'),
      onError: () => console.log('MessageForm websocket error'),
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
      filter: () => {
        return true;
      },
    }
  );

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
    <form
      onSubmit={handleSendMessage}
      className='flex items-center justify-center px-2'
    >
      <input
        type='text'
        name='content'
        id='messsage-content'
        placeholder='Type here...'
        onChange={handleTyping}
        className='flex-1 px-2'
      />
      <button id='send-message' type='submit'>
        Send
      </button>
    </form>
  );
}

export default MessageForm;
