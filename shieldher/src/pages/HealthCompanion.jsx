import React, { useState } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { Calendar, Pill, Search, ChevronDown, ChevronUp, AlertCircle, Droplet } from 'lucide-react';
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
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [assessment, setAssessment] = useState('');

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
      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
        
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">HealthCompanion</h1>
          <p className="text-gray-500 mt-1">Your personal reproductive health assistant.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cycle Tracker */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-purple-50">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-pink-50 text-secondary rounded-full">
                <Droplet className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Cycle Tracker</h3>
            </div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 border-pink-100 mb-4">
                <div className="text-center">
                  <span className="block text-3xl font-bold text-gray-800">14</span>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Days left</span>
                </div>
              </div>
              <p className="text-sm font-medium text-secondary">Fertile Window</p>
              <p className="text-xs text-gray-500 mt-1">Next period expected in 14 days</p>
            </div>
            <button className="min-h-[44px] w-full py-2 bg-pink-50 text-secondary font-medium rounded-xl hover:bg-pink-100 transition-colors">
              {t('btn.logPeriod')}
            </button>
          </div>

          <div className="space-y-6">
            {/* Medication Reminder */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Pill className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">Birth Control Pill</h4>
                <p className="text-sm text-gray-500">8:00 PM • Daily</p>
              </div>
              <button className="min-h-[44px] px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors">
                Taken
              </button>
            </div>

            {/* Find Clinic */}
            <div className="bg-primary rounded-3xl p-6 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-lg font-semibold mb-2">Need a Professional?</h3>
                <p className="text-purple-200 text-sm mb-4 max-w-[200px]">Find trusted gynecologists and women's health clinics near you.</p>
                <button className="min-h-[44px] px-5 py-2 bg-white text-primary font-medium rounded-xl text-sm hover:bg-purple-50 transition-colors shadow-sm">
                  {t('btn.findClinic')}
                </button>
              </div>
              <Search className="absolute -bottom-4 -right-4 w-32 h-32 text-white opacity-10" />
            </div>

            {/* Nutrition & Diet */}
            <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-emerald-900 mb-2">Nutrition & Diet</h3>
                <p className="text-emerald-700 text-sm mb-4">Track your macros, water intake, and vital nutrients for women's health.</p>
                <button 
                  onClick={() => navigate('/nutrition')}
                  className="min-h-[44px] px-5 py-2 bg-emerald-600 text-white font-medium rounded-xl text-sm hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  Open Nutrition Log
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Symptom Checker */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-50 text-orange-500 rounded-full">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">AI Symptom Checker</h3>
          </div>
          
          <div className="flex gap-4">
            <select 
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
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
              className="min-h-[44px] px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-purple-800 transition-colors"
            >
              {t('btn.analyze')}
            </button>
          </div>

          {assessment && (
            <div className="mt-6 p-4 bg-purple-50 border border-purple-100 rounded-2xl">
              <h4 className="text-sm font-semibold text-primary mb-2">AI Assessment</h4>
              <p className="text-sm text-gray-700 leading-relaxed">{assessment}</p>
            </div>
          )}
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Reproductive Health FAQs</h3>
          <div>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} title={faq.title} content={faq.content} />
            ))}
          </div>
        </div>

      </div>
    </PageWrapper>
  );
};

export default HealthCompanion;
