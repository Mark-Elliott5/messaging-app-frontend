import useWebsocket from 'react-use-websocket';
import { useState } from 'react';
import { IDMTab, MessageResponse } from '../types/wsMessageTypes';
import { IJoinDMRoom, IJoinRoom } from '../types/wsActionTypes';
import DMTab from './DMTab';
import BuiltInRoom from './BuiltInRoom';

function Rooms({
  room,
  setRoom,
  // setLoggedIn,
}: {
  room: string;
  setRoom: React.Dispatch<React.SetStateAction<string>>;
  // setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [tabsHistory, setTabsHistory] = useState<
    Map<string, IDMTab & { newMessage: boolean }>
  >(new Map());

  const { sendMessage } = useWebsocket('ws://localhost:3000/chat', {
    share: true, // Shares ws connection to same URL between components
    onMessage: (e) => {
      // console.log('room websocket message recieved');
      try {
        const data: MessageResponse = JSON.parse(e.data);
        if (data.type === 'blocked') {
          // setLoggedIn(false);
          return;
        }
        if (data.type === 'dmTab') {
          // if (tabsHistory.has(data.sender.username)) {
          //   return;
          // }
          const newHistory = new Map(tabsHistory);
          newHistory.set(data.sender.username, {
            ...data,
            newMessage: data.room !== room ?? true,
          });
          setTabsHistory(newHistory);
        }
        if (data.type === 'joinRoom') {
          setRoom(data.room);
        }
      } catch (error) {
        console.log(error);
      }
    },
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
        const data: MessageResponse = JSON.parse(e.data);
        if (data.type === 'dmTab') {
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
    const data: IJoinRoom = {
      action: 'joinRoom',
      room: currentRoom,
    };
    sendMessage(JSON.stringify(data));
    setRoom(currentRoom);
  };

  const handleDMClick = (newRoom: string, senderName: string) => {
    const newHistory = new Map(tabsHistory);
    const tabUpdate = newHistory.get(senderName);
    if (!tabUpdate) {
      return;
    }
    tabUpdate.newMessage = false;
    const data: IJoinDMRoom = {
      action: 'joinDMRoom',
      room: newRoom,
    };
    sendMessage(JSON.stringify(data));
    setRoom(newRoom);
  };

  const tabs = (() => {
    return tabsHistory.size
      ? Array.from(tabsHistory.values()).map((tab) => (
          <DMTab tab={tab} room={room} handleClick={handleDMClick} />
        ))
      : null;
  })();

  return (
    <div className='bg-wire-500'>
      <p className='p-2 font-bold'>Rooms</p>
      <div id='rooms' className='flex flex-col'>
        {['General', 'Gaming', 'Music', 'Sports', 'Computer Science'].map(
          (name) => (
            <BuiltInRoom name={name} room={room} handleClick={handleClick} />
          )
        )}
        <div className='bg-wire-500'>
          <p className='p-2 font-bold'>Messages</p>
        </div>
      </div>
      {tabs?.length ? (
        tabs
      ) : (
        <p className='bg-wire-600 text-center italic'>No DMs yet!</p>
      )}
    </div>
  );
}

export default Rooms;
