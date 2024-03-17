import { IStoredMessage } from '../types/wsMessageTypes';

function Message({ message }: { message: IStoredMessage }) {
  const blurbs = (() => {
    if (typeof message.content === 'string') {
      return (
        <p className='mb-1 ml-3 [word-break:break-word]'>{message.content}</p>
      );
    }
    return message.content.map((blurb) => (
      <p className='mb-1 ml-3 [word-break:break-word]'>{blurb}</p>
    ));
  })();

  return (
    <div className='flex gap-2 py-1 pl-3 pr-8 hover:bg-wire-400'>
      <img
        className='inline-block h-12 flex-[0_1_0%]'
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
