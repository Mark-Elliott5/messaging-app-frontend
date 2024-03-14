import useWebsocket from 'react-use-websocket';
import { useState } from 'react';
import User from './User';
import { IUsersOnline, MessageResponse } from '../types/wsMessageTypes';

function UsersOnline({
  setRoom,
}: {
  setRoom: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [usersOnline, setUsersOnline] = useState<IUsersOnline>([]);

  useWebsocket('ws://localhost:3000/chat', {
    share: true, // Shares ws connection to same URL between components
    // onOpen: (e) => {},
    onClose: (e) => console.log('usersOnline websocket closed: ' + e.reason),
    onMessage: (e) => {
      // console.log('usersOnline websocket message recieved');
      try {
        const data: MessageResponse = JSON.parse(e.data);
        if (data.type === 'usersOnline') {
          const { usersOnline } = data;
          if (usersOnline) {
            setUsersOnline(usersOnline);
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    onError: () => console.log('usersOnline websocket error'),
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
        if (data.type === 'usersOnline') {
          return true;
        }
        return false;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
  });

  const users = (() => {
    return usersOnline.length
      ? usersOnline.map((user) => <User user={user} setRoom={setRoom} />)
      : null;
  })();

  return (
    <div id='users' className='flex flex-col items-center bg-wire-600'>
      <div className='flex w-full items-center gap-2 bg-wire-500 p-2'>
        <span className='font-bold'>Users Online</span>
      </div>
      {users?.length ? users : <p className='italic'>Nobody is online!</p>}
    </div>
  );
}

export default UsersOnline;
