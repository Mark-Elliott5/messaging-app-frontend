import {
  Action,
  ISendMessage,
  ITypingIndication,
} from '../types/dataTransferObjects';
// import SendRoundedIcon from '@mui/icons-material/SendRounded';
import useWebsocket from 'react-use-websocket';
import TextareaAutosize from 'react-textarea-autosize';

function MessageForm() {
  // needs app state conversation variable to placeholder "Message {conversation}"
  const { sendMessage, readyState } = useWebsocket(
    'wss://echo.websocket.events',
    {
      share: true, // Shares ws connection to same URL between components
      onOpen: () => console.log('MessageForm websocket opened'),
      onClose: (e) => console.log('MessageForm websocket closed: ' + e.reason),
      // onMessage: () => console.log('MessageForm websocket message'),
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
        return false;
      },
    }
  );

  const handleTyping: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    if (readyState !== 1) {
      return;
    }
    const data: Action<ITypingIndication> = {
      action: 'typing',
      typing: e.target.value !== '' ?? false,
    };
    sendMessage(JSON.stringify(data));
  };

  const handleSendMessage: React.KeyboardEventHandler<HTMLTextAreaElement> = (
    e
  ) => {
    if (readyState !== 1) {
      return;
    }
    const content = e.currentTarget.value;
    if (!content) {
      return;
    }
    sendMessage(
      JSON.stringify({
        action: 'typing',
        typing: false,
      })
    );
    const data: Action<ISendMessage> = {
      action: 'submitMessage',
      content,
    };
    sendMessage(JSON.stringify(data));
    e.currentTarget.value = '';
  };

  return (
    <div className='mx-2 my-2 flex items-center justify-center rounded-md bg-wire-400 px-2 py-1'>
      <TextareaAutosize
        maxRows={3}
        name='content'
        id='messsage-content'
        placeholder='Type here...'
        onChange={handleTyping}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.shiftKey === false) {
            e.preventDefault();
            handleSendMessage(e);
          }
        }}
        className='flex-1 resize-none rounded-md bg-wire-400 px-2 outline-none'
      />
      <button id='send-message' type='submit' className='hidden' />
    </div>
  );
}

export default MessageForm;
