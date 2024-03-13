import useWebsocket from 'react-use-websocket';
import { useState } from 'react';
import { IBlocked, IDMTab } from '../types/wsMessageTypes';
import { IJoinRoom } from '../types/wsActionTypes';
import DMTab from './DMTab';

function Rooms({
  room,
  setRoom,
  setLoggedIn,
}: {
  room: string;
  setRoom: React.Dispatch<React.SetStateAction<string>>;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [tabsHistory, setTabsHistory] = useState<Map<string, IDMTab>>(
    new Map()
  );

  const { sendMessage } = useWebsocket('ws://localhost:3000/chat', {
    share: true, // Shares ws connection to same URL between components
    onOpen: () => console.log('room websocket opened'),
    onClose: (e) => console.log('room websocket closed: ' + e.reason),
    onMessage: (e) => {
      // console.log('room websocket message recieved');
      try {
        const data: IBlocked | IDMTab = JSON.parse(e.data);
        if (data.type === 'blocked') {
          setLoggedIn(false);
        }
        if (data.type === 'dmTab') {
          const newHistory = new Map(tabsHistory);
          newHistory.set(data.sender.username, data);
          setTabsHistory(newHistory);
        }
      } catch (error) {
        console.log(error);
      }
    },
    onError: () => console.log('room websocket error'),
    retryOnError: true,
    shouldReconnect: (e) => {
      // code 1000 is 'Normal Closure'
      if (e.code !== 1000) {
        return true;
      }
      return false;
    },
    reconnectAttempts: 3, // Applies to retryOnError as well as reconnectInterval
    reconnectInterval: 3000, // Milliseconds?,
    filter: (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'tabs') {
          return true;
        }
        return false;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
  });

  const handleClick = (currentRoom: string) => {
    if (room === currentRoom) {
      return;
    }
    const data: IJoinRoom = {
      action: 'joinRoom',
      room: currentRoom,
    };
    sendMessage(JSON.stringify(data));
    setRoom(currentRoom);
  };

  const tabs = (() => {
    return tabsHistory.size
      ? Array.from(tabsHistory.values()).map((tab) => (
          <DMTab handleClick={handleClick} tab={tab} />
        ))
      : null;
  })();

  return (
    <>
      <div className='flex w-full items-center gap-2 bg-wire-500 p-2'>
        <span className='font-bold'>Rooms</span>
      </div>
      <div id='rooms' className='flex flex-col'>
        <div
          onClick={() => {
            handleClick('General');
          }}
        >
          {/* <img src={`${tab.sender.avatar}.jpg`}></img> */}
          <span className='inline-block w-full bg-wire-300 pl-2'>General</span>
        </div>
        <div
          onClick={() => {
            handleClick('Gaming');
          }}
        >
          {/* <img src={`${tab.sender.avatar}.jpg`}></img> */}
          <span className='inline-block w-full bg-wire-300 pl-2'>Gaming</span>
        </div>
        <div className='sticky top-0 z-10 flex w-full items-center gap-2 bg-wire-500 p-2'>
          <span className='font-bold'>Messages</span>
        </div>
        {tabs?.length ? (
          tabs
        ) : (
          <p className='text-center italic'>No DMs yet!</p>
        )}
      </div>
    </>
  );
}

export default Rooms;
