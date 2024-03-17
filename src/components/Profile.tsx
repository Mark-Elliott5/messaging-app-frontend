function Profile({
  user,
  setProfileVisible,
}: {
  user: { username: string; avatar: number; bio: string };
  setProfileVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div
      className='fixed left-0 top-0 z-20 h-dvh w-dvw'
      onClick={() => setProfileVisible(false)}
    >
      <div
        className='fixed left-1/2 top-1/2 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 transform rounded-md bg-wire-600 p-4 shadow-md'
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <img className='inline-block' src={`${user.avatar}.png`} />
          <header>{user.username}</header>
        </div>
        <p>{user.bio}</p>
      </div>
    </div>
  );
}

export default Profile;
