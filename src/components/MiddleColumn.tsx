import MessageForm from './MessageForm';
import MessageList from './MessageList';

function MiddleColumn() {
  return (
    <div
      id='middle-column'
      className='flex flex-col border-x-1 border-gray-500'
    >
      <MessageList />
      <div id='message-input' className='flex flex-col'>
        <MessageForm />
      </div>
    </div>
  );
}

export default MiddleColumn;
