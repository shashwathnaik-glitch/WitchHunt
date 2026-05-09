import React, { useState } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import SOSButton from '../components/ui/SOSButton';
import Modal from '../components/ui/Modal';
import { ShieldCheck, AlertTriangle, Plus, ChevronRight, Info, Phone, Share2, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';

const SafeGuard = () => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  
  const [contacts, setContacts] = useState([
    { id: 1, name: 'Mom', relation: 'Family', phone: '555-0101', avatarGradient: 'linear-gradient(135deg, #7C3AED, #EC4899)' },
    { id: 2, name: 'Emma', relation: 'Friend', phone: '555-0102', avatarGradient: 'linear-gradient(135deg, #10B981, #3B82F6)' },
    { id: 3, name: 'David', relation: 'Partner', phone: '555-0103', avatarGradient: 'linear-gradient(135deg, #F59E0B, #EF4444)' },
  ]);

  const [isLocationActive, setIsLocationActive] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  
  const safetyTips = [
    "Always share your live location with a trusted contact before taking a cab.",
    "Trust your instincts. If a situation feels unsafe, leave immediately.",
    "Keep your phone charged and easily accessible when walking alone.",
    "Stay aware of your surroundings and avoid looking at your phone continuously."
  ];

  const handleSOSTrigger = () => {
    setSosModalOpen(true);
  };

  const handleShareLocation = (name) => {
    showToast(`Location shared with ${name}`, 'success');
  };

  const submitReport = (e) => {
    e.preventDefault();
    setReportOpen(false);
    showToast('Incident reported successfully. Thank you for speaking up.', 'success');
  };

  return (
    <PageWrapper>
      {/* Dynamic Status Banner */}
      <div className={`w-full py-3 flex justify-center items-center gap-2 transition-colors duration-300 ${isLocationActive ? 'bg-green-900/30 border-b border-green-500/30' : 'bg-amber-900/30 border-b border-amber-500/30'}`}>
        {isLocationActive ? (
          <>
            <ShieldCheck className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-bold text-sm tracking-wide">LOCATION SHARING ACTIVE</span>
          </>
        ) : (
          <>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span className="text-amber-400 font-bold text-sm tracking-wide">LOCATION SHARING OFF</span>
          </>
        )}
      </div>

      <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-8 pb-24 relative z-10">
        
        <div className="text-center mt-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900" style={{ color: 'var(--text-primary)' }}>SafeGuard</h1>
          <p className="mt-1" style={{ color: 'var(--text-muted)' }}>We are here to protect you.</p>
        </div>

        {/* Global Share Location Toggle */}
        <div className="flex justify-center">
          <button 
            onClick={() => setIsLocationActive(!isLocationActive)}
            className="flex items-center gap-3 px-6 py-3 rounded-full font-bold transition-all shadow-md"
            style={{ 
              backgroundColor: isLocationActive ? 'rgba(52, 211, 153, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              color: isLocationActive ? '#34D399' : 'var(--text-muted)',
              border: `1px solid ${isLocationActive ? 'rgba(52, 211, 153, 0.4)' : 'var(--border-subtle)'}`
            }}
          >
            <div className={`w-3 h-3 rounded-full ${isLocationActive ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
            {isLocationActive ? 'Live Location On' : 'Turn On Live Location'}
          </button>
        </div>

        {/* SOS Button Area */}
        <div className="py-8 relative flex items-center justify-center">
          <SOSButton onTrigger={handleSOSTrigger} />
        </div>

        {/* Trusted Contacts */}
        <div className="card-standard">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Trusted Contacts</h3>
            <button className="flex items-center gap-1 text-sm font-bold transition-colors" style={{ color: 'var(--accent-purple)' }}>
              <Plus className="w-4 h-4" /> Add New
            </button>
          </div>
          
          <div className="space-y-4">
            {contacts.map(contact => (
              <div key={contact.id} className="flex items-center justify-between p-3 rounded-2xl transition-colors" style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm"
                    style={{ background: contact.avatarGradient }}
                  >
                    {contact.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{contact.name}</p>
                    <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{contact.relation}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <a 
                    href={`tel:${contact.phone}`}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-emerald-400" />
                  </a>
                  <button 
                    onClick={() => handleShareLocation(contact.name)}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <Share2 className="w-4 h-4 text-purple-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Tips Carousel */}
        <div className="card-standard relative overflow-hidden bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-white">Safety Tip</h3>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentTip(prev => prev === 0 ? safetyTips.length - 1 : prev - 1)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              <button 
                onClick={() => setCurrentTip(prev => (prev + 1) % safetyTips.length)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
          <p className="text-sm text-purple-200 mt-2 min-h-[40px]">
            {safetyTips[currentTip]}
          </p>
        </div>

        {/* Incident Report Button */}
        <button 
          onClick={() => setReportOpen(true)}
          className="w-full card-standard min-h-[56px] flex items-center justify-between p-4 transition-colors"
          style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}
        >
          <div className="flex items-center gap-3" style={{ color: 'var(--accent-amber)' }}>
            <Info className="w-5 h-5" />
            <span className="font-bold">Report an Incident</span>
          </div>
          <ChevronRight className="w-5 h-5 text-amber-500" />
        </button>

      </div>

      {/* SOS Success Modal */}
      <Modal isOpen={sosModalOpen} onClose={() => setSosModalOpen(false)} title="Emergency Alert">
        <div className="flex flex-col items-center text-center space-y-4 py-4">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold text-white">Alert Sent!</h2>
          <p className="text-gray-300">Your trusted contacts and local authorities have been notified of your location.</p>
          <button onClick={() => setSosModalOpen(false)} className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors">
            Understood
          </button>
        </div>
      </Modal>

      {/* Report Incident Modal */}
      <Modal isOpen={reportOpen} onClose={() => setReportOpen(false)} title="Report Incident">
        <form className="space-y-4" onSubmit={submitReport}>
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-300">Incident Type</label>
            <select className="w-full rounded-xl p-3 text-sm bg-black/30 border border-purple-500/30 text-white focus:outline-none focus:border-purple-500">
              <option>Harassment</option>
              <option>Suspicious Activity</option>
              <option>Assault</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-300">What happened?</label>
            <textarea 
              rows="3" 
              required
              className="w-full rounded-xl p-3 text-sm bg-black/30 border border-purple-500/30 text-white focus:outline-none focus:border-purple-500 min-h-[88px] resize-none"
              placeholder="Describe the incident..."
            ></textarea>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="anonymous" className="min-w-[20px] min-h-[20px] rounded accent-purple-600" />
            <label htmlFor="anonymous" className="text-sm font-medium text-gray-400">Submit anonymously</label>
          </div>
          <button type="submit" className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-colors mt-2">
            Submit Report
          </button>
        </form>
      </Modal>

    </PageWrapper>
  );
};

export default SafeGuard;
