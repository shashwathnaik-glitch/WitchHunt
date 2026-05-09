import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { PhoneCall, MapPin, Download, Heart, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const ResourceHub = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const helplines = [
    { id: 1, name: "National Domestic Violence Hotline", number: "1-800-799-SAFE", color: "bg-red-50 text-red-600", border: "border-red-100" },
    { id: 2, name: "Crisis Text Line", number: "Text HOME to 741741", color: "bg-purple-50 text-primary", border: "border-purple-100" },
    { id: 3, name: "Women's Health Helpline", number: "1-800-994-9662", color: "bg-blue-50 text-blue-600", border: "border-blue-100" },
  ];

  const stories = [
    { id: 1, author: "Maria S.", quote: "ShieldHer gave me the courage to leave a dangerous situation. The SOS feature literally saved my life.", time: "2 days ago" },
    { id: 2, author: "Jessica T.", quote: "I love the mental health check-ins. It feels like having a caring friend in my pocket whenever I feel overwhelmed.", time: "1 week ago" }
  ];

  return (
    <PageWrapper>
      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
        
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">ResourceHub</h1>
          <p className="text-gray-500 mt-1">Help, community, and support.</p>
        </div>

        {/* Emergency Helplines */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Emergency Helplines</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {helplines.map(line => (
              <a 
                href={`tel:${line.number}`} 
                key={line.id} 
                className={`block p-5 rounded-2xl border ${line.border} hover:shadow-md transition-shadow group bg-white min-h-[44px]`}
              >
                <div className={`w-10 h-10 rounded-full ${line.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <PhoneCall className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">{line.name}</h4>
                <p className="text-sm font-bold text-gray-600">{line.number}</p>
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Map Placeholder */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Nearest Centers</h3>
              <button className="min-h-[44px] min-w-[44px] px-2 text-sm text-primary font-medium flex items-center gap-1 hover:bg-purple-50 rounded-md">
                <MapPin className="w-4 h-4" /> {t('btn.openMap')}
              </button>
            </div>
            <div className="h-48 bg-gray-100 rounded-2xl overflow-hidden relative border border-gray-200 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Map placeholder" 
                className="absolute inset-0 w-full h-full object-cover opacity-50"
              />
              <div className="relative z-10 flex flex-col items-center p-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm text-center">
                <MapPin className="w-6 h-6 text-secondary mb-1" />
                <span className="font-semibold text-gray-800">3 clinics nearby</span>
                <span className="text-xs text-gray-500">Enable location to view</span>
              </div>
            </div>
          </div>

          {/* Offline Resources */}
          <div className="bg-gradient-to-br from-primary to-purple-800 rounded-3xl p-6 text-white flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                <Download className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Offline Survival Guide</h3>
              <p className="text-purple-100 text-sm mb-6 leading-relaxed">
                Download critical safety protocols, first-aid tips, and essential contact numbers for when you don't have internet access.
              </p>
            </div>
            <button className="min-h-[44px] w-full py-3 bg-white text-primary font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
              {t('btn.download')}
            </button>
          </div>
        </div>

        {/* Community Stories */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Heart className="w-5 h-5 text-secondary" /> Community Stories
            </h3>
            <button 
              onClick={() => navigate('/community')}
              className="min-h-[44px] min-w-[44px] px-2 text-sm text-primary font-medium hover:underline flex items-center gap-1 hover:bg-purple-50 rounded-md"
            >
              Open Community Hub <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stories.map(story => (
              <div key={story.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <p className="text-gray-600 text-sm italic leading-relaxed mb-4">"{story.quote}"</p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800 text-sm">- {story.author}</span>
                  <span className="text-xs text-gray-400">{story.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </PageWrapper>
  );
};

export default ResourceHub;
