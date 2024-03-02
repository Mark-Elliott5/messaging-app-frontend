import MessageForm from './MessageForm';
import MessageList from './MessageList';
import TypingIndicator from './TypingIndicator';

function MiddleColumn() {
  return (
    <div id='middle-column'>
      <MessageList />
      <div id='message-input' className='flex flex-col p-2'>
        <TypingIndicator />
        <MessageForm />
      </div>
    </div>
  );
}

export default MiddleColumn;
