import useWebsocket from 'react-use-websocket';
import { useState } from 'react';
import User from './User';
import { IResponseUser, MessageResponse } from '../types/wsMessageTypes';
import { ICreateDMRoom } from '../types/wsActionTypes';

function UsersOnline({ room }: { room: string }) {
  const [usersOnline, setUsersOnline] = useState<IResponseUser[]>([]);
  const [roomUsers, setRoomUsers] = useState<IResponseUser[]>([]);

  const { sendMessage } = useWebsocket('ws://localhost:3000/chat', {
    share: true, // Shares ws connection to same URL between components
    onMessage: (e) => {
      // console.log('usersOnline websocket message recieved');
      try {
        const data: MessageResponse = JSON.parse(e.data);
        if (data.type === 'usersOnline') {
          const { usersOnline } = data;
          if (usersOnline) {
            setUsersOnline(usersOnline);
            return;
          }
        }
        if (data.type === 'roomUsers') {
          setRoomUsers(data.roomUsers);
        }
      } catch (err) {
        console.log(err);
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
    reconnectInterval: 3000,
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

  const handleDMClick = (receiver: string) => {
    const data: ICreateDMRoom = {
      action: 'createDMRoom',
      receiver,
    };
    sendMessage(JSON.stringify(data));
  };

  const users = (() => {
    return usersOnline.length
      ? Array.from(usersOnline).map((user) => (
          <User user={user} handleClick={handleDMClick} />
        ))
      : null;
  })();

  const roomers = (() => {
    return usersOnline.length
      ? Array.from(roomUsers).map((user) => (
          <User user={user} handleClick={handleDMClick} />
        ))
      : null;
  })();

  return (
    <div id='users' className='flex flex-col items-center bg-wire-600'>
      <div className='flex w-full items-center gap-2 bg-wire-500 p-2'>
        <span className='font-bold'>Users Online</span>
      </div>
      {users?.length ? users : <p className='italic'>Nobody is online!</p>}
      <div className='flex w-full items-center gap-2 bg-wire-500 p-2'>
        <span className='font-bold'>Users in {room}</span>
      </div>
      {roomers?.length ? (
        roomers
      ) : (
        <p className='italic'>Nobody is in this room!</p>
      )}
    </div>
  );
}

export default UsersOnline;
