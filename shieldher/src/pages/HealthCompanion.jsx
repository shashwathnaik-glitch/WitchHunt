import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import Modal from '../components/ui/Modal';
import { loadData, saveData } from '../utils/storageUtils';
import { Calendar, Pill, Search, ChevronDown, ChevronUp, AlertCircle, Droplet, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const AccordionItem = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full min-h-[44px] flex items-center justify-between py-4 text-left focus:outline-none"
      >
        <span className="font-medium text-gray-800">{title}</span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      {isOpen && (
        <div className="pb-4 text-sm text-gray-600 leading-relaxed">
          {content}
        </div>
      )}
    </div>
  );
};

const HealthCompanion = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Symptom Checker State
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [assessment, setAssessment] = useState('');

  // Cycle Tracker State
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);
  const [lastPeriod, setLastPeriod] = useState(new Date().toISOString().split('T')[0]);
  const [cycleLength, setCycleLength] = useState(28);
  const [daysLeft, setDaysLeft] = useState(14);

  useEffect(() => {
    const saved = loadData('cycle_data');
    if (saved) {
      setLastPeriod(saved.lastPeriod);
      setCycleLength(saved.cycleLength);
      calculateDaysLeft(saved.lastPeriod, saved.cycleLength);
    }
  }, []);

  const calculateDaysLeft = (last, cycle) => {
    if (!last || !cycle) return;
    const lastDate = new Date(last);
    const nextDate = new Date(lastDate);
    nextDate.setDate(lastDate.getDate() + Number(cycle));
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize to midnight
    const diffTime = nextDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    setDaysLeft(diffDays > 0 ? diffDays : 0);
  };

  const handleSavePeriod = (e) => {
    e.preventDefault();
    calculateDaysLeft(lastPeriod, cycleLength);
    saveData('cycle_data', { lastPeriod, cycleLength });
    setIsPeriodModalOpen(false);
  };

  const symptomsList = [
    'Severe cramps',
    'Irregular periods',
    'Nausea',
    'Persistent headache',
    'Extreme fatigue'
  ];

  const handleSymptomCheck = () => {
    if (!selectedSymptom) return;
    setAssessment(`Based on your symptom "${selectedSymptom}", it's recommended to rest and stay hydrated. If this persists for more than 48 hours or worsens significantly, please consult a healthcare professional. (This is an AI generated suggestion, not medical advice)`);
  };

  const faqs = [
    { title: "What are early signs of pregnancy?", content: "Common early signs include a missed period, tender breasts, nausea (morning sickness), increased urination, and fatigue. However, these can also be caused by other factors." },
    { title: "How to manage severe menstrual cramps?", content: "Over-the-counter pain relievers, applying heat to your lower abdomen, light exercise, and staying hydrated can help. If cramps disrupt your daily life, consult a doctor." },
    { title: "What is PCOS and what are its symptoms?", content: "Polycystic Ovary Syndrome is a hormonal disorder. Symptoms include irregular periods, excess androgen levels (can cause facial hair or acne), and polycystic ovaries." }
  ];

  return (
    <PageWrapper>
      <div className="p-4 md:p-8 max-w-4xl lg:max-w-7xl mx-auto space-y-8 pb-24">
        
        <div className="text-left mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">HealthCompanion</h1>
          <p className="text-gray-500 mt-1">Your personal reproductive health assistant.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: Cycle Tracker */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-purple-50 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-pink-50 text-secondary rounded-full">
                  <Droplet className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Cycle Tracker</h3>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                <div className="inline-flex items-center justify-center w-48 h-48 rounded-full border-[6px] border-pink-100 mb-6">
                  <div className="text-center">
                    <span className="block text-5xl font-bold text-gray-800">{daysLeft}</span>
                    <span className="text-sm text-gray-500 uppercase tracking-wider mt-1 block">Days left</span>
                  </div>
                </div>
                <p className="text-lg font-medium text-secondary">
                  {daysLeft <= 5 ? 'Period Approaching' : (daysLeft > 10 && daysLeft <= 16) ? 'Fertile Window' : 'Follicular Phase'}
                </p>
                <p className="text-sm text-gray-500 mt-2">Next period expected in {daysLeft} days</p>
              </div>
              <button 
                onClick={() => setIsPeriodModalOpen(true)}
                className="min-h-[44px] w-full py-3 mt-4 bg-pink-50 text-secondary font-bold rounded-xl hover:bg-pink-100 transition-colors"
              >
                {t('btn.logPeriod') || 'Log Period'}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Symptom checker + insights */}
          <div className="space-y-6">
            
            {/* Symptom Checker */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-50 text-orange-500 rounded-full">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">AI Symptom Checker</h3>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <select 
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                  value={selectedSymptom}
                  onChange={(e) => setSelectedSymptom(e.target.value)}
                >
                  <option value="">Select a symptom...</option>
                  {symptomsList.map(sym => (
                    <option key={sym} value={sym}>{sym}</option>
                  ))}
                </select>
                <button 
                  onClick={handleSymptomCheck}
                  className="min-h-[44px] px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-purple-800 transition-colors shadow-sm"
                >
                  {t('btn.analyze')}
                </button>
              </div>

              {assessment && (
                <div className="mt-6 p-5 bg-purple-50 border border-purple-100 rounded-2xl">
                  <h4 className="text-sm font-bold text-primary mb-2">AI Assessment</h4>
                  <p className="text-sm text-gray-700 leading-relaxed font-medium">{assessment}</p>
                </div>
              )}
            </div>

            {/* Medication Reminder */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Pill className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-800">Birth Control Pill</h4>
                <p className="text-sm text-gray-500 mt-1 font-medium">8:00 PM • Daily</p>
              </div>
              <button className="min-h-[44px] px-5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors">
                Taken
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Find Clinic */}
              <div className="bg-primary rounded-3xl p-6 text-white relative overflow-hidden flex flex-col justify-between h-full min-h-[200px]">
                <div className="relative z-10">
                  <h3 className="text-lg font-bold mb-2">Need a Professional?</h3>
                  <p className="text-purple-200 text-sm mb-4">Find trusted gynecologists and women's health clinics near you.</p>
                </div>
                <div className="relative z-10 mt-auto">
                  <button className="min-h-[44px] w-full bg-white text-primary font-bold rounded-xl text-sm hover:bg-purple-50 transition-colors shadow-sm">
                    {t('btn.findClinic')}
                  </button>
                </div>
                <Search className="absolute -bottom-4 -right-4 w-32 h-32 text-white opacity-10" />
              </div>

              {/* Nutrition & Diet */}
              <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100 relative overflow-hidden flex flex-col justify-between h-full min-h-[200px]">
                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-emerald-900 mb-2">Nutrition & Diet</h3>
                  <p className="text-emerald-700 text-sm mb-4">Track your macros, water intake, and vital nutrients for women's health.</p>
                </div>
                <div className="relative z-10 mt-auto">
                  <button 
                    onClick={() => navigate('/nutrition')}
                    className="min-h-[44px] w-full bg-emerald-600 text-white font-bold rounded-xl text-sm hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    Open Nutrition Log
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mt-12">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-6">Reproductive Health FAQs</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-2 items-start">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} title={faq.title} content={faq.content} />
            ))}
          </div>
        </div>

      </div>

      {/* Log Period Modal */}
      <Modal isOpen={isPeriodModalOpen} onClose={() => setIsPeriodModalOpen(false)} title="Log Period">
        <form onSubmit={handleSavePeriod} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-1">Last Period Start Date</label>
            <input 
              type="date" 
              required
              className="w-full bg-black/30 border border-purple-500/30 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-500 outline-none min-h-[44px]"
              value={lastPeriod}
              onChange={(e) => setLastPeriod(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-1">Average Cycle Length (days)</label>
            <input 
              type="number"
              min="21"
              max="40"
              required
              className="w-full bg-black/30 border border-purple-500/30 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-500 outline-none min-h-[44px]"
              value={cycleLength}
              onChange={(e) => setCycleLength(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">Normal range: 21–40 days</p>
          </div>
          <div className="pt-2">
            <button type="submit" className="w-full min-h-[44px] bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700 transition-colors shadow-md">
              Save & Calculate
            </button>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  );
};

export default HealthCompanion;
