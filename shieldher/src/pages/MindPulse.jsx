import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smile, Meh, Frown, Sparkles, Heart, Zap, Coffee, Cloud, AlertCircle, Phone, Play, X, CheckCircle2, ChevronRight
} from 'lucide-react';
import { loadData, saveData } from '../utils/storageUtils';
import { useToast } from '../context/ToastContext';

const EMOTIONS = [
  { id: 'happy', icon: <Smile className="w-8 h-8" />, label: 'Happy', color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200' },
  { id: 'calm', icon: <Cloud className="w-8 h-8" />, label: 'Calm', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
  { id: 'anxious', icon: <Zap className="w-8 h-8" />, label: 'Anxious', color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200' },
  { id: 'sad', icon: <Frown className="w-8 h-8" />, label: 'Sad', color: 'text-blue-800', bg: 'bg-blue-100', border: 'border-blue-300' },
  { id: 'angry', icon: <AlertCircle className="w-8 h-8" />, label: 'Angry', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
  { id: 'grateful', icon: <Heart className="w-8 h-8" />, label: 'Grateful', color: 'text-pink-500', bg: 'bg-pink-50', border: 'border-pink-200' },
  { id: 'tired', icon: <Coffee className="w-8 h-8" />, label: 'Tired', color: 'text-gray-500', bg: 'bg-gray-100', border: 'border-gray-300' },
  { id: 'hopeful', icon: <Sparkles className="w-8 h-8" />, label: 'Hopeful', color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200' },
];

const INFLUENCING_TAGS = ['Work', 'Health', 'Family', 'Relationships', 'Sleep', 'Other'];

const MEDITATIONS = [
  { id: 1, title: "Morning Calm", duration: 5, color: "from-orange-100 to-amber-50" },
  { id: 2, title: "Stress Relief", duration: 10, color: "from-purple-100 to-indigo-50" },
  { id: 3, title: "Sleep Prep", duration: 15, color: "from-indigo-100 to-blue-50" },
  { id: 4, title: "Anxiety Ease", duration: 7, color: "from-teal-100 to-emerald-50" },
  { id: 5, title: "Body Scan", duration: 12, color: "from-rose-100 to-pink-50" },
  { id: 6, title: "Gratitude", duration: 5, color: "from-yellow-100 to-orange-50" }
];

const MindPulse = () => {
  const { showToast } = useToast();

  // Mood State
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [aiResponse, setAiResponse] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    setHeatmapData(Array.from({ length: 30 }, () => Math.floor(Math.random() * 5)));
  }, []);

  // Meditation State
  const [activeMeditation, setActiveMeditation] = useState(null);
  const [progress, setProgress] = useState(0);

  // Crisis State
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);

  // Meditation Timer Logic
  useEffect(() => {
    let timer;
    if (activeMeditation) {
      const totalSeconds = activeMeditation.duration * 60;
      timer = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(timer);
            return 100;
          }
          return p + (100 / totalSeconds);
        });
      }, 1000);
    } else {
      setProgress(0);
    }
    return () => clearInterval(timer);
  }, [activeMeditation]);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setSelectedTags([]);
    setAiResponse(null);
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleLogMood = () => {
    setIsGenerating(true);
    
    const newLog = {
      id: Date.now(),
      mood: selectedMood.label,
      tags: selectedTags,
      date: new Date().toISOString()
    };
    const existing = loadData('mood_logs', []);
    saveData('mood_logs', [...existing, newLog]);

    setHeatmapData(prev => {
      const newData = [...prev];
      newData[newData.length - 1] = Math.min(newData[newData.length - 1] + 1, 4);
      return newData;
    });

    showToast('Mood logged successfully!', 'success');

    // Simulate AI response generation
    setTimeout(() => {
      let response = "I hear you. Taking time to acknowledge your feelings is a powerful step.";
      if (selectedMood.id === 'anxious' || selectedMood.id === 'sad' || selectedMood.id === 'angry') {
        response = `It's completely okay to feel ${selectedMood.label.toLowerCase()} today, especially with ${selectedTags.length > 0 ? selectedTags[0].toLowerCase() : 'everything'} on your mind. Be gentle with yourself—you don't have to carry it all at once. 💜`;
      } else if (selectedMood.id === 'happy' || selectedMood.id === 'hopeful' || selectedMood.id === 'grateful') {
        response = `That's wonderful! Recognizing when you feel ${selectedMood.label.toLowerCase()} helps build resilience. Let that positive energy fuel your day! ✨`;
      }
      setAiResponse(response);
      setIsGenerating(false);
    }, 1500);
  };

  const openMeditation = (meditation) => {
    setActiveMeditation(meditation);
  };

  const closeMeditation = () => {
    setActiveMeditation(null);
    setProgress(0);
  };

  return (
    <PageWrapper>
      <div className="p-4 md:p-8 max-w-4xl lg:max-w-7xl mx-auto space-y-8 pb-32">
        
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">MindPulse</h1>
          <p className="text-gray-500 mt-1">Nurture your mental well-being.</p>
        </div>

        {/* 1. MOOD TRACKING */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">How are you feeling today?</h3>
          
          {!aiResponse && !isGenerating && (
            <div className="grid grid-cols-4 md:grid-cols-8 gap-4 mb-8">
              {EMOTIONS.map(mood => (
                <button
                  key={mood.id}
                  onClick={() => handleMoodSelect(mood)}
                  className={`flex flex-col items-center gap-2 transition-all p-3 rounded-2xl border-2 ${
                    selectedMood?.id === mood.id 
                      ? `${mood.bg} ${mood.border} scale-105 shadow-sm animate-mood-bounce` 
                      : 'border-transparent hover:bg-gray-50'
                  }`}
                >
                  <div className={`${mood.color}`}>{mood.icon}</div>
                  <span className="text-xs font-semibold text-gray-700">{mood.label}</span>
                </button>
              ))}
            </div>
          )}

          <AnimatePresence>
            {selectedMood && !aiResponse && !isGenerating && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-6 border-t border-gray-100 pt-6"
              >
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-600 mb-4">What's influencing your mood?</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {INFLUENCING_TAGS.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                          selectedTags.includes(tag)
                            ? 'bg-purple-100 text-purple-700 border-purple-200'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center">
                  <button 
                    onClick={handleLogMood}
                    className="min-h-[44px] px-8 py-2 bg-primary text-white font-bold rounded-xl hover:bg-purple-800 transition-colors shadow-sm"
                  >
                    Log Mood
                  </button>
                </div>
              </motion.div>
            )}

            {isGenerating && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-purple-200 border-t-primary rounded-full animate-spin"></div>
              </motion.div>
            )}

            {aiResponse && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-purple-50 rounded-2xl p-6 border border-purple-100 text-center space-y-4"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto text-purple-600 shadow-sm">
                  <Sparkles className="w-6 h-6" />
                </div>
                <p className="text-purple-900 font-medium leading-relaxed max-w-lg mx-auto">
                  "{aiResponse}"
                </p>
                <button 
                  onClick={() => { setSelectedMood(null); setAiResponse(null); }}
                  className="text-sm font-semibold text-purple-600 hover:underline"
                >
                  Log another mood
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2. MOOD HISTORY & PATTERNS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 md:col-span-2">
            <h3 className="text-lg font-bold text-gray-800 mb-4">30-Day Mood History</h3>
            <div className="flex flex-wrap lg:flex-nowrap lg:overflow-x-auto pb-2 hide-scrollbar gap-2">
              {heatmapData.map((intensity, i) => {
                // Color mapping based on intensity
                const colors = ['bg-gray-100', 'bg-purple-200', 'bg-purple-400', 'bg-purple-600', 'bg-purple-800'];
                return (
                  <div key={i} className={`flex-shrink-0 w-6 h-6 lg:w-8 lg:h-8 rounded-md ${colors[intensity]}`} title={`Day ${i+1}`} />
                );
              })}
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs text-gray-500 font-medium">
              <span>Less Intense</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-gray-100" />
                <div className="w-3 h-3 rounded-sm bg-purple-200" />
                <div className="w-3 h-3 rounded-sm bg-purple-400" />
                <div className="w-3 h-3 rounded-sm bg-purple-600" />
                <div className="w-3 h-3 rounded-sm bg-purple-800" />
              </div>
              <span>More Intense</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-6 shadow-sm border border-indigo-100">
            <h3 className="text-lg font-bold text-indigo-900 mb-2">Weekly Pattern</h3>
            <p className="text-indigo-800 font-medium leading-relaxed mb-4">
              You tend to feel most <span className="font-bold">anxious</span> on Mondays.
            </p>
            <p className="text-sm text-indigo-600">Consider scheduling a 5-minute Morning Calm meditation every Monday to start your week centered.</p>
          </div>
        </div>

        {/* 3. MEDITATION CENTER */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Meditation Center</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MEDITATIONS.map(med => (
              <button
                key={med.id}
                onClick={() => openMeditation(med)}
                className={`bg-gradient-to-br ${med.color} rounded-3xl p-6 text-left hover:shadow-md transition-shadow group relative overflow-hidden`}
              >
                <div className="absolute right-[-20px] bottom-[-20px] opacity-10 transform group-hover:scale-110 transition-transform duration-500">
                  <Cloud className="w-32 h-32" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1 relative z-10">{med.title}</h3>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 relative z-10">
                  <Play className="w-4 h-4" /> {med.duration} min
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 4. CRISIS SUPPORT LINK */}
        <div className="text-center pt-8">
          <button 
            onClick={() => setIsCrisisModalOpen(true)}
            className="text-sm font-bold text-gray-500 hover:text-red-600 transition-colors underline decoration-dotted underline-offset-4"
          >
            Need immediate support?
          </button>
        </div>

      </div>

      {/* MEDITATION FULL-SCREEN PLAYER */}
      <AnimatePresence>
        {activeMeditation && (
          <motion.div 
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-6"
          >
            <button 
              onClick={closeMeditation}
              className="absolute top-8 right-8 p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-2">{activeMeditation.title}</h2>
              <p className="text-purple-200 font-medium">{activeMeditation.duration} min session</p>
            </div>

            {/* Breathing Animation: Inhale (4s) -> Hold (4s) -> Exhale (6s) */}
            <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-[300px] lg:h-[300px] mb-16 flex items-center justify-center">
              <div 
                className="absolute inset-0 bg-white/10 rounded-full animate-breathe"
                style={{ animationDuration: '14s' }}
              />
              <div 
                className="absolute inset-4 bg-white/20 rounded-full animate-breathe"
                style={{ animationDuration: '14s', animationDelay: '0.2s' }}
              />
              <div className="relative z-10 text-white font-bold text-xl tracking-widest uppercase opacity-80">
                Breathe
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md space-y-2 mb-12">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-white transition-all duration-1000 ease-linear" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <button 
              onClick={closeMeditation}
              className="px-8 py-3 bg-white text-purple-900 font-bold rounded-full hover:bg-gray-100 transition-colors shadow-lg"
            >
              End Session
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CRISIS SUPPORT MODAL */}
      <AnimatePresence>
        {isCrisisModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 bg-red-50 border-b border-red-100 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-red-900 text-xl flex items-center gap-2 mb-1">
                    <AlertCircle className="w-6 h-6" /> Immediate Support
                  </h3>
                  <p className="text-red-700 text-sm">You are not alone. Help is available right now.</p>
                </div>
                <button onClick={() => setIsCrisisModalOpen(false)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6">
                
                {/* Helplines */}
                <div className="space-y-3">
                  <a href="tel:9152987821" className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl flex items-center justify-between transition-colors border border-gray-200">
                    <div>
                      <h4 className="font-bold text-gray-900">iCall Helpline</h4>
                      <p className="text-sm text-gray-500">Free, confidential counseling</p>
                    </div>
                    <div className="bg-primary text-white p-3 rounded-full">
                      <Phone className="w-5 h-5" />
                    </div>
                  </a>
                  <a href="tel:18602662345" className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl flex items-center justify-between transition-colors border border-gray-200">
                    <div>
                      <h4 className="font-bold text-gray-900">Vandrevala Foundation</h4>
                      <p className="text-sm text-gray-500">24/7 Crisis support</p>
                    </div>
                    <div className="bg-primary text-white p-3 rounded-full">
                      <Phone className="w-5 h-5" />
                    </div>
                  </a>
                </div>

                {/* Grounding Exercise */}
                <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                  <h4 className="font-bold text-blue-900 mb-3">5-4-3-2-1 Grounding Exercise</h4>
                  <p className="text-sm text-blue-800 mb-4">If you're feeling overwhelmed, take a deep breath and look around you to find:</p>
                  <ul className="space-y-2 text-sm text-blue-900 font-medium">
                    <li className="flex items-center gap-2"><span className="text-xl">👀</span> <strong className="text-blue-700">5</strong> things you can see</li>
                    <li className="flex items-center gap-2"><span className="text-xl">🖐️</span> <strong className="text-blue-700">4</strong> things you can touch</li>
                    <li className="flex items-center gap-2"><span className="text-xl">👂</span> <strong className="text-blue-700">3</strong> things you can hear</li>
                    <li className="flex items-center gap-2"><span className="text-xl">👃</span> <strong className="text-blue-700">2</strong> things you can smell</li>
                    <li className="flex items-center gap-2"><span className="text-xl">👅</span> <strong className="text-blue-700">1</strong> thing you can taste</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </PageWrapper>
  );
};

export default MindPulse;
