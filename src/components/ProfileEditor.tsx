import { useState } from 'react';
import { IResponseUser } from '../types/wsMessageTypes';
import TextareaAutosize from 'react-textarea-autosize';
import { motion } from 'framer-motion';

function ProfileEditor({
  user,
  handleSendMessage,
  setEditorVisible,
}: {
  user: IResponseUser;
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
      <motion.div
        animate={{
          transition: { duration: 0.2 },
          opacity: 1,
        }}
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        className='fixed left-1/2 top-1/2 flex h-2/3 w-3/4 -translate-x-1/2 -translate-y-1/2 transform flex-col justify-between overflow-y-scroll rounded-md border-1 border-wire-500 bg-wire-700 p-6 shadow-wire md:w-2/3'
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <span className='mb-2 text-2xl'>Profile Editor</span>
          <div className='mb-4 flex items-center gap-4'>
            <img
              className='inline-block h-13 md:h-unset'
              src={`${user.avatar}.png`}
            />
            <span className='text-xl md:text-3xl'>{user.username}</span>
          </div>
          <p>Select an avatar</p>
          <div className='grid grid-cols-4 gap-2'>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((num) => (
              <img
                src={`${num}.png`}
                className={`p-2 ${user.avatar === num ? 'border-1 border-wire-300' : avatarField === num ? 'border-1 border-green-500' : ''} hover:bg-wire-300`}
                onClick={() => setAvatarField(num)}
              />
            ))}
          </div>
        </div>
        <div className='flex flex-grow flex-col gap-2'>
          <p>Bio</p>
          <TextareaAutosize
            maxLength={900}
            minRows={3}
            maxRows={6}
            name='content'
            id='messsage-content'
            placeholder='Enter a bio'
            onChange={(e) => {
              if (e.currentTarget.value.length <= 900) {
                setBioField(e.currentTarget.value);
              }
            }}
            minLength={1}
            cacheMeasurements={true}
            className='w-full flex-1 resize-none rounded-md bg-wire-400 p-2 placeholder-wire-50 outline-none placeholder:italic'
          >
            {user?.bio}
          </TextareaAutosize>
          <button
            className='w-full rounded-md bg-wire-300 p-2'
            onClick={() => handleSendMessage(avatarField, bioField)}
          >
            Update Profile
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default ProfileEditor;
