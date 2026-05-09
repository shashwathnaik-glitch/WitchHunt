import React, { useState } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Droplet, Plus, X, HeartPulse, Apple, PieChart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';

const MOCK_NUTRITION_DATA = [
  { day: 'Mon', calories: 1800, protein: 70 },
  { day: 'Tue', calories: 1950, protein: 85 },
  { day: 'Wed', calories: 1700, protein: 65 },
  { day: 'Thu', calories: 2100, protein: 90 },
  { day: 'Fri', calories: 2000, protein: 80 },
  { day: 'Sat', calories: 2200, protein: 75 },
  { day: 'Sun', calories: 1900, protein: 85 },
];

const MACRO_GOALS = { calories: 2000, protein: 80, carbs: 220, fats: 60 };

const MOCK_FOOD_DB = {
  'apple': { calories: 95, protein: 0, carbs: 25, fats: 0, iron: 1, folate: 1 },
  'spinach salad': { calories: 120, protein: 4, carbs: 8, fats: 7, iron: 15, folate: 40 },
  'chicken breast': { calories: 165, protein: 31, carbs: 0, fats: 3, iron: 5, folate: 2 },
  'salmon': { calories: 206, protein: 22, carbs: 0, fats: 12, iron: 4, folate: 8 },
  'lentil soup': { calories: 180, protein: 10, carbs: 30, fats: 2, iron: 20, folate: 45 },
};

