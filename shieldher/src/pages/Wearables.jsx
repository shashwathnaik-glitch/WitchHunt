import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import Modal from '../components/ui/Modal';
import { motion, AnimatePresence } from 'framer-motion';
import { Watch, Heart, Smartphone, Activity, RefreshCw, X, CheckCircle2, ShieldAlert } from 'lucide-react';

// Mock Devices Database
const DEVICES = [
  { id: 'apple', name: 'Apple Watch', provider: 'Apple Health', color: 'bg-black text-white' },
  { id: 'fitbit', name: 'Fitbit', provider: 'Fitbit App', color: 'bg-teal-600 text-white' },
  { id: 'google', name: 'Google Fit', provider: 'Google', color: 'bg-blue-500 text-white' },
  { id: 'samsung', name: 'Samsung Health', provider: 'Samsung', color: 'bg-indigo-600 text-white' }
];

const Wearables = () => {
  // State
  const [connectedDevice, setConnectedDevice] = useState(null); // stores device id
  const [lastSynced, setLastSynced] = useState('2 mins ago');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeviceToConnect, setSelectedDeviceToConnect] = useState(null);
  
  // Health Data State
  const [heartRate, setHeartRate] = useState(72);
  const [steps, setSteps] = useState(4200);

  // Auto-pulse heart rate slightly for realism
  useEffect(() => {
    if (!connectedDevice) return;
    const interval = setInterval(() => {
      setHeartRate(prev => prev + (Math.floor(Math.random() * 5) - 2)); // +/- 2 BPM
    }, 3000);
    return () => clearInterval(interval);
  }, [connectedDevice]);

  const handleConnectClick = (device) => {
    setSelectedDeviceToConnect(device);
    setIsModalOpen(true);
  };

  const handleMockAuthorize = () => {
    setConnectedDevice(selectedDeviceToConnect.id);
    setIsModalOpen(false);
    setSelectedDeviceToConnect(null);
    handleSync();
  };

  const handleDisconnect = () => {
    setConnectedDevice(null);
  };

  const handleSync = () => {
    if (!connectedDevice) return;
    setIsSyncing(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Mock realistic sync data
      setSteps(prev => prev + Math.floor(Math.random() * 500) + 100);
      setHeartRate(Math.floor(Math.random() * 20) + 65); // 65-85 range
      setLastSynced('Just now');
      setIsSyncing(false);
    }, 2000);
  };

  return (
    <PageWrapper>
      <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-8 pb-24">
        
        {/* Header & Demo Badge */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Connected Devices</h1>
            <p className="text-gray-500 mt-1">Sync your wearables for seamless tracking.</p>
          </div>
          <div className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full border border-yellow-200 shadow-sm uppercase tracking-wider flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" />
            Demo Mode
          </div>
        </div>

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-2">Unlock Automatic Tracking</h2>
            <p className="text-emerald-50 text-sm max-w-sm mb-4 leading-relaxed">
              Connect your wearable device to automatically sync steps, heart rate, and sleep data. No more manual logging needed!
            </p>
          </div>
          <Watch className="absolute -right-4 -bottom-4 w-32 h-32 text-white opacity-20" />
        </div>

        {/* Live Data Widget (Only visible if connected) */}
        <AnimatePresence>
          {connectedDevice && (
            <motion.div 
              initial={{ opacity: 0, height: 0, scale: 0.9 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100 flex flex-col md:flex-row gap-6 items-center"
            >
              {/* Heart Rate Widget */}
              <div className="flex-1 w-full bg-rose-50 rounded-2xl p-6 border border-rose-100 flex flex-col items-center justify-center relative overflow-hidden">
                <motion.div 
                  animate={{ scale: [1, 1.15, 1] }} 
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                  className="mb-2"
                >
                  <Heart className="w-12 h-12 text-rose-500 fill-rose-500" />
                </motion.div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-rose-700">{heartRate}</span>
                  <span className="text-sm font-semibold text-rose-500">BPM</span>
                </div>
                <p className="text-xs text-rose-400 mt-1 uppercase tracking-wider font-medium">Resting Heart Rate</p>
              </div>

              {/* Steps & Sync */}
              <div className="flex-1 w-full space-y-4">
                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Activity className="w-6 h-6 text-blue-500" />
                    <div>
                      <p className="text-xs text-blue-500 font-bold uppercase">Today's Steps</p>
                      <p className="text-xl font-bold text-blue-900">{steps.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="w-full min-h-[44px] bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Syncing data...' : 'Sync Now'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Devices List */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">Available Devices</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEVICES.map(device => {
              const isConnected = connectedDevice === device.id;

              return (
                <div key={device.id} className={`bg-white rounded-2xl p-5 border shadow-sm transition-all ${isConnected ? 'border-emerald-300 ring-2 ring-emerald-50' : 'border-gray-100'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${device.color}`}>
                      <Smartphone className="w-6 h-6" />
                    </div>
                    {isConnected ? (
                      <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Connected
                      </div>
                    ) : (
                      <div className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-full">
                        Not Connected
                      </div>
                    )}
                  </div>
                  
                  <h4 className="font-bold text-gray-900 text-lg">{device.name}</h4>
                  <p className="text-sm text-gray-500 mb-6">via {device.provider}</p>

                  {isConnected ? (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 font-medium">Synced {lastSynced}</span>
                      <button 
                        onClick={handleDisconnect}
                        className="text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                      >
                        Disconnect
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleConnectClick(device)}
                      disabled={connectedDevice !== null && !isConnected}
                      className="w-full min-h-[44px] bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Connect
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Connection Modal */}
      <Modal 
        isOpen={isModalOpen && !!selectedDeviceToConnect} 
        onClose={() => setIsModalOpen(false)} 
        title={selectedDeviceToConnect ? `Connect ${selectedDeviceToConnect.name}` : ''}
      >
        {selectedDeviceToConnect && (
          <div className="space-y-5">
            <div className="text-center">
              <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-4 ${selectedDeviceToConnect.color} shadow-lg`}>
                <Watch className="w-10 h-10" />
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                You are about to securely link ShieldHer with <strong className="text-white">{selectedDeviceToConnect.provider}</strong>. This allows automatic syncing of steps and heart rate.
              </p>
            </div>

            <div className="bg-blue-900/30 text-blue-300 p-3 rounded-xl text-xs flex gap-3 border border-blue-500/30">
              <ShieldAlert className="w-8 h-8 flex-shrink-0 text-blue-400" />
              <p><strong>Demo Mode Notice:</strong> Clicking authorize will simulate a successful OAuth connection using mock data.</p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button 
                onClick={handleMockAuthorize}
                className="w-full min-h-[44px] bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" /> Mock Authorize
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full min-h-[44px] text-gray-400 font-medium hover:bg-white/10 rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>

    </PageWrapper>
  );
};

export default Wearables;
