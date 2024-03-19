import { useState } from 'react';
import Profile from './Profile';

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
      <div
        className={`w-full cursor-pointer px-3 py-2 hover:bg-wire-400 ${dropDownVisible ? 'bg-wire-400' : 'bg-wire-300'}`}
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
              className='mt-1 block hover:bg-wire-400'
              onClick={(e) => {
                e.stopPropagation();
                handleClick(user.username);
              }}
            >
              Send DM
            </button>
            <button
              type='button'
              className='block hover:bg-wire-400'
              onClick={(e) => {
                e.stopPropagation();
                setProfileVisible(true);
              }}
            >
              View Profile
            </button>
          </>
        )}
      </div>
      {profileVisible && (
        <Profile user={user} setProfileVisible={setProfileVisible} />
      )}
    </>
  );
}

export default User;
