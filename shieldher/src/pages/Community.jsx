import React, { useState } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import Modal from '../components/ui/Modal';
import { Heart, MessageCircle, Share2, Plus, X, Users, TrendingUp, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  { id: 'all', label: 'All Posts' },
  { id: 'fitness', label: '💪 Fitness Win' },
  { id: 'mental', label: '🧘 Mental Health' },
  { id: 'health', label: '🩺 Health Tip' },
  { id: 'safety', label: '🛡️ Safety Story' }
];

const TRENDING_TAGS = ['#CycleHealth', '#StressRelief', '#SafeCommute', '#PCOS', '#MarathonTraining'];

const MOCK_POSTS = [
  {
    id: 1,
    author: 'Sarah Jenkins',
    avatar: 'bg-rose-100 text-rose-600',
    initials: 'SJ',
    category: 'fitness',
    categoryLabel: '💪 Fitness Win',
    time: '2 hours ago',
    content: 'Just finished my first 5k run! I never thought I could do it, but taking it one day at a time really helped. To anyone starting their fitness journey: you got this! 🏃‍♀️✨',
    likes: 42,
    comments: 5
  },
  {
    id: 2,
    author: 'Anonymous',
    avatar: 'bg-gray-200 text-gray-500',
    initials: 'A',
    category: 'mental',
    categoryLabel: '🧘 Mental Health',
    time: '5 hours ago',
    content: 'Taking a mental health day today. It took me a long time to learn that resting is productive too. Don\'t feel guilty for prioritizing your well-being. 💜',
    likes: 128,
    comments: 12
  },
  {
    id: 3,
    author: 'Dr. Emily R.',
    avatar: 'bg-blue-100 text-blue-600',
    initials: 'ER',
    category: 'health',
    categoryLabel: '🩺 Health Tip',
    time: 'Yesterday',
    content: 'Reminder to all my ladies: Iron and Folate are crucial! Leafy greens, lentils, and fortified cereals are your best friends. Stay healthy! 🥬',
    likes: 89,
    comments: 4
  },
  {
    id: 4,
    author: 'Maya Patel',
    avatar: 'bg-emerald-100 text-emerald-600',
    initials: 'MP',
    category: 'safety',
    categoryLabel: '🛡️ Safety Story',
    time: 'Yesterday',
    content: 'Used the fake call feature on ShieldHer last night when walking to my car. It gave me so much peace of mind. Thank you for this app!',
    likes: 215,
    comments: 18
  },
  {
    id: 5,
    author: 'Anonymous',
    avatar: 'bg-gray-200 text-gray-500',
    initials: 'A',
    category: 'fitness',
    categoryLabel: '💪 Fitness Win',
    time: '2 days ago',
    content: 'Hit my 10,000 steps goal for 7 days in a row! The Activity tracker is so motivating.',
    likes: 56,
    comments: 2
  },
  {
    id: 6,
    author: 'Chloe S.',
    avatar: 'bg-purple-100 text-purple-600',
    initials: 'CS',
    category: 'mental',
    categoryLabel: '🧘 Mental Health',
    time: '3 days ago',
    content: 'Does anyone else get severe anxiety right before their period? Finding it really hard to cope today.',
    likes: 34,
    comments: 22
  }
];