const NutritionLog = () => {
  const { t } = useLanguage();
  
  // States
  const [waterCups, setWaterCups] = useState(3);
  const [meals, setMeals] = useState({ breakfast: [], lunch: [], dinner: [], snacks: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMealType, setCurrentMealType] = useState('breakfast');
  const [foodQuery, setFoodQuery] = useState('');
  const [foodEntry, setFoodEntry] = useState(null);

  // Calculate current totals
  const allFoods = [...meals.breakfast, ...meals.lunch, ...meals.dinner, ...meals.snacks];
  const totals = allFoods.reduce((acc, food) => ({
    calories: acc.calories + food.calories,
    protein: acc.protein + food.protein,
    carbs: acc.carbs + food.carbs,
    fats: acc.fats + food.fats,
    iron: acc.iron + (food.iron || 0),
    folate: acc.folate + (food.folate || 0)
  }), { calories: 0, protein: 0, carbs: 0, fats: 0, iron: 0, folate: 0 });

  // Handle water click
  const handleWaterClick = (index) => {
    if (index === waterCups) setWaterCups(prev => Math.min(8, prev + 1));
    else if (index < waterCups) setWaterCups(index + 1);
  };

  // Mock Food Search
  const handleFoodSearch = (query) => {
    setFoodQuery(query);
    const lowercaseQuery = query.toLowerCase();
    const found = Object.keys(MOCK_FOOD_DB).find(k => k.includes(lowercaseQuery));
    if (found && query.length > 2) {
      setFoodEntry({ name: found, ...MOCK_FOOD_DB[found] });
    } else if (query.length > 2) {
      // Generate generic if not found
      setFoodEntry({ name: query, calories: 150, protein: 5, carbs: 20, fats: 5, iron: 2, folate: 5 });
    } else {
      setFoodEntry(null);
    }
  };

  const handleSaveFood = (e) => {
    e.preventDefault();
    if (!foodEntry) return;
    
    setMeals(prev => ({
      ...prev,
      [currentMealType]: [...prev[currentMealType], { id: Date.now(), ...foodEntry }]
    }));
    
    setIsModalOpen(false);
    setFoodQuery('');
    setFoodEntry(null);
  };

  const openModal = (mealType) => {
    setCurrentMealType(mealType);
    setIsModalOpen(true);
  };

  // UI Helpers
  const getProgressColor = (current, goal, isReversed = false) => {
    const ratio = current / goal;
    if (isReversed) { // For things like Sugar where less is better (not used yet but good to have)
      if (ratio > 1.1) return 'bg-red-500';
      if (ratio > 0.9) return 'bg-yellow-500';
      return 'bg-green-500';
    }
    // Normal macros
    if (ratio < 0.5) return 'bg-yellow-400';
    if (ratio >= 0.9 && ratio <= 1.1) return 'bg-green-500';
    if (ratio > 1.1) return 'bg-red-500';
    return 'bg-blue-500'; // on track but not near goal yet
  };

  const renderMacroBar = (label, current, goal, unit = 'g') => (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-medium">
        <span className="text-gray-700">{label}</span>
        <span className="text-gray-500">{current}{unit} / {goal}{unit}</span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${getProgressColor(current, goal)}`}
          style={{ width: `${Math.min((current / goal) * 100, 100)}%` }}
        />
      </div>
    </div>
  );

  return (
    <PageWrapper>
      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 pb-24">
        
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{t('nav.nutrition')}</h1>
            <p className="text-gray-500 mt-1">Fuel your body right.</p>
          </div>
        </div>

        {/* Daily Macros Summary */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-gray-800">Daily Macros</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="col-span-2 md:col-span-1 border-r-0 md:border-r border-gray-100 pr-0 md:pr-4">
              <div className="text-3xl font-bold text-gray-800">{totals.calories}</div>
              <div className="text-xs text-gray-500 mb-2">kcal / {MACRO_GOALS.calories}</div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${getProgressColor(totals.calories, MACRO_GOALS.calories)}`}
                  style={{ width: `${Math.min((totals.calories / MACRO_GOALS.calories) * 100, 100)}%` }}
                />
              </div>
            </div>
            
            <div className="col-span-2 md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
              {renderMacroBar('Protein', totals.protein, MACRO_GOALS.protein)}
              {renderMacroBar('Carbs', totals.carbs, MACRO_GOALS.carbs)}
              {renderMacroBar('Fats', totals.fats, MACRO_GOALS.fats)}
            </div>
          </div>
        </div>

        {/* Women's Health Priority */}
        <div className="bg-gradient-to-r from-rose-50 to-purple-50 rounded-3xl p-6 border border-rose-100 shadow-sm flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
            <HeartPulse className="w-6 h-6 text-rose-500" />
          </div>
          <div className="flex-1 w-full">
            <h3 className="text-sm font-bold text-rose-700 uppercase tracking-wider mb-2">Women's Health Priority</h3>
            <div className="grid grid-cols-2 gap-4">
              {renderMacroBar('Iron (mg)', totals.iron, 18, '')}
              {renderMacroBar('Folate (mcg)', totals.folate, 400, '')}
            </div>
          </div>
        </div>

        {/* Water Tracker */}
        <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
              <Droplet className="w-5 h-5 text-blue-500" /> Water Intake
            </h3>
            <span className="text-sm font-bold text-blue-600">{waterCups} / 8 cups</span>
          </div>
          
          <div className="flex justify-between max-w-lg mx-auto">
            {[...Array(8)].map((_, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 1.15 }}
                onClick={() => handleWaterClick(i)}
                className="relative w-8 h-12 md:w-10 md:h-14 rounded-b-xl border-2 border-blue-200 bg-white overflow-hidden flex items-end justify-center min-w-[44px] min-h-[44px]"
              >
                <motion.div
                  initial={false}
                  animate={{ height: i < waterCups ? '100%' : '0%' }}
                  transition={{ type: 'spring', bounce: 0.5 }}
                  className="w-full bg-blue-400 rounded-b-sm"
                />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Meal Logger */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800">Today's Meals</h3>
          
          {Object.entries(meals).map(([mealType, foodList]) => (
            <div key={mealType} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-gray-800 capitalize">{mealType}</h4>
                <button 
                  onClick={() => openModal(mealType)}
                  className="min-h-[44px] px-3 py-1 text-sm bg-purple-50 text-primary font-medium rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Food
                </button>
              </div>
              
              {foodList.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No food logged yet.</p>
              ) : (
                <div className="space-y-3">
                  {foodList.map(food => (
                    <div key={food.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="font-medium text-gray-800 capitalize">{food.name}</p>
                        <p className="text-xs text-gray-500">P: {food.protein}g • C: {food.carbs}g • F: {food.fats}g</p>
                      </div>
                      <span className="font-bold text-gray-700">{food.calories} kcal</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Weekly Chart */}
        <div className="bg-transparent">
          <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Weekly Calorie Trend</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_NUTRITION_DATA} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(109,40,217,0.2)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#7C6FAA', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#7C6FAA', fontSize: 11 }} domain={[1000, 2500]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#160D30', border: '1px solid rgba(109,40,217,0.4)', borderRadius: '12px', color: '#C4B5FD' }}
                  itemStyle={{ color: '#C4B5FD' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="calories" 
                  stroke="#A78BFA" 
                  strokeWidth={2.5} 
                  dot={{ fill: '#A78BFA', r: 4 }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Add Food Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold text-gray-800 text-lg capitalize">Add to {currentMealType}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveFood} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search Food</label>
                <div className="relative">
                  <Apple className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none min-h-[44px]"
                    value={foodQuery}
                    onChange={(e) => handleFoodSearch(e.target.value)}
                    placeholder="e.g. Apple, Salmon, Spinach..."
                  />
                </div>
              </div>

              {foodEntry && (
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <p className="text-sm font-bold text-primary mb-2 capitalize">{foodEntry.name} (1 serving)</p>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="bg-white rounded p-1 shadow-sm"><span className="block font-bold">{foodEntry.calories}</span>kcal</div>
                    <div className="bg-white rounded p-1 shadow-sm"><span className="block font-bold">{foodEntry.protein}g</span>Prot</div>
                    <div className="bg-white rounded p-1 shadow-sm"><span className="block font-bold">{foodEntry.carbs}g</span>Carb</div>
                    <div className="bg-white rounded p-1 shadow-sm"><span className="block font-bold">{foodEntry.fats}g</span>Fat</div>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={!foodEntry}
                  className="w-full min-h-[44px] bg-primary text-white rounded-xl font-medium hover:bg-purple-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Save Food
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default NutritionLog;
