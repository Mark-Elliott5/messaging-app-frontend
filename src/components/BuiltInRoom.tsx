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
      className={`cursor-pointer ${room === name ? 'bg-wire-300' : 'bg-wire-500 hover:bg-wire-400'} m-3 rounded-md shadow-md`}
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
