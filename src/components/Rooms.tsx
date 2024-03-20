import useWebsocket from 'react-use-websocket';
import { useState } from 'react';
import { IDMTabMessage, MessageResponse } from '../types/wsMessageTypes';
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
    Map<string, IDMTabMessage & { newMessage: boolean }>
  >(new Map());

  const { sendMessage } = useWebsocket(`ws://${window.location.host}/chat`, {
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
            newMessage: data.room !== room,
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
        if (data.type === 'dmTab' || data.type === 'joinRoom') {
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
          <DMTab
            key={tab.sender.username}
            tab={tab}
            room={room}
            handleDMClick={handleDMClick}
          />
        ))
      : null;
  })();

  return (
    <div className='bg-wire-600'>
      <p className='bg-wire-400 py-2 pl-4 pr-2 font-bold'>Rooms</p>
      {['General', 'Gaming', 'Music', 'Sports', 'Computer Science'].map(
        (name) => (
          <BuiltInRoom
            key={name}
            name={name}
            room={room}
            handleClick={handleClick}
          />
        )
      )}
      <p className='bg-wire-400 py-2 pl-4 pr-2 font-bold'>Messages</p>
      {tabs?.length ? (
        tabs
      ) : (
        <p className='m-4 text-center italic'>No DMs yet!</p>
      )}
    </div>
  );
}

export default Rooms;
