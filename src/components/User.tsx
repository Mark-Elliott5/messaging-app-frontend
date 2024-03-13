function User({
  user,
}: {
  user: { username: string; avatar: number; bio: string };
}) {
  return (
    <div>
      <img src={`${user.avatar}.jpg`}></img>
      <span className=''>{user.username}</span>
    </div>
  );
}

export default User;