const Community = () => {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Post State
  const [newPostText, setNewPostText] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('fitness');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const filteredPosts = activeTab === 'all' 
    ? posts 
    : posts.filter(post => post.category === activeTab);

  const handleLike = (id) => {
    setPosts(posts.map(post => {
      if (post.id === id) {
        return { ...post, likes: post.likes + 1, isLiked: true };
      }
      return post;
    }));
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const categoryObj = CATEGORIES.find(c => c.id === newPostCategory);
    
    const newPost = {
      id: Date.now(),
      author: isAnonymous ? 'Anonymous' : 'Sarah Jenkins',
      avatar: isAnonymous ? 'bg-gray-200 text-gray-500' : 'bg-indigo-100 text-indigo-600',
      initials: isAnonymous ? 'A' : 'SJ',
      category: newPostCategory,
      categoryLabel: categoryObj.label,
      time: 'Just now',
      content: newPostText,
      likes: 0,
      comments: 0
    };

    setPosts([newPost, ...posts]);
    setIsModalOpen(false);
    setNewPostText('');
    setIsAnonymous(false);
  };

  return (
    <PageWrapper>
      <div className="p-4 md:p-8 max-w-6xl mx-auto pb-24">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" /> Community Hub
            </h1>
            <p className="text-gray-500 mt-1">A safe space to share, support, and connect.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="hidden md:flex min-h-[44px] px-6 py-2 bg-primary text-white font-medium rounded-xl hover:bg-purple-800 transition-colors shadow-sm items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Share Story
          </button>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8">
          
          {/* LEFT SIDEBAR (Desktop Filters) */}
          <div className="hidden lg:block lg:col-span-3 space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-8">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" /> Categories
              </h3>
              <div className="space-y-2">
                {CATEGORIES.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveTab(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors border ${
                      activeTab === category.id 
                        ? 'bg-purple-100 text-purple-900 border-purple-200' 
                        : 'bg-transparent text-gray-600 border-transparent hover:bg-gray-50'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER: Main Feed */}
          <div className="lg:col-span-6 space-y-6 max-w-[600px] mx-auto w-full">
            
            {/* Mobile Share Button */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="md:hidden w-full min-h-[44px] bg-primary text-white font-medium rounded-xl hover:bg-purple-800 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" /> Share Your Story
            </button>

            {/* Mobile Filter Tabs */}
            <div className="flex lg:hidden overflow-x-auto pb-2 hide-scrollbar gap-2">
              {CATEGORIES.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={`min-h-[44px] px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
                    activeTab === category.id 
                      ? 'bg-purple-100 text-purple-900 border-purple-200' 
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Feed Posts */}
            <AnimatePresence>
              {filteredPosts.map(post => (
                <motion.div 
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-gray-100"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${post.avatar}`}>
                        {post.initials}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{post.author}</h4>
                        <p className="text-xs text-gray-500">{post.time}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium bg-gray-50 px-3 py-1 rounded-full text-gray-600 border border-gray-100">
                      {post.categoryLabel}
                    </span>
                  </div>

                  <p className="text-gray-800 leading-relaxed mb-6">
                    {post.content}
                  </p>

                  <div className="flex items-center gap-6 pt-4 border-t border-gray-50">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-2 text-sm font-medium transition-colors ${post.isLiked ? 'text-rose-500' : 'text-gray-500 hover:text-rose-500'}`}
                    >
                      <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-rose-500' : ''}`} /> 
                      {post.likes} 💜
                    </button>
                    <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary transition-colors">
                      <MessageCircle className="w-5 h-5" /> 
                      {post.comments} 💬
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredPosts.length === 0 && (
              <div className="text-center p-12 bg-gray-50 rounded-3xl border border-gray-100">
                <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-gray-600 font-medium">No posts in this category yet.</h3>
                <p className="text-gray-400 text-sm mt-1">Be the first to share your story!</p>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-6 border border-purple-100 shadow-sm">
              <h3 className="font-bold text-purple-900 flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-purple-500" /> Trending Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {TRENDING_TAGS.map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-white/60 text-purple-800 text-sm font-medium rounded-lg border border-purple-100 hover:bg-white cursor-pointer transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Suggested Connections (Desktop Only or hidden on very small) */}
            <div className="hidden lg:block bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-500" /> Suggested for You
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'Priya K.', bio: 'Yoga & Mindfulness', color: 'bg-emerald-100 text-emerald-600' },
                  { name: 'Dr. Sarah', bio: 'Women\'s Health', color: 'bg-blue-100 text-blue-600' },
                  { name: 'Lena M.', bio: 'Runner & Mom', color: 'bg-rose-100 text-rose-600' }
                ].map((user, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${user.color}`}>
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 leading-tight">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.bio}</p>
                      </div>
                    </div>
                    <button className="text-xs font-bold text-primary hover:text-purple-800 transition-colors">
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100 shadow-sm text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-600 text-xl">
                🌸
              </div>
              <h3 className="font-bold text-emerald-900 mb-2">Safe Space Policy</h3>
              <p className="text-xs text-emerald-700 leading-relaxed">
                ShieldHer is a zero-tolerance zone for toxicity. All metrics are supportive. Be kind, be brave, and support your sisters.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Share Story Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Share Your Story">
        <form onSubmit={handlePostSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Category</label>
            <select 
              value={newPostCategory}
              onChange={(e) => setNewPostCategory(e.target.value)}
              className="w-full bg-black/30 border border-purple-500/30 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[44px]"
            >
              {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                <option key={c.id} value={c.id} className="bg-[#160D30]">{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="block text-sm font-bold text-gray-300">Your Story</label>
              <span className={`text-xs font-medium ${newPostText.length > 280 ? 'text-red-400' : 'text-gray-500'}`}>
                {newPostText.length}/280
              </span>
            </div>
            <textarea 
              required
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="What's on your mind? Share a win, a tip, or ask for support..."
              className="w-full bg-black/30 border border-purple-500/30 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 h-32 resize-none placeholder:text-gray-500"
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-purple-900/30 rounded-xl border border-purple-500/30">
            <input 
              type="checkbox" 
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-5 h-5 text-primary rounded focus:ring-primary cursor-pointer"
            />
            <label htmlFor="anonymous" className="text-sm font-medium text-purple-300 cursor-pointer">
              Post Anonymously
            </label>
          </div>

          <div className="pt-2 border-t border-white/10">
            <button 
              type="submit" 
              disabled={!newPostText.trim() || newPostText.length > 280}
              className="w-full min-h-[44px] bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              Publish Post
            </button>
          </div>
        </form>
      </Modal>

    </PageWrapper>
  );
};

export default Community;
