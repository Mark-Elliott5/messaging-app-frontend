import { motion } from 'framer-motion';
import { IDMTabMessage } from '../types/wsMessageTypes';
import TabInfo from './TabInfo';

function DMTab({
  tab,
  room,
  handleDMClick,
}: {
  tab: IDMTabMessage & { newMessage: boolean };
  room: string;
  handleDMClick: (newRoom: string, senderName: string) => void;
}) {
  return (
    <motion.div
      layout
      animate={{
        transition: { duration: 0.3, ease: 'easeInOut' },
        opacity: 1,
        y: 0,
      }}
      initial={{ opacity: 0, y: -16 }}
      exit={{ opacity: 0 }}
      className={`flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-wire-400 ${room === tab.room ? 'bg-wire-300' : 'bg-wire-500'} m-3 rounded-md shadow-md`}
      onClick={() => {
        if (room === tab.room) return;
        handleDMClick(tab.room, tab.sender.username);
      }}
    >
      <div className='flex items-center gap-3'>
        <TabInfo username={tab.sender.username} avatar={tab.sender.avatar} />
      </div>
      <span
        className={`en min-h-3 min-w-3 ${tab.newMessage && room !== tab.room && 'border-1 border-green-500 bg-green-400'} rounded-full`}
      />
    </motion.div>
  );
}

export default DMTab;
