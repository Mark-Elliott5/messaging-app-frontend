import { useState } from 'react';
import Profile from './Profile';
import { AnimatePresence, motion } from 'framer-motion';
import TabInfo from './TabInfo';

function User({
  user,
  handleClick,
}: {
  user: { username: string; avatar: number; bio: string };
  handleClick: (receiver: string) => void;
}) {
  const [dropDownVisible, setDropDownVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);

  return (
    <>
      <motion.div
        layout
        animate={{
          transition: { duration: 0.3, ease: 'easeInOut' },
          opacity: 1,
          y: 0,
        }}
        initial={{ opacity: 0, y: -16 }}
        exit={{ opacity: 0 }}
        className={`m-3 cursor-pointer px-3 py-2 ${dropDownVisible ? 'bg-wire-300' : 'bg-wire-500 hover:bg-wire-400'} m-3 rounded-md shadow-md`}
        onClick={() => setDropDownVisible(!dropDownVisible)}
      >
        <motion.div layout className='flex items-center gap-3'>
          <TabInfo username={user.username} avatar={user.avatar} />
        </motion.div>
        <AnimatePresence mode='sync'>
          {dropDownVisible && (
            <motion.div
              layout
              animate={{
                transition: { duration: 0.4, ease: 'easeInOut' },
                opacity: 1,
                y: 0,
              }}
              initial={{ opacity: 0, y: -20 }}
              exit={{ opacity: 0 }}
            >
              <button
                type='button'
                className='mt-2 block w-full rounded-md p-2 text-left hover:bg-wire-200 hover:shadow-md'
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick(user.username);
                }}
              >
                Send DM
              </button>
              <button
                type='button'
                className='block w-full rounded-md p-2 text-left hover:bg-wire-200 hover:shadow-md'
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileVisible(true);
                }}
              >
                View Profile
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <AnimatePresence>
        {profileVisible && (
          <Profile user={user} setProfileVisible={setProfileVisible} />
        )}
      </AnimatePresence>
    </>
  );
}

export default User;
