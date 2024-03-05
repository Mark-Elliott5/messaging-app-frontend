import MessageForm from './MessageForm';
import MessageList from './MessageList';

function MiddleColumn() {
  return (
    <div id='middle-column' className='z-10 flex flex-col bg-wire-500 shadow-x'>
      <MessageList />
      <div id='message-input' className='flex flex-col'>
        <MessageForm />
      </div>
    </div>
  );
}

export default MiddleColumn;
