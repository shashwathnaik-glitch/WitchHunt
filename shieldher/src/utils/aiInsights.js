// Option A: Mock AI Service for Prototype

export const generateHealthInsights = async () => {
  // Simulate network delay for API call
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 1. Gather Data from LocalStorage
  const getStoredData = (key) => {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
      return [];
    }
  };

  const sleepData = getStoredData('shieldher_sleep');
  const activityData = getStoredData('shieldher_activities');
  
  const todaySleep = sleepData[sleepData.length - 1]?.hours || 7;
  const recentActivities = activityData.length;

  // 2. Simulate Claude AI logic based on user data
  // In a real app, this data would be sent in the prompt to Claude
  
  // Randomizer to simulate dynamic responses on refresh
  const random = Math.random();

  let sleepInsight, activityInsight, mindInsight;

  // Dynamic Sleep Insight
  if (todaySleep < 7) {
    sleepInsight = `I noticed you only got ${todaySleep} hours of sleep last night. Let's aim for an earlier bedtime tonight to help your body recover properly!`;
  } else {
    sleepInsight = `Great job getting ${todaySleep} hours of sleep! Consistent rest is the foundation of your hormonal and mental balance.`;
  }

  // Dynamic Activity Insight
  if (recentActivities > 0) {
    activityInsight = "You've been active recently, which is fantastic for managing stress. Keep up that momentum today!";
  } else {
    activityInsight = "Even a short 10-minute walk today can significantly boost your mood and energy. Small steps matter!";
  }

  // Dynamic Mind/Wellness Insight
  const mindVariations = [
    "Remember to drink a glass of water right now! Hydration is key to keeping your energy stable.",
    "Take 3 deep breaths before your next task. A momentary pause does wonders for your nervous system.",
    "Be kind to yourself today. If you're feeling overwhelmed, it's okay to take a step back and rest."
  ];
  mindInsight = mindVariations[Math.floor(random * mindVariations.length)];

  // 3. Return formatted insights
  return [
    { type: 'sleep', title: 'Rest & Recovery', text: sleepInsight, icon: '💤', color: 'bg-indigo-50 text-indigo-700' },
    { type: 'activity', title: 'Movement', text: activityInsight, icon: '🏃‍♀️', color: 'bg-emerald-50 text-emerald-700' },
    { type: 'mind', title: 'Mindfulness', text: mindInsight, icon: '🧠', color: 'bg-purple-50 text-purple-700' }
  ];
};
