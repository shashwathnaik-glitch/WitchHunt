import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import { WifiOff, Moon, Globe, Settings as SettingsIcon } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

const MainLayout = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { isHighContrast, setIsHighContrast } = useTheme();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>
      <Navigation />
      <main className="flex-1 overflow-x-hidden relative transition-all pb-[80px] md:pb-0" id="main-content">
        <div className="md:ml-[64px] lg:ml-[240px] w-full min-h-screen flex flex-col transition-all duration-300">
        {!isOnline && (
          <div className="bg-orange-50 border-b border-orange-100 text-orange-700 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 sticky top-0 z-40 shadow-sm w-full text-center">
            <WifiOff className="w-5 h-5 flex-shrink-0" />
            <span>You're offline — Emergency contacts and safety tips are still available.</span>
          </div>
        )}
        
        {/* Settings Top Bar */}
        <div className="flex justify-end items-center px-4 py-4 md:px-6 lg:px-10 gap-4 sticky top-0 z-30 pointer-events-none w-full max-w-[1100px] mx-auto">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-2 rounded-full shadow-sm pointer-events-auto border border-gray-100">
            <Globe className="w-4 h-4 text-gray-500" />
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer min-h-[44px] min-w-[44px]"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="ta">தமிழ்</option>
            </select>
          </div>
          
          <button 
            onClick={() => navigate('/settings')}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full shadow-sm pointer-events-auto transition-colors border bg-white/80 backdrop-blur-md text-gray-700 border-gray-100 hover:bg-gray-50"
            title="Settings"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="w-full max-w-[1100px] mx-auto min-h-full -mt-16 pt-8 px-4 md:px-6 lg:px-10 relative z-10 flex-1">
          <Outlet />
        </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
