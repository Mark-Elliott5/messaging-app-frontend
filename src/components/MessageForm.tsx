import { ISendMessage, ITypingIndication } from '../types/wsActionTypes';
// import SendRoundedIcon from '@mui/icons-material/SendRounded';
import useWebsocket from 'react-use-websocket';
import TextareaAutosize from 'react-textarea-autosize';
import { useEffect, useRef } from 'react';

function MessageForm({ room }: { room: string }) {
  // needs app state room variable to placeholder "Message {room}"
  const { sendMessage, readyState } = useWebsocket('ws://localhost:3000/chat', {
    share: true, // Shares ws connection to same URL between components
    onClose: (e) => console.log('MessageForm websocket closed: ' + e.reason),
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
    filter: () => false,
  });

  const lastTypingSent = useRef(false);

  const handleTyping: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    if (readyState !== 1) {
      return;
    }
    const typing = !!e.target.value;
    if (lastTypingSent.current === typing) {
      return;
    }
    const data: ITypingIndication = {
      action: 'typing',
      typing,
    };
    lastTypingSent.current = typing;
    sendMessage(JSON.stringify(data));
  };

  const handleSendMessage: React.KeyboardEventHandler<HTMLTextAreaElement> = (
    e
  ) => {
    if (readyState !== 1) {
      return;
    }
    const content = e.currentTarget.value.trim();
    if (!content) {
      return;
    }
    sendMessage(
      JSON.stringify({
        action: 'typing',
        typing: false,
      })
    );
    lastTypingSent.current = false;
    const data: ISendMessage = {
      action: 'sendMessage',
      content: content.trim(),
    };
    sendMessage(JSON.stringify(data));
    e.currentTarget.value = '';
  };

  useEffect(() => {
    lastTypingSent.current = false;
  }, [room]);

  return (
    <div id='message-input' className='flex flex-col'>
      <div className='mx-2 my-2 flex items-center justify-center rounded-md bg-wire-400 px-2 py-1'>
        <TextareaAutosize
          maxRows={3}
          name='content'
          id='messsage-content'
          placeholder={`Message ${room}`}
          onChange={handleTyping}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.shiftKey === false) {
              e.preventDefault();
              handleSendMessage(e);
            }
          }}
          minLength={1}
          cacheMeasurements={true}
          className='flex-1 resize-none rounded-md bg-wire-400 px-2 placeholder-wire-50 outline-none placeholder:italic'
        />
        <button id='send-message' type='submit' className='hidden' />
      </div>
    </div>
  );
}

export default MessageForm;
