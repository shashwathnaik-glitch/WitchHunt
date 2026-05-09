import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const BreathingWidget = () => {
  const { t } = useLanguage();
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('Inhale');

  useEffect(() => {
    if (!isActive) {
      setPhase('Ready');
      return;
    }
    
    // Initial phase setup
    if (phase === 'Ready') setPhase('Inhale');

    const intervals = {
      'Inhale': 4000,
      'Hold': 4000,
      'Exhale': 6000,
      'Ready': 100
    };

    const timer = setTimeout(() => {
      if (isActive) {
        setPhase(p => p === 'Inhale' ? 'Hold' : p === 'Hold' ? 'Exhale' : 'Inhale');
      }
    }, intervals[phase] || 4000);

    return () => clearTimeout(timer);
  }, [isActive, phase]);

  const variants = {
    Ready: { scale: 1 },
    Inhale: { scale: 2, transition: { duration: 4, ease: "easeInOut" } },
    Hold: { scale: 2, transition: { duration: 4, ease: "linear" } },
    Exhale: { scale: 1, transition: { duration: 6, ease: "easeInOut" } }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-purple-50 flex flex-col items-center justify-center space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 text-center">Guided Breathing</h3>
      <div className="relative w-48 h-48 flex items-center justify-center">
        <motion.div
          animate={isActive ? phase : "Ready"}
          variants={variants}
          className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center absolute opacity-50"
        ></motion.div>
        <motion.div
          animate={isActive ? phase : "Ready"}
          variants={variants}
          className="w-12 h-12 bg-primary rounded-full absolute"
        ></motion.div>
        <span className="relative z-10 text-white font-medium text-sm tracking-wide">
          {isActive ? phase : ''}
        </span>
      </div>
      <button 
        onClick={() => setIsActive(!isActive)}
        className={`min-h-[44px] min-w-[120px] px-8 py-3 rounded-full font-medium transition-colors ${isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-primary text-white hover:bg-purple-800'}`}
      >
        {isActive ? t('btn.stopExercise') : t('btn.begin')}
      </button>
    </div>
  );
};

export default BreathingWidget;
