import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
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
    const saved = localStorage.getItem('shieldher_activities');
    if (saved) {
      try {
        setActivities(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse activities", e);
      }
    } else {
      // Seed with some mock data if empty
      const initial = [
        { id: 1, type: 'Walking', duration: '30', intensity: 'Low', calories: 150, notes: 'Morning walk in the park', date: new Date().toLocaleDateString() },
        { id: 2, type: 'Yoga', duration: '45', intensity: 'Low', calories: 120, notes: 'Stretching routine', date: new Date().toLocaleDateString() }
      ];
      setActivities(initial);
      localStorage.setItem('shieldher_activities', JSON.stringify(initial));
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
    localStorage.setItem('shieldher_activities', JSON.stringify(updated));
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
      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
        
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{t('nav.activity')}</h1>
            <p className="text-gray-500 mt-1">Track your fitness journey.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="min-h-[44px] min-w-[44px] px-4 py-2 bg-primary text-white font-medium rounded-xl hover:bg-purple-800 transition-colors flex items-center gap-2 shadow-sm"
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
          <div className="h-64 w-full">
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

        {/* Activity Log */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h3>
          <div className="space-y-4">
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
        </div>

      </div>

      {/* Log Activity Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold text-gray-800 text-lg">Log New Activity</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveActivity} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Activity Type</label>
                <select 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none min-h-[44px]"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="Walking">Walking</option>
                  <option value="Running">Running</option>
                  <option value="Cycling">Cycling</option>
                  <option value="Yoga">Yoga</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none min-h-[44px]"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    placeholder="e.g. 30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Intensity</label>
                  <select 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none min-h-[44px]"
                    value={formData.intensity}
                    onChange={(e) => setFormData({...formData, intensity: e.target.value})}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                <textarea 
                  rows="2"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="How did it feel?"
                ></textarea>
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full min-h-[44px] bg-primary text-white rounded-xl font-medium hover:bg-purple-800 transition-colors">
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </PageWrapper>
  );
};

export default ActivityHub;
