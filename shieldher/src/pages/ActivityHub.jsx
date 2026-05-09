import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import Modal from '../components/ui/Modal';
import { loadData, saveData } from '../utils/storageUtils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Flame, Plus, X, Footprints, Bike, Dumbbell } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import { useLanguage } from '../context/LanguageContext';

const MOCK_STEPS_DATA = [
  { day: 'Mon', steps: 6500 },
  { day: 'Tue', steps: 8200 },
  { day: 'Wed', steps: 5400 },
  { day: 'Thu', steps: 9100 },
  { day: 'Fri', steps: 7800 },
  { day: 'Sat', steps: 10500 },
  { day: 'Sun', steps: 4200 },
];

const ActivityHub = () => {
  const { t } = useLanguage();
  const [activities, setActivities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ type: 'Walking', duration: '', intensity: 'Medium', notes: '' });

  useEffect(() => {
    const saved = loadData('activity_logs');
    if (saved && saved.length > 0) {
      setActivities(saved);
    }
  }, []);

  const handleSaveActivity = (e) => {
    e.preventDefault();
    if (!formData.duration) return;

    // Very simple calorie estimation
    const calorieRate = { Walking: 5, Running: 10, Yoga: 3, Cycling: 8 }[formData.type] || 5;
    const calories = Math.round(Number(formData.duration) * calorieRate);

    const newActivity = {
      id: Date.now(),
      ...formData,
      calories,
      date: new Date().toLocaleDateString()
    };

    const updated = [newActivity, ...activities];
    setActivities(updated);
    saveData('activity_logs', updated);
    setIsModalOpen(false);
    setFormData({ type: 'Walking', duration: '', intensity: 'Medium', notes: '' });
  };

  const getActivityIcon = (type) => {
    switch(type) {
      case 'Walking': return <Footprints className="w-6 h-6 text-emerald-500" />;
      case 'Running': return <Activity className="w-6 h-6 text-red-500" />;
      case 'Cycling': return <Bike className="w-6 h-6 text-blue-500" />;
      case 'Yoga': return <Dumbbell className="w-6 h-6 text-purple-500" />;
      default: return <Activity className="w-6 h-6 text-gray-500" />;
    }
  };

  const getIntensityColor = (intensity) => {
    if (intensity === 'Low') return 'bg-green-100 text-green-700';
    if (intensity === 'Medium') return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <PageWrapper>
      <div className="p-4 md:p-8 max-w-4xl lg:max-w-7xl mx-auto space-y-8 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-12">
        
        {/* Left Column: Header, Streak, Chart */}
        <div className="space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{t('nav.activity')}</h1>
              <p className="text-gray-500 mt-1">Track your fitness journey.</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="min-h-[44px] min-w-[44px] px-4 py-2 bg-primary text-white font-medium rounded-xl hover:bg-purple-800 transition-colors flex items-center gap-2 shadow-sm lg:hidden"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden md:inline">{t('btn.logActivity')}</span>
            </button>
          </div>

          {/* Streak Tracker */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-6 text-white flex items-center gap-4 shadow-sm">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm flex-shrink-0">
              <Flame className="w-8 h-8 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold">You've been active for 5 days in a row! 🔥</h2>
              <p className="text-orange-100 text-sm mt-1">Keep up the great work. Consistency is key.</p>
            </div>
          </div>

          {/* Weekly Chart */}
          <div className="bg-transparent">
            <h3 className="text-lg font-semibold text-gray-800 mb-6" style={{ color: 'var(--text-primary)' }}>Weekly Steps Summary</h3>
            <div className="h-64 lg:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_STEPS_DATA} margin={{ top: 5, right: 0, bottom: 5, left: -20 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7C3AED" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(109,40,217,0.2)" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#7C6FAA', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#7C6FAA', fontSize: 11 }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(109,40,217,0.1)' }}
                    contentStyle={{ backgroundColor: '#160D30', border: '1px solid rgba(109,40,217,0.4)', borderRadius: '12px', color: '#C4B5FD' }}
                    itemStyle={{ color: '#C4B5FD' }}
                  />
                  <Bar 
                    dataKey="steps" 
                    fill="url(#barGradient)" 
                    radius={[6, 6, 0, 0]} 
                    barSize={32} 
                    activeBar={{ fill: '#A78BFA' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Activity Log */}
        <div className="space-y-6">
          <div className="hidden lg:flex justify-end">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="min-h-[44px] px-6 py-2 bg-primary text-white font-medium rounded-xl hover:bg-purple-800 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-5 h-5" />
              <span>{t('btn.logActivity')}</span>
            </button>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h3>
            
            {/* Mobile View (Cards) */}
            <div className="space-y-4 lg:hidden">
              {activities.length === 0 ? (
                <EmptyState 
                  emoji="🏃" 
                  title="Nothing here yet" 
                  subtitle="Start tracking to see your insights" 
                  ctaText="Log First Activity" 
                  onAction={() => setIsModalOpen(true)} 
                />
              ) : (
                activities.map(activity => (
                  <div key={activity.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gray-50`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">{activity.type}</h4>
                        <p className="text-xs text-gray-500">{activity.date} • {activity.notes || 'No notes'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 md:justify-end text-sm font-medium">
                      <div className="bg-gray-50 px-3 py-1 rounded-lg text-gray-700">{activity.duration} min</div>
                      <div className="bg-orange-50 px-3 py-1 rounded-lg text-orange-600">{activity.calories} kcal</div>
                      <div className={`px-3 py-1 rounded-lg ${getIntensityColor(activity.intensity)}`}>{activity.intensity}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop View (Table) */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 font-medium">
                  <tr>
                    <th className="px-6 py-4">Activity</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">Calories</th>
                    <th className="px-6 py-4">Intensity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {activities.map(activity => (
                    <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gray-50`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{activity.type}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[150px]" title={activity.notes}>{activity.notes || 'No notes'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{activity.date}</td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-50 px-3 py-1 rounded-lg text-gray-700">{activity.duration} min</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-lg">{activity.calories} kcal</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg ${getIntensityColor(activity.intensity)}`}>{activity.intensity}</span>
                      </td>
                    </tr>
                  ))}
                  {activities.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                        <EmptyState 
                          emoji="🏃" 
                          title="Nothing here yet" 
                          subtitle="Start tracking to see your insights" 
                          ctaText="Log First Activity" 
                          onAction={() => setIsModalOpen(true)} 
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Log Activity Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log New Activity">
        <form onSubmit={handleSaveActivity} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Activity Type</label>
            <select 
              className="w-full bg-black/30 border border-purple-500/30 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none min-h-[44px]"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option value="Walking" className="bg-[#160D30]">Walking</option>
              <option value="Running" className="bg-[#160D30]">Running</option>
              <option value="Cycling" className="bg-[#160D30]">Cycling</option>
              <option value="Yoga" className="bg-[#160D30]">Yoga</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Duration (min)</label>
              <input 
                type="number" 
                required
                min="1"
                className="w-full bg-black/30 border border-purple-500/30 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none min-h-[44px]"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                placeholder="e.g. 30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Intensity</label>
              <select 
                className="w-full bg-black/30 border border-purple-500/30 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none min-h-[44px]"
                value={formData.intensity}
                onChange={(e) => setFormData({...formData, intensity: e.target.value})}
              >
                <option value="Low" className="bg-[#160D30]">Low</option>
                <option value="Medium" className="bg-[#160D30]">Medium</option>
                <option value="High" className="bg-[#160D30]">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Notes (Optional)</label>
            <textarea 
              rows="2"
              className="w-full bg-black/30 border border-purple-500/30 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="How did it feel?"
            ></textarea>
          </div>

          <div className="pt-2">
            <button type="submit" className="w-full min-h-[44px] bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors">
              Save Activity
            </button>
          </div>
        </form>
      </Modal>

    </PageWrapper>
  );
};

export default ActivityHub;
