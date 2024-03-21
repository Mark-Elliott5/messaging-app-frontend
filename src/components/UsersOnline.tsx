import useWebSocket from 'react-use-websocket';
import { useState } from 'react';
import User from './User';
import { IResponseUser, MessageResponse } from '../types/wsMessageTypes';
import { ICreateDMRoom, ILogout } from '../types/wsActionTypes';
import LogoutButton from './LogoutButton';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';

function UsersOnline({
  setLoggedIn,
  room,
}: {
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  room: string;
}) {
  const [usersOnline, setUsersOnline] = useState<IResponseUser[]>([]);
  const [roomUsers, setRoomUsers] = useState<IResponseUser[]>([]);

  const { sendMessage } = useWebSocket(`wss://${window.location.host}/chat`, {
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
    return roomUsers.length
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
    <>
      <div className='flex h-full w-full flex-col gap-2 md:gap-4'>
        <LayoutGroup key={'layoutRightColumn'}>
          <motion.div
            layout
            animate={{
              transition: { duration: 0.2, ease: 'easeIn' },
            }}
            className='max-h-dvh-1/2 min-h-12 flex-1 overflow-y-scroll rounded-md border-1 border-wire-300 bg-wire-600 shadow-wire'
          >
            <LayoutGroup key={'layoutUsersOnline'}>
              <motion.p
                key={'onlineTitle'}
                layout
                animate={{
                  transition: { duration: 0.2, ease: 'easeIn' },
                }}
                className='sticky top-0 rounded-t-md bg-wire-400 py-2 pl-4 pr-2 font-bold'
              >
                Users Online
              </motion.p>
              <AnimatePresence mode='popLayout'>
                {users ? (
                  users
                ) : (
                  <motion.p
                    key={'nobodyOnline'}
                    layout
                    animate={{
                      transition: { duration: 0.2, ease: 'easeIn' },
                    }}
                    className='m-4 text-center italic'
                  >
                    Nobody is online!
                  </motion.p>
                )}
              </AnimatePresence>
            </LayoutGroup>
          </motion.div>
          <motion.div
            layout
            animate={{
              transition: { duration: 0.2, ease: 'easeIn' },
            }}
            className='max-h-dvh-1/2 min-h-12 flex-1 overflow-y-scroll rounded-md border-1 border-wire-300 bg-wire-600 shadow-wire'
          >
            <LayoutGroup key={'layoutRoomUsers'}>
              <motion.p
                key={'roomTitle'}
                layout
                animate={{
                  transition: { duration: 0.2, ease: 'easeIn' },
                }}
                className='sticky top-0 rounded-t-md bg-wire-400 py-2 pl-4 pr-2 font-bold'
              >
                Users in {room}
              </motion.p>
              <AnimatePresence mode='popLayout'>
                {roomers ? (
                  roomers
                ) : (
                  <motion.p
                    key={'emptyRoom'}
                    layout
                    animate={{
                      transition: { duration: 0.2, ease: 'easeIn' },
                    }}
                    className='m-4 text-center italic'
                  >
                    Nobody is in this room!
                  </motion.p>
                )}
              </AnimatePresence>
            </LayoutGroup>
          </motion.div>
        </LayoutGroup>
      </div>
      <LogoutButton handleLogout={handleLogout} />
    </>
  );
}

export default UsersOnline;
