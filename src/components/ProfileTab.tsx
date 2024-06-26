import useWebSocket from 'react-use-websocket';
import { IResponseUser, MessageResponse } from '../types/wsMessageTypes';
import { useState } from 'react';
import { IUpdateProfile } from '../types/wsActionTypes';
import ProfileEditor from './ProfileEditor';
import { AnimatePresence } from 'framer-motion';
import TabInfo from './TabInfo';

function ProfileTab() {
  const [user, setUser] = useState<IResponseUser>({
    username: 'Loading...',
    avatar: 0,
    bio: 'Loading...',
  });
  const [editorVisible, setEditorVisible] = useState(false);

  const { sendMessage } = useWebSocket(`wss://${window.location.host}/chat`, {
    share: true, // Shares ws connection to same URL between components
    onMessage: (e) => {
      try {
        const data: MessageResponse = JSON.parse(e.data);
        if (data.type === 'profile') {
          setEditorVisible(false);
          setUser(data.profile);
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
        if (data.type === 'profile') {
          return true;
        }
        return false;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
  });

  const handleSendMessage = (avatar: number, bio: string) => {
    if (avatar > 13) {
      return;
    }
    if (avatar === user?.avatar && bio === user?.bio) {
      return;
    }
    const data: IUpdateProfile = {
      action: 'updateProfile',
      profile: {
        avatar,
        bio,
      },
    };
    sendMessage(JSON.stringify(data));
  };

  return (
    <>
      <div
        id='profile-tab'
        className='flex cursor-pointer items-center justify-between rounded-md border-1 border-wire-300 bg-wire-400 p-2 shadow-wire'
        onClick={() => setEditorVisible(!editorVisible)}
      >
        <div className='flex items-center gap-3'>
          <TabInfo username={user.username} avatar={user.avatar} />
        </div>

        <svg
          xmlns='http://www.w3.org/2000/svg'
          enable-background='new 0 0 24 24'
          height='24px'
          viewBox='0 0 24 24'
          width='24px'
          fill='#FFFFFF'
        >
          <g>
            <path d='M0,0h24v24H0V0z' fill='none' />
            <path d='M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z' />
          </g>
        </svg>
      </div>
      <AnimatePresence>
        {editorVisible && (
          <ProfileEditor
            user={user}
            handleSendMessage={handleSendMessage}
            setEditorVisible={setEditorVisible}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default ProfileTab;
