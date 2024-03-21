import { motion } from 'framer-motion';

function ErrMessage({ err }: { err: string }) {
  return (
    <motion.p
      initial={{ x: -70, opacity: 0 }}
      animate={{
        x: [-70, 0, 0, -70],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 3,
        times: [0, 0.1, 0.9, 1],
        ease: 'easeInOut',
      }}
      exit={{ opacity: 0, x: -70 }}
      style={{
        position: 'relative',
      }}
      className='rounded-md bg-rose-700 px-2 py-1 text-sm text-rose-100 shadow-wire'
      onClick={(e) => e.stopPropagation()}
    >
      🚫 Server error: {err}
    </motion.p>
  );
}

export default ErrMessage;
