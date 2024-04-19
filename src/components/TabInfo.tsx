function TabInfo({ username, avatar }: { username: string; avatar: number }) {
  return (
    <>
      <img className='inline-block h-9 flex-[0_1_0%]' src={`${avatar}.png`} />
      <span className=''>{username}</span>
    </>
  );
}

export default TabInfo;
