function BuiltInRoom({
  room,
  name,
  handleClick,
}: {
  room: string;
  name: string;
  handleClick: (currentRoom: string) => void;
}) {
  return (
    <div
      className={`cursor-pointer hover:bg-wire-400 ${room === name ? 'bg-wire-400' : 'bg-wire-300'}`}
      onClick={() => {
        if (room === name) return;
        handleClick(name);
      }}
    >
      <span className='inline-block w-full px-3 py-2'>{name}</span>
    </div>
  );
}

export default BuiltInRoom;
