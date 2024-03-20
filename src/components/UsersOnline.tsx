import useWebsocket from 'react-use-websocket';
import { useState } from 'react';
import User from './User';
import { IResponseUser, MessageResponse } from '../types/wsMessageTypes';
import { ICreateDMRoom, ILogout } from '../types/wsActionTypes';
import LogoutButton from './LogoutButton';
import { AnimatePresence, LazyMotion, domAnimation } from 'framer-motion';

function UsersOnline({
  setLoggedIn,
  room,
}: {
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  room: string;
}) {
  const [usersOnline, setUsersOnline] = useState<IResponseUser[]>([]);
  const [roomUsers, setRoomUsers] = useState<IResponseUser[]>([]);

  const { sendMessage } = useWebsocket(`ws://${window.location.host}/chat`, {
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
        if (data.type === 'loggedOut') {
          setLoggedIn(false);
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
        if (
          data.type === 'usersOnline' ||
          data.type === 'roomUsers' ||
          data.type === 'loggedOut'
        ) {
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
    const dataMessage: ICreateDMRoom = {
      action: 'createDMRoom',
      receiver,
    };
    const jsonString = JSON.stringify(dataMessage);
    sendMessage(jsonString);
  };

  const users = (() => {
    return usersOnline.length
      ? Array.from(usersOnline).map((user) => (
          <User key={user.username} user={user} handleClick={handleDMClick} />
        ))
      : null;
  })();

  const roomers = (() => {
    return usersOnline.length
      ? Array.from(roomUsers).map((user) => (
          <User key={user.username} user={user} handleClick={handleDMClick} />
        ))
      : null;
  })();

  const handleLogout = () => {
    const logoutMessage: ILogout = {
      action: 'logout',
    };
    const jsonString = JSON.stringify(logoutMessage);
    sendMessage(jsonString);
  };

  return (
    <div
      id='users'
      className='flex flex-col items-center justify-between bg-wire-600'
    >
      <div className='w-full'>
        <p className='bg-wire-400 py-2 pl-4 pr-2 font-bold'>Users Online</p>
        <AnimatePresence>
          <LazyMotion features={domAnimation}>
            {users?.length ? (
              users
            ) : (
              <p className='m-4 text-center italic'>Nobody is online!</p>
            )}
            <p className='bg-wire-400 py-2 pl-4 pr-2 font-bold'>
              Users in {room}
            </p>
            {roomers?.length ? (
              roomers
            ) : (
              <p className='m-4 text-center italic'>Nobody is in this room!</p>
            )}
          </LazyMotion>
        </AnimatePresence>
      </div>
      <LogoutButton handleLogout={handleLogout} />
    </div>
  );
}

export default UsersOnline;
