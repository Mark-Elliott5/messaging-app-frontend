import { IDMTab } from '../types/wsMessageTypes';

function DMTab({
  tab,
  handleClick,
}: {
  tab: IDMTab;
  handleClick: (currentRoom: string) => void;
}) {
  return (
    <div onClick={() => handleClick(tab.room)}>
      <img src={`${tab.sender.avatar}.jpg`}></img>
      <span className=''>{tab.sender.username}</span>
    </div>
  );
}

export default DMTab;
