import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const SOSButton = ({ onTrigger }) => {
  const { t } = useLanguage();
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const animationRef = useRef(null);

  const duration = 3000; // 3 seconds
  
  const startHold = () => {
    setIsHolding(true);
    let startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(currentProgress);
      
      if (currentProgress < 100) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        onTrigger();
        setIsHolding(false);
        setProgress(0);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };

  const cancelHold = () => {
    setIsHolding(false);
    setProgress(0);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  // 140px button -> 70px radius. SVG needs to be slightly larger to wrap it.
  const svgSize = 160;
  const radius = 74; 
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div 
        className="relative flex items-center justify-center"
        style={{ width: svgSize, height: svgSize }}
      >
        {/* Animated Countdown Ring */}
        <svg 
          className="absolute transform -rotate-90 pointer-events-none"
          width={svgSize} 
          height={svgSize}
        >
          {isHolding && (
            <circle
              cx={svgSize / 2}
              cy={svgSize / 2}
              r={radius}
              stroke="rgba(239, 68, 68, 0.2)"
              strokeWidth="6"
              fill="transparent"
            />
          )}
          <motion.circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke="#EF4444"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* SOS Button */}
        <motion.button
          onMouseDown={startHold}
          onMouseUp={cancelHold}
          onMouseLeave={cancelHold}
          onTouchStart={startHold}
          onTouchEnd={cancelHold}
          animate={isHolding ? { scale: 0.95 } : { scale: [1, 1.05, 1] }}
          transition={isHolding ? { duration: 0.1 } : { repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="relative z-10 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.5)] select-none outline-none"
          style={{ 
            width: '140px', 
            height: '140px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #DC2626, #991B1B)',
            border: '2px solid rgba(239, 68, 68, 0.6)',
            touchAction: 'none',
            overflow: 'hidden'
          }}
        >
          <span style={{ color: 'white', fontSize: '22px', fontWeight: 800, letterSpacing: '2px' }}>
            {t('btn.sos') || 'SOS'}
          </span>
        </motion.button>
      </div>
      
      {/* Helper Text below the button */}
      <span className="mt-6 text-[12px] font-medium" style={{ color: 'var(--text-muted)' }}>
        Hold 3 seconds to send alert
      </span>
    </div>
  );
};

export default SOSButton;
