import { useState } from 'react';

function User({
  user,
  setRoom,
}: {
  user: { username: string; avatar: number; bio: string };
  setRoom: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [dropDownVisible, setDropDownVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);

  return (
    <>
      <div
        className='flex w-full flex-col bg-wire-700'
        onMouseOver={() => setDropDownVisible(true)}
        onMouseOut={() => setDropDownVisible(false)}
      >
        <div>
          <img src={`${user.avatar}.png`}></img>
          <span className=''>{user.username}</span>
        </div>
        {dropDownVisible && (
          <>
            <button
              type='button'
              onClick={(e) => {
                e.stopPropagation();
                setRoom(user.username);
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
        <div className='' onClick={() => setProfileVisible(false)}>
          <div className='p-4' onClick={(e) => e.stopPropagation()}>
            <div>
              <img src={`${user.avatar}.png`} />
              <h2>{user.username}</h2>
            </div>
            <p>{user.bio}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default User;
