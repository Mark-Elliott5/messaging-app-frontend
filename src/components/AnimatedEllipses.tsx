import { LazyMotion, domAnimation, m } from 'framer-motion';

// m with LazyMotion and domAnimation reduces bundle size compared to using motion

function AnimatedEllipses() {
  return (
    <LazyMotion features={domAnimation}>
      <m.span
        animate={{
          y: [0, -2, 0],
          transition: { duration: 0.8, delay: 0, repeat: Infinity },
        }}
        style={{ display: 'inline-block' }}
      >
        .
      </m.span>
      <m.span
        animate={{
          y: [0, -2, 0],
          transition: { duration: 0.8, delay: 0.2, repeat: Infinity },
        }}
        style={{ display: 'inline-block' }}
      >
        .
      </m.span>
      <m.span
        animate={{
          y: [0, -2, 0],
          transition: { duration: 0.8, delay: 0.4, repeat: Infinity },
        }}
        style={{ display: 'inline-block' }}
      >
        .
      </m.span>
    </LazyMotion>
  );
}

export default AnimatedEllipses;