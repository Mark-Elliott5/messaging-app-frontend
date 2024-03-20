import { useState } from 'react';
import Profile from './Profile';
import { m } from 'framer-motion';

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
      <m.div
        animate={{
          transition: { duration: 0.2, type: 'tween' },
          opacity: 1,
        }}
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        className={`m-3 cursor-pointer px-3 py-2 ${dropDownVisible ? 'bg-wire-300' : 'bg-wire-500 hover:bg-wire-400'} m-3 rounded-md`}
        onClick={() => setDropDownVisible(!dropDownVisible)}
      >
        <div className='flex items-center gap-3'>
          <img
            className='inline-block h-9 flex-[0_1_0%]'
            src={`${user.avatar}.png`}
          ></img>
          <span className=''>{user.username}</span>
        </div>
        {dropDownVisible && (
          <>
            <button
              type='button'
              className='mt-2 block w-full rounded-md p-2 text-left hover:bg-wire-200'
              onClick={(e) => {
                e.stopPropagation();
                handleClick(user.username);
              }}
            >
              Send DM
            </button>
            <button
              type='button'
              className='block w-full rounded-md p-2 text-left hover:bg-wire-200'
              onClick={(e) => {
                e.stopPropagation();
                setProfileVisible(true);
              }}
            >
              View Profile
            </button>
          </>
        )}
      </m.div>
      {profileVisible && (
        <Profile
          key={user.username}
          user={user}
          setProfileVisible={setProfileVisible}
        />
      )}
    </>
  );
}

export default User;
