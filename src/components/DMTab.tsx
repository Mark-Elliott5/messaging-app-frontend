import { IDMTab } from '../types/wsMessageTypes';

function DMTab({
  tab,
  room,
  handleClick,
}: {
  tab: IDMTab & { newMessage: boolean };
  room: string;
  handleClick: (newRoom: string, senderName: string) => void;
}) {
  return (
    <div
      className={`flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-wire-400 ${room === tab.room ? 'bg-wire-400' : 'bg-wire-300'}`}
      onClick={() => {
        if (room === tab.room) return;
        handleClick(tab.room, tab.sender.username);
      }}
    >
      <div className='flex items-center gap-3'>
        <img
          className='inline-block h-9 flex-[0_1_0%]'
          src={`${tab.sender.avatar}.png`}
        />
        <span className=''>{tab.sender.username}</span>
      </div>
      <span
        className={`en h-3 w-3 ${tab.newMessage && room !== tab.room && 'border-1 border-green-500 bg-green-400'} rounded-full`}
      />
    </div>
  );
}

export default DMTab;
