import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Activity, ShieldAlert, HeartPulse, Users, Settings } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Navigation = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', name: 'Home', icon: Home },
    { path: '/activity', name: 'Activity', icon: Activity },
    { path: '/safeguard', name: 'Safety', icon: ShieldAlert },
    { path: '/mindpulse', name: 'Mind', icon: HeartPulse },
    { path: '/community', name: 'Community', icon: Users },
  ];

  return (
    <>
      {/* MOBILE BOTTOM TAB BAR (<768px) */}
      <nav 
        className="md:hidden fixed bottom-0 w-full z-50 flex justify-around items-center"
        style={{ 
          background: '#0A0618', 
          borderTop: '1px solid var(--border-subtle)',
          height: '64px',
          paddingBottom: 'env(safe-area-inset-bottom)'
        }}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              relative flex flex-col items-center justify-center w-full h-full transition-colors duration-200
              ${isActive ? 'text-[#A78BFA]' : 'text-[#4C3875]'}
            `}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute top-0 w-8 h-[3px] rounded-b-full bg-[var(--accent-purple)]"></div>
                )}
                <item.icon className="w-[22px] h-[22px] mb-1" strokeWidth={isActive ? 2.5 : 2} />
                <span style={{ fontSize: '10px', fontWeight: isActive ? 600 : 500 }}>{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* TABLET / DESKTOP SIDEBAR (>=768px) */}
      <nav 
        className="hidden md:flex flex-col fixed left-0 top-0 h-screen border-r z-50 transition-all duration-300 w-[64px] lg:w-[240px]"
        style={{ 
          background: '#0A0618',
          borderColor: 'var(--border-subtle)'
        }}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-center lg:justify-start gap-3 p-4 lg:p-6 mb-4 mt-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent-purple)] flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(124,58,237,0.5)]">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-white tracking-wide hidden lg:block">ShieldHer</h1>
        </div>

        {/* Nav Links */}
        <div className="flex flex-col flex-1 px-2 lg:px-3 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                group relative flex items-center justify-center lg:justify-start gap-3 h-[44px] rounded-xl transition-all duration-200 font-medium
                ${isActive 
                  ? 'text-white border-l-[3px] border-[var(--accent-purple)]' 
                  : 'text-[#7C6FAA] hover:text-[#A78BFA] hover:bg-white/5 border-l-[3px] border-transparent'}
              `}
              style={({ isActive }) => ({
                backgroundColor: isActive ? 'rgba(124,58,237,0.12)' : 'transparent',
                paddingLeft: isActive ? 'calc(1rem - 3px)' : '1rem',
                paddingRight: '1rem'
              })}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm hidden lg:block">{item.name}</span>
              
              {/* Tooltip for Tablet (64px) view */}
              <div className="absolute left-14 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all lg:hidden whitespace-nowrap z-50">
                {item.name}
              </div>
            </NavLink>
          ))}
        </div>

        {/* User Profile Bottom Section */}
        <div className="p-2 lg:p-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <div 
            className="flex flex-col lg:flex-row items-center gap-2 lg:gap-3 p-2 hover:bg-white/5 rounded-xl cursor-pointer transition-colors" 
            onClick={() => navigate('/settings')}
          >
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs lg:text-sm">PR</span>
            </div>
            
            {/* Tablet Name under Avatar */}
            <span className="text-[9px] font-bold text-white block lg:hidden uppercase tracking-wider">Priya</span>

            {/* Desktop Details */}
            <div className="flex-1 overflow-hidden hidden lg:block">
              <p className="text-sm font-bold text-white truncate">Priya</p>
              <p className="text-xs text-[#7C6FAA] truncate">v1.0</p>
            </div>
            <Settings className="w-4 h-4 text-[#7C6FAA] hidden lg:block" />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
