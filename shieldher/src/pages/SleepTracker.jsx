import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import Modal from '../components/ui/Modal';
import { loadData, saveData } from '../utils/storageUtils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Moon, Sun, Clock, ChevronLeft, ChevronRight, X, AlertTriangle, TrendingUp, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_SLEEP_DATA = [
  { day: 'Mon', hours: 6.5, score: 65, quality: 'Fair' },
  { day: 'Tue', hours: 7.2, score: 80, quality: 'Good' },
  { day: 'Wed', hours: 5.5, score: 45, quality: 'Poor' },
  { day: 'Thu', hours: 8.1, score: 95, quality: 'Good' },
  { day: 'Fri', hours: 7.5, score: 85, quality: 'Good' },
  { day: 'Sat', hours: 9.0, score: 90, quality: 'Good' },
  { day: 'Sun', hours: 6.0, score: 55, quality: 'Fair' },
];

const HYGIENE_TIPS = [
  "Keep your room cool. The ideal temperature for sleep is around 65°F (18°C).",
  "Limit screen time 1 hour before bed to reduce blue light exposure.",
  "Avoid heavy meals, caffeine, and alcohol close to bedtime.",
  "Try a 10-minute deep breathing or meditation routine before sleeping.",
  "Maintain a consistent sleep schedule, even on weekends."
];

