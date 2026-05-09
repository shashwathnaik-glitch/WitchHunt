export const saveData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to localStorage', error);
  }
};

export const loadData = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error loading data from localStorage', error);
    return defaultValue;
  }
};

export const clearData = (key) => {
  localStorage.removeItem(key);
};

export const initializeMockData = () => {
  if (!loadData('app_initialized')) {
    saveData('sleep_logs', [
      { id: 1, date: '2023-10-01', duration: 7.5, score: 85 },
      { id: 2, date: '2023-10-02', duration: 6.2, score: 70 },
      { id: 3, date: '2023-10-03', duration: 8.1, score: 92 },
      { id: 4, date: '2023-10-04', duration: 5.5, score: 60 },
      { id: 5, date: '2023-10-05', duration: 7.0, score: 80 },
      { id: 6, date: '2023-10-06', duration: 7.8, score: 88 },
      { id: 7, date: '2023-10-07', duration: 6.9, score: 78 }
    ]);

    saveData('activity_logs', [
      { id: 1, type: 'Walking', duration: 30, date: '2023-10-01', notes: 'Morning walk' },
      { id: 2, type: 'Yoga', duration: 45, date: '2023-10-02', notes: 'Vinyasa flow' },
      { id: 3, type: 'Running', duration: 20, date: '2023-10-03', notes: 'Quick jog' },
      { id: 4, type: 'Walking', duration: 40, date: '2023-10-04', notes: 'Evening stroll' },
      { id: 5, type: 'Cycling', duration: 60, date: '2023-10-05', notes: 'City ride' },
      { id: 6, type: 'Yoga', duration: 30, date: '2023-10-06', notes: 'Restorative yoga' },
      { id: 7, type: 'Walking', duration: 25, date: '2023-10-07', notes: 'Park walk' }
    ]);

    saveData('mood_logs', [
      { id: 1, mood: 'Happy', tags: ['Work', 'Health'], date: '2023-10-01' },
      { id: 2, mood: 'Calm', tags: ['Family'], date: '2023-10-02' },
      { id: 3, mood: 'Anxious', tags: ['Work'], date: '2023-10-03' },
      { id: 4, mood: 'Tired', tags: ['Sleep'], date: '2023-10-04' },
      { id: 5, mood: 'Hopeful', tags: ['Relationships'], date: '2023-10-05' },
      { id: 6, mood: 'Grateful', tags: ['Health'], date: '2023-10-06' },
      { id: 7, mood: 'Happy', tags: ['Family', 'Other'], date: '2023-10-07' }
    ]);

    saveData('nutrition_logs', {
      waterCups: 4,
      meals: {
        breakfast: [{ id: 1, name: 'Oatmeal', calories: 250, protein: 10 }],
        lunch: [{ id: 2, name: 'Salad', calories: 350, protein: 15 }],
        dinner: [],
        snacks: [{ id: 3, name: 'Apple', calories: 95, protein: 0 }]
      }
    });

    saveData('trusted_contacts', [
      { id: 1, name: 'Mom', phone: '555-0101' },
      { id: 2, name: 'Sarah', phone: '555-0102' }
    ]);

    saveData('community_posts', [
      { id: 1, author: 'Priya', content: 'Just finished my first 5k!', category: 'Fitness', likes: 12, comments: 3, time: '2h ago', initials: 'P', avatar: 'bg-emerald-100 text-emerald-600', categoryLabel: 'Fitness', isLiked: false },
      { id: 2, author: 'Sarah', content: 'Feeling anxious today, trying to breathe.', category: 'Mental Health', likes: 24, comments: 8, time: '4h ago', initials: 'S', avatar: 'bg-blue-100 text-blue-600', categoryLabel: 'Mental Health', isLiked: true },
      { id: 3, author: 'Anonymous', content: 'Anyone have tips for solo traveling safely?', category: 'Safety', likes: 45, comments: 15, time: '5h ago', initials: 'A', avatar: 'bg-purple-100 text-purple-600', categoryLabel: 'Safety', isLiked: false },
      { id: 4, author: 'Lena', content: 'Yoga really helped my back pain.', category: 'Fitness', likes: 30, comments: 5, time: '1d ago', initials: 'L', avatar: 'bg-rose-100 text-rose-600', categoryLabel: 'Fitness', isLiked: false },
      { id: 5, author: 'Anonymous', content: 'Grateful for this supportive community 💜', category: 'Mental Health', likes: 50, comments: 10, time: '1d ago', initials: 'A', avatar: 'bg-purple-100 text-purple-600', categoryLabel: 'Mental Health', isLiked: true },
      { id: 6, author: 'Mia', content: 'Always share your live location when getting in a cab!', category: 'Safety', likes: 88, comments: 12, time: '2d ago', initials: 'M', avatar: 'bg-orange-100 text-orange-600', categoryLabel: 'Safety', isLiked: false }
    ]);

    saveData('app_initialized', true);
  }
};
