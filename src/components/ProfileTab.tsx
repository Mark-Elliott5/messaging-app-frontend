import useWebsocket from 'react-use-websocket';
import { IResponseUser, MessageResponse } from '../types/wsMessageTypes';
import { useState } from 'react';
import { IUpdateProfile } from '../types/wsActionTypes';
import ProfileEditor from './ProfileEditor';

function ProfileTab() {
  const [user, setUser] = useState<IResponseUser | undefined>(undefined);
  const [editorVisible, setEditorVisible] = useState(false);

  const { sendMessage } = useWebsocket('ws://localhost:3000/chat', {
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
      console.log(e);
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
        className='flex cursor-pointer items-center justify-between bg-wire-500 p-2'
        onClick={() => setEditorVisible(!editorVisible)}
      >
        <div className=''>
          <img
            className='mr-2 inline-block h-9 flex-[0_1_0%]'
            src={`${user && user.avatar}.png`}
          ></img>
          <span className=''>{user && user.username}</span>
        </div>
        <button className=''>
          <span className='text-lg'>⚙</span>
        </button>
      </div>
      {editorVisible && (
        <ProfileEditor
          user={user}
          handleSendMessage={handleSendMessage}
          setEditorVisible={setEditorVisible}
        />
      )}
    </>
  );
}

export default ProfileTab;
