import React, { useState } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import SOSButton from '../components/ui/SOSButton';
import { ShieldCheck, AlertTriangle, Plus, ChevronRight, Info } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const SafeGuard = () => {
  const { t } = useLanguage();
  
  // State for toggling individual contacts' location sharing
  const [contacts, setContacts] = useState([
    { id: 1, name: 'Mom', relation: 'Family', isSharing: true, avatarGradient: 'linear-gradient(135deg, #7C3AED, #EC4899)' },
    { id: 2, name: 'Emma', relation: 'Friend', isSharing: false, avatarGradient: 'linear-gradient(135deg, #10B981, #3B82F6)' },
    { id: 3, name: 'David', relation: 'Partner', isSharing: true, avatarGradient: 'linear-gradient(135deg, #F59E0B, #EF4444)' },
  ]);

  const [reportOpen, setReportOpen] = useState(false);
  
  const handleSOSTrigger = () => {
    alert("SOS TRIGGERED: Alerting contacts and emergency services.");
  };

  const toggleShare = (id) => {
    setContacts(contacts.map(c => 
      c.id === id ? { ...c, isSharing: !c.isSharing } : c
    ));
  };

  // Determine global status: active if ANY contact is currently being shared with
  const isLocationActive = contacts.some(c => c.isSharing);

  return (
    <PageWrapper>
      {/* Dynamic Status Banner */}
      <div className={`w-full py-3 flex justify-center items-center gap-2 transition-colors duration-300 ${isLocationActive ? 'bg-green-900/30 border-b border-green-500/30' : 'bg-amber-900/30 border-b border-amber-500/30'}`}>
        {isLocationActive ? (
          <>
            <ShieldCheck className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-bold text-sm tracking-wide">PROTECTION ACTIVE</span>
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

        {/* SOS Button Area with Radial Glow */}
        <div className="py-12 relative flex items-center justify-center">
          {/* Subtle Radial Glow Effect */}
          <div 
            className="absolute pointer-events-none"
            style={{
              width: '200px',
              height: '200px',
              background: 'radial-gradient(circle, rgba(239,68,68,0.2) 0%, transparent 70%)',
              filter: 'blur(40px)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 0
            }}
          />
          <SOSButton onTrigger={handleSOSTrigger} />
        </div>

        {/* Trusted Contacts */}
        <div className="card-standard">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Trusted Contacts</h3>
            <button className="flex items-center gap-1 text-sm font-bold transition-colors" style={{ color: 'var(--accent-purple)' }}>
              <Plus className="w-4 h-4" /> {t('btn.addNew') || 'Add New'}
            </button>
          </div>
          
          <div className="space-y-4">
            {contacts.map(contact => (
              <div key={contact.id} className="flex items-center justify-between p-3 rounded-2xl transition-colors" style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
                <div className="flex items-center gap-4">
                  {/* Avatar Circle */}
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
                
                {/* Purple Share Location Toggle */}
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: contact.isSharing ? 'var(--accent-purple-light)' : 'var(--text-muted)' }}>
                    {contact.isSharing ? 'Sharing' : 'Off'}
                  </span>
                  <button 
                    onClick={() => toggleShare(contact.id)}
                    className="relative w-11 h-6 rounded-full transition-colors duration-300"
                    style={{ backgroundColor: contact.isSharing ? 'var(--accent-purple)' : '#374151' }}
                  >
                    <div 
                      className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-sm"
                      style={{ 
                        left: '4px',
                        transform: contact.isSharing ? 'translateX(20px)' : 'translateX(0)'
                      }}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incident Report */}
        <div className="card-standard overflow-hidden p-0 border-none shadow-none">
          <button 
            onClick={() => setReportOpen(!reportOpen)}
            className="w-full min-h-[56px] flex items-center justify-between p-4 transition-colors"
            style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}
          >
            <div className="flex items-center gap-3" style={{ color: 'var(--accent-amber)' }}>
              <Info className="w-5 h-5" />
              <span className="font-bold">Report an Incident</span>
            </div>
            <ChevronRight className={`w-5 h-5 transition-transform ${reportOpen ? 'rotate-90' : ''}`} style={{ color: 'var(--accent-amber)' }} />
          </button>
          
          {reportOpen && (
            <div className="p-4" style={{ backgroundColor: 'var(--bg-card)', borderTop: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>What happened?</label>
                  <textarea 
                    rows="3" 
                    className="w-full rounded-xl p-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none min-h-[88px] resize-none"
                    placeholder="Describe the incident..."
                  ></textarea>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="anonymous" className="min-w-[20px] min-h-[20px] rounded" style={{ accentColor: 'var(--accent-purple)' }} />
                  <label htmlFor="anonymous" className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Submit anonymously</label>
                </div>
                <button type="submit" className="btn-primary w-full mt-2">
                  {t('btn.submitReport') || 'Submit Report'}
                </button>
              </form>
            </div>
          )}
        </div>

      </div>
    </PageWrapper>
  );
};

export default SafeGuard;
