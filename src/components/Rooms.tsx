import useWebsocket from 'react-use-websocket';
import { useEffect, useRef, useState } from 'react';
import { getDMTabs } from '../fetch/fetchFunctions';
import { IDirectMessageTab } from '../types/fetchTypes';
import { Action, IJoinRoom } from '../types/dataTransferObjects';

function Rooms({
  room,
  setroom,
}: {
  room: string;
  setroom: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [loading, setLoading] = useState(true);
  const [tabsHistory, setTabsHistory] = useState<IDirectMessageTab[]>([]);
  const tabsBuffer = useRef<IDirectMessageTab[]>([]);

  const { sendMessage } = useWebsocket('ws://localhost:3000/echo', {
    share: true, // Shares ws connection to same URL between components
    onOpen: () => console.log('room websocket opened'),
    onClose: (e) => console.log('room websocket closed: ' + e.reason),
    onMessage: (e) => {
      // console.log('room websocket message recieved');
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'tabs') {
          const { tab } = data;
          if (loading) {
            tabsBuffer.current.push(tab);
          } else {
            setTabsHistory((prevState) => [...prevState, tab]);
          }
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
    const data: Action<IJoinRoom> = {
      action: 'joinRoom',
      room,
    };
    sendMessage(JSON.stringify(data));
    setroom(room);
  };

  const tabs = (() => {
    return tabsHistory.length
      ? tabsHistory.map((tab) => (
          <div onClick={() => setroom(tab._id.toString())}>
            <img src={`${tab.sender.avatar}.jpg`}></img>
            <span className=''>{tab.sender.username}</span>
          </div>
        ))
      : null;
  })();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await getDMTabs();
        const { directMessageTabs } = response.data;
        if (!directMessageTabs) {
          setLoading(false);
          throw new Error('No messages received.');
        }
        console.log(`DM Tabs loaded`);
        const history = directMessageTabs.concat(tabsBuffer.current);
        setTabsHistory(history);
        setLoading(false);
      } catch (err) {
        console.error('getDMTabs error: ' + err);
      }
    };

    fetchMessages();
  }, []);

  return (
    <>
      <div className='flex w-full items-center gap-2 bg-wire-500 p-2'>
        <span className='font-bold'>Rooms</span>
      </div>
      <div id='rooms' className='flex flex-col'>
        <div
          onClick={() => {
            handleClick('general');
          }}
        >
          {/* <img src={`${tab.sender.avatar}.jpg`}></img> */}
          <span className='inline-block w-full bg-wire-300 pl-2'>General</span>
        </div>
        <div
          onClick={() => {
            handleClick('gaming');
          }}
        >
          {/* <img src={`${tab.sender.avatar}.jpg`}></img> */}
          <span className='inline-block w-full bg-wire-300 pl-2'>Test</span>
        </div>
        <div className='sticky top-0 z-10 flex w-full items-center gap-2 bg-wire-500 p-2'>
          <span className='font-bold'>Messages</span>
        </div>
        {tabs?.length ? (
          tabs
        ) : loading ? (
          <p className='text-center italic'>Loading...</p>
        ) : (
          <p className='text-center italic'>No DMs yet!</p>
        )}
      </div>
    </>
  );
}

export default Rooms;
