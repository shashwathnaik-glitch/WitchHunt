import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const StepRing = ({ steps, goal, size = 160 }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // Animate to target progress
    const target = Math.min((steps / goal) * 100, 100);
    const timeout = setTimeout(() => setProgress(target), 300);
    return () => clearTimeout(timeout);
  }, [steps, goal]);

  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1E1040"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress track */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#A78BFA"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          strokeDasharray={circumference}
        />
      </svg>
      {/* Inner Text */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{steps.toLocaleString()}</span>
        <span className="text-xs font-medium tracking-wide" style={{ color: 'var(--text-muted)' }}>/ {goal.toLocaleString()} steps</span>
      </div>
    </div>
  );
};

export default StepRing;
