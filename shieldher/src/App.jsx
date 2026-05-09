import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import SafeGuard from './pages/SafeGuard';
import MindPulse from './pages/MindPulse';
import HealthCompanion from './pages/HealthCompanion';
import ResourceHub from './pages/ResourceHub';
import ActivityHub from './pages/ActivityHub';
import NutritionLog from './pages/NutritionLog';
import SleepTracker from './pages/SleepTracker';
import Settings from './pages/Settings';
import Wearables from './pages/Wearables';
import Community from './pages/Community';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { initializeMockData } from './utils/storageUtils';

function App() {
  useEffect(() => {
    initializeMockData();
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <Router>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="safety" element={<SafeGuard />} />
                <Route path="mind" element={<MindPulse />} />
                <Route path="health" element={<HealthCompanion />} />
                <Route path="resources" element={<ResourceHub />} />
                <Route path="activity" element={<ActivityHub />} />
                <Route path="nutrition" element={<NutritionLog />} />
                <Route path="sleep" element={<SleepTracker />} />
                <Route path="settings" element={<Settings />} />
                <Route path="wearables" element={<Wearables />} />
                <Route path="community" element={<Community />} />
                <Route path="insights" element={<Dashboard />} />
              </Route>
            </Routes>
          </Router>
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
