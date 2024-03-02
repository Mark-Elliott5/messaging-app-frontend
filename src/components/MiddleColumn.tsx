import MessageForm from './MessageForm';
import TypingIndicator from './TypingIndicator';

function MiddleColumn() {
  return (
    <div id='middle-column'>
      <div id='messages'></div>
      <div id='message-input' className='flex flex-col p-2'>
        <TypingIndicator />
        <MessageForm />
      </div>
    </div>
  );
}

export default MiddleColumn;
