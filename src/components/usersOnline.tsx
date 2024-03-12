import useWebsocket from 'react-use-websocket';
import { IUser } from '../types/fetchTypes';
import { useState } from 'react';

function UsersOnline() {
  const [usersOnline, setusersOnline] = useState<IUser[]>([]);

  useWebsocket('ws://localhost:3000/echo', {
    share: true, // Shares ws connection to same URL between components
    // onOpen: (e) => {},
    onClose: (e) => console.log('usersOnline websocket closed: ' + e.reason),
    onMessage: (e) => {
      // console.log('usersOnline websocket message recieved');
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'usersOnline') {
          const { users } = data;
          if (users) {
            setusersOnline(users);
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
        const data = JSON.parse(e.data);
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
      ? usersOnline.map((user) => (
          <div>
            <img src={`${user.avatar}.jpg`}></img>
            <span className=''>{user.username}</span>
          </div>
        ))
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
