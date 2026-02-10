import React from 'react';
import { motion } from 'framer-motion';

const ThinkingBubble = () => {
  const dotVariants = {
    start: {
      y: 0,
    },
    end: {
      y: -6,
    },
  };

  const dotTransition = {
    duration: 0.5,
    repeat: Infinity,
    repeatType: 'reverse',
    ease: 'easeInOut',
  };

  return (
    <div style={{
      padding: '12px 16px',
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      borderRadius: '24px 24px 24px 4px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      border: '1px solid rgba(0, 98, 255, 0.1)'
    }}>
      <motion.div
        style={{
          width: '8px',
          height: '8px',
          backgroundColor: '#0062ff', // Tech Blue
          borderRadius: '50%',
        }}
        variants={dotVariants}
        initial="start"
        animate="end"
        transition={{ ...dotTransition, delay: 0 }}
      />
      <motion.div
        style={{
          width: '8px',
          height: '8px',
          backgroundColor: '#722ed1', // Tech Purple
          borderRadius: '50%',
        }}
        variants={dotVariants}
        initial="start"
        animate="end"
        transition={{ ...dotTransition, delay: 0.15 }}
      />
      <motion.div
        style={{
          width: '8px',
          height: '8px',
          backgroundColor: '#00b96b', // Tech Green
          borderRadius: '50%',
        }}
        variants={dotVariants}
        initial="start"
        animate="end"
        transition={{ ...dotTransition, delay: 0.3 }}
      />
    </div>
  );
};

export default ThinkingBubble;
