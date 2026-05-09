import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const Toast = ({ message, type }) => {
  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-rose-400" />;
      case 'info': default: return <Info className="w-5 h-5 text-purple-400" />;
    }
  };

  const getBorder = () => {
    switch (type) {
      case 'success': return 'border-emerald-500/30';
      case 'error': return 'border-rose-500/30';
      case 'info': default: return 'border-purple-500/30';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`flex items-center gap-3 px-4 py-3 bg-[#160D30] border ${getBorder()} rounded-xl shadow-lg pointer-events-auto min-w-[280px] max-w-[400px]`}
      >
        {getIcon()}
        <span className="text-white text-sm font-medium">{message}</span>
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;
