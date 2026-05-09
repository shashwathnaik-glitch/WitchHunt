import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bell, Activity, Moon, Heart, Flame, ShieldAlert, HeartPulse, Stethoscope, Sparkles, RefreshCw, Play
} from 'lucide-react';
import { generateHealthInsights } from '../utils/aiInsights';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [insights, setInsights] = useState([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(true);
  const [helpfulInsights, setHelpfulInsights] = useState({});

  const fetchInsights = async () => {
    setIsLoadingInsights(true);
    try {
      const data = await generateHealthInsights();
      setTimeout(() => {
        setInsights(data.slice(0, 2)); // Limit to exactly 2 insights
        setIsLoadingInsights(false);
      }, 1500);
    } catch (e) {
      setTimeout(() => {
        setInsights([
          { title: 'Gentle Reminder', text: 'Stay hydrated and take a 10-minute walk today — small steps matter! 💜', icon: '✨', color: 'text-purple-400' }
        ]);
        setIsLoadingInsights(false);
      }, 1500);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const wellnessScore = 82;
  const strokeDasharray = 175.9;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * wellnessScore) / 100;
  
  let scoreColor = '#EF4444'; // Red
  if (wellnessScore > 75) scoreColor = '#34D399'; // Green
  else if (wellnessScore >= 50) scoreColor = '#FBBF24'; // Amber

  const filters = ['All', 'Health', 'Safety', 'Mind', 'Nutrition'];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="p-4 md:p-8 max-w-lg lg:max-w-7xl mx-auto space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-8 pb-24"
    >
      {/* LEFT COLUMN (DESKTOP) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* 1. HEADER ROW */}
        <div className="flex justify-between items-center">
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 600 }}>Good morning 🌸</p>
            <h1 style={{ color: 'white', fontSize: '22px', fontWeight: 700, lineHeight: 1.2 }}>Priya</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="w-6 h-6 text-white" strokeWidth={1.5} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-[#0F0A1A]"></span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">PR</span>
            </div>
          </div>
        </div>

        {/* 2. WELLNESS SCORE CARD */}
        <div 
          className="w-full rounded-[16px] p-5 relative overflow-hidden flex flex-col lg:flex-row justify-between lg:items-center"
          style={{ 
            background: 'linear-gradient(135deg, #1E1040 0%, #2D1060 100%)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div className="flex flex-col w-full lg:w-1/2">
            <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Today's Wellness Score</span>
            <div className="flex flex-col">
              <span style={{ color: 'white', fontSize: '44px', fontWeight: 700, lineHeight: 1 }}>{wellnessScore}</span>
              <div className="w-16 h-1 mt-2 rounded-full" style={{ backgroundColor: scoreColor }}></div>
            </div>
            <span className="mt-4" style={{ color: 'var(--accent-green)', fontSize: '11px', fontWeight: 600 }}>↑ 6 pts from yesterday</span>
          </div>

          <div className="flex items-center gap-4 mt-6 lg:mt-0 w-full lg:w-1/2 lg:justify-end">
            {/* Trend graph sparkline - desktop only */}
            <div className="hidden lg:flex flex-col items-end mr-4">
              <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 500, marginBottom: '8px' }}>7-Day Trend</span>
              <div className="flex items-end gap-1 h-[40px]">
                {[40, 50, 45, 60, 75, 70, 82].map((val, i) => (
                  <div key={i} className="w-2 bg-indigo-500 rounded-t-sm" style={{ height: `${val}%`, opacity: 0.5 + (i * 0.08) }}></div>
                ))}
              </div>
            </div>

            <div className="relative w-[64px] h-[64px] flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle 
                  cx="32" cy="32" r="28" 
                  stroke="#1E1040" strokeWidth="6" fill="transparent" 
                />
                <circle 
                  cx="32" cy="32" r="28" 
                  stroke={scoreColor} strokeWidth="6" fill="transparent" 
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
              </svg>
            </div>
          </div>
        </div>

        {/* 3. FILTER PILLS ROW */}
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                backgroundColor: activeFilter === filter ? 'var(--accent-purple)' : 'var(--bg-card)',
                color: activeFilter === filter ? 'white' : 'var(--text-muted)',
                border: activeFilter === filter ? '1px solid var(--accent-purple)' : '1px solid var(--border-subtle)'
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* 4. TODAY AT A GLANCE (Responsive Grid) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[10px]">
          {/* Steps */}
          {(activeFilter === 'All' || activeFilter === 'Health') && (
          <div className="p-4 flex flex-col justify-between" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: 'rgba(52, 211, 153, 0.15)' }}>
              <Activity className="w-4 h-4 text-[#34D399]" />
            </div>
            <div>
              <span style={{ color: 'white', fontSize: '24px', fontWeight: 700, display: 'block', lineHeight: 1 }}>6,240</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 500 }}>Steps 🏃</span>
            </div>
            <div className="w-full h-1 bg-[#34D399] rounded-full mt-3 opacity-80"></div>
          </div>
          )}

          {/* Sleep */}
          {(activeFilter === 'All' || activeFilter === 'Health' || activeFilter === 'Mind') && (
          <div className="p-4 flex flex-col justify-between" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: 'rgba(124, 58, 237, 0.15)' }}>
              <Moon className="w-4 h-4 text-[#A78BFA]" />
            </div>
            <div>
              <span style={{ color: 'white', fontSize: '24px', fontWeight: 700, display: 'block', lineHeight: 1 }}>6<span className="text-sm">h</span> 30<span className="text-sm">m</span></span>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 500 }}>Sleep 😴</span>
            </div>
            <div className="w-2/3 h-1 bg-[#FBBF24] rounded-full mt-3 opacity-80"></div>
          </div>
          )}

          {/* Mood */}
          {(activeFilter === 'All' || activeFilter === 'Mind') && (
          <div className="p-4 flex flex-col justify-between" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: 'rgba(236, 72, 153, 0.15)' }}>
              <Heart className="w-4 h-4 text-[#F9A8D4]" />
            </div>
            <div>
              <span style={{ color: 'white', fontSize: '24px', fontWeight: 700, display: 'block', lineHeight: 1 }}>Calm</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 500 }}>Mood 🧠</span>
            </div>
            <div className="w-full h-1 bg-[#34D399] rounded-full mt-3 opacity-80"></div>
          </div>
          )}

          {/* Calories */}
          {(activeFilter === 'All' || activeFilter === 'Health' || activeFilter === 'Nutrition') && (
          <div className="p-4 flex flex-col justify-between" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: 'rgba(251, 191, 36, 0.15)' }}>
              <Flame className="w-4 h-4 text-[#FBBF24]" />
            </div>
            <div>
              <span style={{ color: 'white', fontSize: '24px', fontWeight: 700, display: 'block', lineHeight: 1 }}>1,450</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 500 }}>Calories 🥗</span>
            </div>
            <div className="w-3/4 h-1 bg-[#34D399] rounded-full mt-3 opacity-80"></div>
          </div>
          )}
        </div>

        {/* 5. QUICK ACTIONS (Responsive Grid) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[10px]">
          {/* Urgent SOS */}
          {(activeFilter === 'All' || activeFilter === 'Safety') && (
          <button 
            onClick={() => navigate('/safety')}
            className="p-4 flex flex-col justify-center items-center gap-2 relative overflow-hidden" 
            style={{ 
              background: 'linear-gradient(135deg, #7F1D1D 0%, #450A0A 100%)', 
              border: '1px solid #DC2626', 
              borderRadius: '14px' 
            }}
          >
            <div className="absolute inset-0 bg-red-500 opacity-20 animate-pulse"></div>
            <ShieldAlert className="w-8 h-8 text-white relative z-10" />
            <div className="relative z-10 text-center">
              <span className="block text-white font-bold text-sm">SOS</span>
              <span className="block text-red-200 text-[10px] uppercase tracking-wider font-bold">Hold 3 sec</span>
            </div>
          </button>
          )}

          {/* Mood Check */}
          {(activeFilter === 'All' || activeFilter === 'Mind') && (
          <button 
            onClick={() => navigate('/mind')}
            className="p-4 flex flex-col justify-center items-center gap-2 transition-colors hover:bg-opacity-80" 
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px' }}
          >
            <HeartPulse className="w-6 h-6" style={{ color: 'var(--accent-pink)' }} />
            <span style={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>Mood Check</span>
          </button>
          )}

          {/* Symptom Log */}
          {(activeFilter === 'All' || activeFilter === 'Health') && (
          <button 
            onClick={() => navigate('/health')}
            className="p-4 flex flex-col justify-center items-center gap-2 transition-colors hover:bg-opacity-80" 
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px' }}
          >
            <Stethoscope className="w-6 h-6" style={{ color: '#60A5FA' }} />
            <span style={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>Symptom</span>
          </button>
          )}

          {/* Meditate */}
          {(activeFilter === 'All' || activeFilter === 'Mind') && (
          <button 
            onClick={() => navigate('/mind')}
            className="p-4 flex flex-col justify-center items-center gap-2 transition-colors hover:bg-opacity-80" 
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px' }}
          >
            <Play className="w-6 h-6" style={{ color: 'var(--accent-green)' }} />
            <span style={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>Meditate</span>
          </button>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN (DESKTOP) */}
      <div className="lg:col-span-5 space-y-6 mt-6 lg:mt-0">
        {/* 6. AI INSIGHTS SECTION */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 style={{ color: 'white', fontSize: '16px', fontWeight: 700 }}>AI Insights ✨</h2>
            <button 
              onClick={fetchInsights}
              disabled={isLoadingInsights}
              className="p-2 text-purple-400 hover:text-white transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingInsights ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="space-y-3">
            {isLoadingInsights ? (
              [1, 2].map(i => (
                <div key={i} className="h-[72px] skeleton rounded-2xl" style={{ border: '1px solid var(--border-subtle)' }}></div>
              ))
            ) : (
              insights.map((insight, idx) => (
                <div 
                  key={idx} 
                  className="flex flex-col p-4 gap-3"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px' }}
                >
                  <div className="flex items-start gap-4">
                    {/* Left Colored Dot */}
                    <div 
                      className="w-3 h-3 mt-1 rounded-full flex-shrink-0"
                      style={{ backgroundColor: idx === 0 ? 'var(--accent-purple)' : 'var(--accent-pink)' }}
                    ></div>
                    {/* Insight Text */}
                    <p className="flex-1" style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.5, fontWeight: 500 }}>
                      {insight.text}
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <button 
                      onClick={() => setHelpfulInsights(prev => ({ ...prev, [idx]: true }))}
                      className="text-xs font-semibold px-3 py-1 rounded-full transition-colors"
                      style={{
                        backgroundColor: helpfulInsights[idx] ? 'rgba(167, 139, 250, 0.15)' : 'transparent',
                        color: helpfulInsights[idx] ? 'var(--accent-purple-light)' : 'var(--text-muted)',
                        border: '1px solid',
                        borderColor: helpfulInsights[idx] ? 'var(--border-subtle)' : 'transparent'
                      }}
                    >
                      {helpfulInsights[idx] ? 'Thanks! 💜' : 'Helpful? 👍'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 7. UPCOMING REMINDERS SIDEBAR (DESKTOP) */}
        <div className="hidden lg:block">
          <div className="flex justify-between items-center mb-3">
            <h2 style={{ color: 'white', fontSize: '16px', fontWeight: 700 }}>Upcoming Reminders 📅</h2>
          </div>
          <div className="space-y-3">
            {[
              { time: '10:00 AM', title: 'Take medication', type: 'health' },
              { time: '02:30 PM', title: 'Therapy session', type: 'mind' },
              { time: '08:00 PM', title: 'Wind down routine', type: 'sleep' }
            ].map((reminder, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-4"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px' }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    reminder.type === 'health' ? 'bg-blue-400' : 
                    reminder.type === 'mind' ? 'bg-pink-400' : 'bg-purple-400'
                  }`}></div>
                  <span style={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>{reminder.title}</span>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 500 }}>{reminder.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
