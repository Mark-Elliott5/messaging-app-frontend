import { useState } from 'react';

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
              onClick={(e) => {
                e.stopPropagation();
                handleClick(user.username);
              }}
            >
              Send DM
            </button>
            <button
              type='button'
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
        <div
          className='absolute z-10 h-dvh w-dvw'
          onClick={() => setProfileVisible(false)}
        >
          <div
            className='fixed left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 transform bg-wire-600 p-4'
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <img className='inline-block' src={`${user.avatar}.png`} />
              <header>{user.username}</header>
            </div>
            <p>{user.bio}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default User;
