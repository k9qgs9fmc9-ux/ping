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
      background: 'rgba(10, 20, 40, 0.6)',
      backdropFilter: 'blur(10px)',
      borderRadius: '24px 24px 24px 4px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      border: '1px solid rgba(0, 243, 255, 0.3)'
    }}>
      <motion.div
        style={{
          width: '8px',
          height: '8px',
          backgroundColor: '#00f3ff', // Tech primary
          borderRadius: '50%',
          boxShadow: '0 0 5px #00f3ff'
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
          backgroundColor: '#bc13fe', // Tech secondary
          borderRadius: '50%',
          boxShadow: '0 0 5px #bc13fe'
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
          backgroundColor: '#00ff9d', // Tech accent
          borderRadius: '50%',
          boxShadow: '0 0 5px #00ff9d'
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
