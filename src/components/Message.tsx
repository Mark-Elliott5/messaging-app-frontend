import { IStoredMessage } from '../types/wsMessageTypes';

function Message({ message }: { message: IStoredMessage }) {
  const blurbs = (() => {
    if (typeof message.content === 'string') {
      return <p className='mb-1 ml-3'>{message.content}</p>;
    }
    return message.content.map((blurb) => <p className='ml-3'>{blurb}</p>);
  })();

  return (
    <div className='my-1 ml-3 mr-8 flex gap-2'>
      <img
        className='inline-block h-9 flex-[0_1_0%]'
        src={`${message.user?.avatar}.png`}
      ></img>
      <div className=''>
        <div className='flex items-center gap-2'>
          <span className=''>{message.user?.username}</span>
          <span className='text-xs text-wire-50'>
            {new Date(message.date).toLocaleString()}
          </span>
        </div>
        {blurbs}
      </div>
    </div>
  );
}

export default Message;
