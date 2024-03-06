import MessageForm from './MessageForm';
import MessageList from './MessageList';

function MiddleColumn({ conversation }: { conversation: string }) {
  return (
    <div id='middle-column' className='z-10 flex flex-col bg-wire-500 shadow-x'>
      <MessageList conversation={conversation} />
      <MessageForm />
    </div>
  );
}

export default MiddleColumn;
