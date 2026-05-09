import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { useNavigate } from 'react-router-dom';
import { Watch, User, Bell, Shield, ChevronRight } from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-8 pb-24">
        
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-500 mt-1">Manage your app preferences and integrations.</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* General Settings placeholder */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider px-6 pt-6 pb-2">Account</h3>
            
            <button className="w-full flex items-center justify-between p-4 px-6 hover:bg-gray-50 transition-colors border-b border-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                  <User className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-800">Profile Details</p>
                  <p className="text-xs text-gray-500">Update your name, age, and health goals</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button className="w-full flex items-center justify-between p-4 px-6 hover:bg-gray-50 transition-colors border-b border-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-500">
                  <Bell className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-800">Notifications</p>
                  <p className="text-xs text-gray-500">Manage pill reminders and alerts</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            
            <button className="w-full flex items-center justify-between p-4 px-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-800">Privacy & Security</p>
                  <p className="text-xs text-gray-500">Manage PIN and data sharing</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Integrations Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider px-6 pt-6 pb-2">Integrations</h3>
            
            <button 
              onClick={() => navigate('/wearables')}
              className="w-full flex items-center justify-between p-4 px-6 hover:bg-emerald-50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 group-hover:bg-emerald-200 transition-colors">
                  <Watch className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-800 group-hover:text-emerald-800 transition-colors">Connected Devices</p>
                  <p className="text-xs text-gray-500 group-hover:text-emerald-600 transition-colors">Sync Apple Watch, Fitbit, Google Fit</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-emerald-500" />
            </button>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
};

export default Settings;
