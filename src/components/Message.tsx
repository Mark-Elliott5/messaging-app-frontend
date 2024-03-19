import { useState } from 'react';
import { IStoredMessage } from '../types/wsMessageTypes';
import Profile from './Profile';

function Message({ message }: { message: IStoredMessage }) {
  const [profileVisible, setProfileVisible] = useState(false);
  const blurbs = (() => {
    if (typeof message.content === 'string') {
      return <p className='[word-break:break-word]'>{message.content}</p>;
    }
    return message.content.map((blurb) => (
      <p className='[word-break:break-word]'>{blurb}</p>
    ));
  })();

  return (
    <div className='my-1 flex gap-2 py-1 pl-3 pr-8 hover:bg-wire-400'>
      <img
        className='inline-block h-12 flex-[0_1_0%] cursor-pointer'
        src={`${message.user?.avatar}.png`}
        onClick={() => setProfileVisible(true)}
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
      {profileVisible && (
        <Profile user={message.user} setProfileVisible={setProfileVisible} />
      )}
    </div>
  );
}

export default Message;
