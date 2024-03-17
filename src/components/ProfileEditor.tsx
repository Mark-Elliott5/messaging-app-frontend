import { useState } from 'react';
import { IResponseUser } from '../types/wsMessageTypes';
import TextareaAutosize from 'react-textarea-autosize';

function ProfileEditor({
  user,
  handleSendMessage,
  setEditorVisible,
}: {
  user: IResponseUser | undefined;
  handleSendMessage: (avatar: number, bio: string) => void;
  setEditorVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [avatarField, setAvatarField] = useState<number>(user!.avatar);
  const [bioField, setBioField] = useState<string>(user!.bio);
  return (
    <div
      className='fixed left-0 top-0 z-20 h-dvh w-dvw'
      onClick={() => setEditorVisible(false)}
    >
      <div
        className='fixed left-1/2 top-1/2 flex h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 transform flex-col gap-4 overflow-y-scroll rounded-md bg-wire-600 p-4 shadow-lg'
        onClick={(e) => e.stopPropagation()}
      >
        <span className='text-2xl'>Profile Editor</span>
        <div>
          <img
            className='mr-4 inline-block cursor-pointer'
            src={`${user && user.avatar}.png`}
          />
          <span className='text-xl'>{user && user.username}</span>
        </div>
        <div>
          <p>Select an avatar</p>
          <div className='grid grid-cols-4 gap-2'>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((num) => (
              <img
                src={`${num}.png`}
                className={`p-2 ${user && user.avatar === num ? 'border-1 border-wire-300' : avatarField === num ? 'border-1 border-green-500' : ''} hover:bg-wire-300`}
                onClick={() => setAvatarField(num)}
              />
            ))}
          </div>
          <p>Bio</p>
          <TextareaAutosize
            minRows={3}
            maxRows={6}
            name='content'
            id='messsage-content'
            placeholder='Enter a bio'
            onChange={(e) => setBioField(e.currentTarget.value)}
            minLength={1}
            maxLength={900}
            cacheMeasurements={true}
            className='w-full flex-1 resize-none rounded-md bg-wire-400 p-2 placeholder-wire-50 outline-none placeholder:italic'
          >
            {user?.bio}
          </TextareaAutosize>
          <button
            className='w-full rounded-sm bg-wire-300 p-2'
            onClick={() => handleSendMessage(avatarField, bioField)}
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileEditor;