const SleepTracker = () => {
  const { t } = useLanguage();
  const [sleepLogs, setSleepLogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bedtime, setBedtime] = useState('22:00');
  const [wakeTime, setWakeTime] = useState('06:00');
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const saved = loadData('sleep_logs');
    if (saved && saved.length > 0) {
      setSleepLogs(saved);
    } else {
      setSleepLogs(MOCK_SLEEP_DATA);
      saveData('sleep_logs', MOCK_SLEEP_DATA);
    }
  }, []);

  const calculateDuration = (bed, wake) => {
    const [bHours, bMins] = bed.split(':').map(Number);
    const [wHours, wMins] = wake.split(':').map(Number);
    
    let durationHours = wHours - bHours;
    let durationMins = wMins - bMins;
    
    if (durationMins < 0) {
      durationHours -= 1;
      durationMins += 60;
    }
    
    if (durationHours < 0) {
      durationHours += 24;
    }
    
    return durationHours + (durationMins / 60);
  };

  const getScoreInfo = (hours) => {
    if (hours >= 7 && hours <= 9) return { score: 90, quality: 'Good', emoji: '😊', color: '#10B981' };
    if (hours >= 6 && hours < 7) return { score: 70, quality: 'Fair', emoji: '😐', color: '#F59E0B' };
    if (hours >= 9 && hours <= 10) return { score: 75, quality: 'Fair', emoji: '😐', color: '#F59E0B' };
    return { score: 45, quality: 'Poor', emoji: '😴', color: '#EF4444' };
  };

  const handleSaveSleep = (e) => {
    e.preventDefault();
    const duration = calculateDuration(bedtime, wakeTime);
    const { score, quality } = getScoreInfo(duration);
    
    const newLog = {
      id: Date.now(),
      day: new Date().toLocaleDateString('en-US', { weekday: 'short' }),
      hours: Number(duration.toFixed(1)),
      score,
      quality,
      bedtime,
      wakeTime
    };

    // Update chart data (shift array)
    const newLogs = [...sleepLogs.slice(1), newLog];
    setSleepLogs(newLogs);
    saveData('sleep_logs', newLogs);
    setIsModalOpen(false);
  };

  const nextTip = () => setCurrentTip((prev) => (prev + 1) % HYGIENE_TIPS.length);
  const prevTip = () => setCurrentTip((prev) => (prev - 1 + HYGIENE_TIPS.length) % HYGIENE_TIPS.length);

  const getBarColor = (quality) => {
    if (quality === 'Good') return '#10B981'; // green
    if (quality === 'Fair') return '#F59E0B'; // yellow
    return '#EF4444'; // red
  };

  // Insights logic
  const todayLog = sleepLogs[sleepLogs.length - 1] || MOCK_SLEEP_DATA[6];
  const avgHours = (sleepLogs.reduce((acc, log) => acc + log.hours, 0) / sleepLogs.length).toFixed(1);
  const bestDay = [...sleepLogs].sort((a, b) => b.score - a.score)[0];
  const deficit = todayLog.hours < 8 ? ((8 - todayLog.hours) * 60).toFixed(0) : 0;
  const todayInfo = getScoreInfo(todayLog.hours);

  return (
    <PageWrapper>
      <div className="p-4 md:p-8 max-w-4xl lg:max-w-7xl mx-auto space-y-8 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-12 pb-24">
        
        {/* LEFT COLUMN */}
        <div className="space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{t('nav.sleep') || 'Sleep Tracker'}</h1>
              <p className="text-gray-500 mt-1">Optimize your rest and recovery.</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="min-h-[44px] min-w-[44px] px-4 py-2 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm lg:hidden"
            >
              <Moon className="w-5 h-5" />
              <span className="hidden md:inline">{t('btn.logSleep') || 'Log Sleep'}</span>
            </button>
          </div>

          {/* Top Section: Score & Deficit */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Score Card */}
            <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden flex items-center justify-between">
              <div className="relative z-10">
                <h3 className="text-indigo-200 font-medium tracking-wide uppercase text-sm mb-2">Last Night's Sleep</h3>
                <div className="flex items-end gap-4">
                  <span className="text-5xl md:text-6xl font-bold">{todayLog.score}</span>
                  <span className="text-xl md:text-2xl text-indigo-100 mb-2">/ 100</span>
                </div>
                <div className="flex items-center gap-2 mt-4 text-lg">
                  <span className="text-2xl">{todayInfo.emoji}</span>
                  <span className="font-semibold">{todayInfo.quality}</span>
                  <span className="text-indigo-300 ml-2">({todayLog.hours} hrs)</span>
                </div>
              </div>
              <Moon className="w-32 h-32 text-white opacity-10 absolute -right-6 -bottom-6" />
            </div>

            {/* Warning / Context Card */}
            {deficit > 0 ? (
              <div className="bg-red-50 rounded-3xl p-6 border border-red-100 shadow-sm flex flex-col justify-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-500">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-red-800 font-bold mb-1">Sleep Deficit</h3>
                <p className="text-red-600 text-sm">You slept <strong>{deficit} minutes less</strong> than the recommended 8 hours. Try to get to bed earlier tonight!</p>
              </div>
            ) : (
              <div className="bg-green-50 rounded-3xl p-6 border border-green-100 shadow-sm flex flex-col justify-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-500">
                  <Star className="w-6 h-6" />
                </div>
                <h3 className="text-green-800 font-bold mb-1">Well Rested!</h3>
                <p className="text-green-600 text-sm">You met your 8-hour sleep goal. Keep up the fantastic routine.</p>
              </div>
            )}
          </div>

          {/* Insights & Chart */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Weekly Average</p>
                  <p className="text-xl font-bold text-gray-800">{avgHours} hrs</p>
                </div>
              </div>
              
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-500">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Best Day ({bestDay.day})</p>
                  <p className="text-xl font-bold text-gray-800">{bestDay.hours} hrs</p>
                </div>
              </div>
            </div>

            <div className="bg-transparent">
              <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>7-Day History</h3>
              <div className="h-48 lg:h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sleepLogs} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7C3AED" />
                        <stop offset="100%" stopColor="#EC4899" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(109,40,217,0.2)" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#7C6FAA', fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#7C6FAA', fontSize: 11 }} domain={[0, 10]} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(109,40,217,0.1)' }}
                      contentStyle={{ backgroundColor: '#160D30', border: '1px solid rgba(109,40,217,0.4)', borderRadius: '12px', color: '#C4B5FD' }}
                      itemStyle={{ color: '#C4B5FD' }}
                    />
                    <Bar 
                      dataKey="hours" 
                      radius={[6, 6, 0, 0]} 
                      barSize={24}
                      fill="url(#sleepGradient)"
                      activeBar={{ fill: '#A78BFA' }}
                    >
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8 lg:mt-0 mt-8">
          <div className="hidden lg:flex justify-end">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="min-h-[44px] px-6 py-2 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Moon className="w-5 h-5" />
              <span>{t('btn.logSleep') || 'Log Sleep'}</span>
            </button>
          </div>

          {/* Sleep Hygiene Tips Carousel */}
          <div className="bg-indigo-50 rounded-3xl p-6 border border-indigo-100 shadow-sm relative overflow-hidden">
            <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center gap-2">
              <Moon className="w-5 h-5 text-indigo-500" /> Sleep Hygiene Tips
            </h3>
            <div className="flex items-center justify-between min-h-[80px]">
              <button onClick={prevTip} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-indigo-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-full transition-colors z-10">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="flex-1 text-center px-4 relative h-full flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentTip}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="text-indigo-800 font-medium absolute w-full"
                  >
                    {HYGIENE_TIPS[currentTip]}
                  </motion.p>
                </AnimatePresence>
              </div>
              <button onClick={nextTip} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-indigo-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-full transition-colors z-10">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            <div className="flex justify-center gap-1 mt-4">
              {HYGIENE_TIPS.map((_, i) => (
                <span key={i} className={`w-2 h-2 rounded-full ${i === currentTip ? 'bg-indigo-500' : 'bg-indigo-200'}`} />
              ))}
            </div>
          </div>

          {/* Recent Sleep Logs */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Recent Sleep Logs</h3>
            
            {/* Mobile View */}
            <div className="space-y-4 lg:hidden">
              {[...sleepLogs].reverse().slice(0, 5).map((log, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-50 text-indigo-500">
                      <Moon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{log.day}</p>
                      <p className="text-xs text-gray-500">{log.hours} hours</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold" style={{ color: getBarColor(log.quality) }}>{log.score} / 100</span>
                    <p className="text-xs text-gray-500">{log.quality}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View (Table) */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 font-medium">
                  <tr>
                    <th className="px-6 py-4">Day</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">Quality</th>
                    <th className="px-6 py-4 text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[...sleepLogs].reverse().slice(0, 5).map((log, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-50 text-indigo-500">
                          <Moon className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-gray-800">{log.day}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{log.hours} hours</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-md text-xs font-medium" style={{ backgroundColor: `${getBarColor(log.quality)}20`, color: getBarColor(log.quality) }}>
                          {log.quality}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-700">{log.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* Log Sleep Modal */}
      {/* Log Sleep Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Your Sleep">
        <form onSubmit={handleSaveSleep} className="space-y-6">
          <div className="flex items-center gap-4 bg-indigo-900/30 p-4 rounded-2xl border border-indigo-500/30">
            <motion.div 
              animate={{ rotate: [0, -10, 10, 0] }} 
              transition={{ repeat: Infinity, duration: 4 }}
              className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center text-indigo-400 shadow-inner"
            >
              <Moon className="w-6 h-6" />
            </motion.div>
            <div className="flex-1">
              <label className="block text-sm font-bold text-indigo-200 mb-1">Bedtime</label>
              <input 
                type="time" 
                required
                className="w-full bg-black/30 border border-indigo-500/30 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none min-h-[44px] font-medium"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 bg-orange-900/30 p-4 rounded-2xl border border-orange-500/30">
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center text-orange-400 shadow-inner"
            >
              <Sun className="w-6 h-6" />
            </motion.div>
            <div className="flex-1">
              <label className="block text-sm font-bold text-orange-200 mb-1">Wake Time</label>
              <input 
                type="time" 
                required
                className="w-full bg-black/30 border border-orange-500/30 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-orange-500 outline-none min-h-[44px] font-medium"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" className="w-full min-h-[44px] bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md">
              Calculate & Save Sleep
            </button>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  );
};

export default SleepTracker;
