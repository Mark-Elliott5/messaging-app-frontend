import { useState } from 'react';
import { IStoredMessage } from '../types/wsMessageTypes';
import Profile from './Profile';
import { AnimatePresence, motion } from 'framer-motion';

function Message({ message }: { message: IStoredMessage }) {
  const [profileVisible, setProfileVisible] = useState(false);
  const blurbs = (() => {
    if (typeof message.content === 'string') {
      return (
        <p className='text-sm [word-break:break-word] md:text-base'>
          {message.content}
        </p>
      );
    }
    return message.content.map((blurb) => (
      <p className='text-sm [word-break:break-word] md:text-base'>{blurb}</p>
    ));
  })();

  return (
    <motion.div
      layout
      transition={{ duration: 0.1, ease: 'easeIn' }}
      className='my-1 flex gap-2 py-1 pl-3 pr-8 hover:bg-wire-400 md:pr-4'
    >
      <img
        className='inline-block h-10 flex-[0_1_0%] cursor-pointer md:h-12'
        src={`${message.user?.avatar}.png`}
        onClick={() => setProfileVisible(true)}
      ></img>
      <div className='ml-1 flex-1'>
        <div className='flex items-center gap-2'>
          <span className='text-base'>{message.user?.username}</span>
          <span className='text-xs text-wire-50 md:text-sm'>
            {new Date(message.date).toLocaleString()}
          </span>
        </div>
        {blurbs}
      </div>
      <AnimatePresence>
        {profileVisible && (
          <Profile user={message.user} setProfileVisible={setProfileVisible} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Message;
