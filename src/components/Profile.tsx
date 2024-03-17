function Profile({
  user,
  setProfileVisible,
}: {
  user: { username: string; avatar: number; bio: string };
  setProfileVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
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
  );
}

export default Profile;
