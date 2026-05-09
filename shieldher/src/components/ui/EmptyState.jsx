import React from 'react';
import { motion } from 'framer-motion';

const EmptyState = ({ emoji, title, subtitle, ctaText, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center h-64 border border-dashed rounded-3xl" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'transparent' }}>
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', bounce: 0.5 }}
        className="text-6xl mb-4"
      >
        {emoji}
      </motion.div>
      <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{title || 'Nothing here yet'}</h3>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>{subtitle || 'Start tracking to see your insights'}</p>
      {onAction && ctaText && (
        <button 
          onClick={onAction}
          className="btn-primary"
        >
          {ctaText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
