import React from 'react';
import { Activity, Beaker, FileText, Search, Filter, Download, ChevronRight, AlertCircle, CheckCircle2, ArrowLeft, Info, TrendingUp, Calendar, User } from 'lucide-react';
import { cn } from '../utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface LabHistory {
  date: string;
  value: number;
}

interface LabTest {
  id: number;
  name: string;
  category: string;
  date: string;
  status: 'Normal' | 'Attention' | 'Critical';
  value: string;
  unit: string;
  numericValue: number;
  trend: 'up' | 'down' | 'stable';
  doctor: string;
  description: string;
  normalRange: string;
  history: LabHistory[];
}

export default function LabResults() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState('all');
  const [selectedLab, setSelectedLab] = React.useState<LabTest | null>(null);

  const labs: LabTest[] = [
    { 
      id: 1, 
      name: 'Complete Blood Count (CBC)', 
      category: 'Hematology', 
      date: 'Mar 10, 2026', 
      status: 'Normal', 
      value: '14.2', 
      unit: 'g/dL',
      numericValue: 14.2,
      trend: 'stable', 
      doctor: 'Dr. Sarah Smith',
      description: 'A complete blood count (CBC) is a blood test used to evaluate your overall health and detect a wide range of disorders, including anemia, infection and leukemia.',
      normalRange: '13.5 - 17.5 g/dL',
      history: [
        { date: 'Oct 2025', value: 14.0 },
        { date: 'Nov 2025', value: 14.1 },
        { date: 'Dec 2025', value: 14.3 },
        { date: 'Jan 2026', value: 14.2 },
        { date: 'Feb 2026', value: 14.2 },
        { date: 'Mar 2026', value: 14.2 },
      ]
    },
    { 
      id: 2, 
      name: 'Glucose (Fasting)', 
      category: 'Biochemistry', 
      date: 'Mar 10, 2026', 
      status: 'Attention', 
      value: '105', 
      unit: 'mg/dL',
      numericValue: 105,
      trend: 'up', 
      doctor: 'Dr. Sarah Smith',
      description: 'The fasting blood sugar test measures the amount of glucose (sugar) in your blood after you haven\'t eaten for at least 8 hours.',
      normalRange: '70 - 99 mg/dL',
      history: [
        { date: 'Oct 2025', value: 92 },
        { date: 'Nov 2025', value: 94 },
        { date: 'Dec 2025', value: 98 },
        { date: 'Jan 2026', value: 97 },
        { date: 'Feb 2026', value: 102 },
        { date: 'Mar 2026', value: 105 },
      ]
    },
    { 
      id: 3, 
      name: 'LDL Cholesterol', 
      category: 'Biochemistry', 
      date: 'Feb 15, 2026', 
      status: 'Normal', 
      value: '90', 
      unit: 'mg/dL',
      numericValue: 90,
      trend: 'down', 
      doctor: 'Dr. Sarah Smith',
      description: 'Low-density lipoprotein (LDL) cholesterol is often called "bad" cholesterol because it collects in the walls of your blood vessels.',
      normalRange: '< 100 mg/dL',
      history: [
        { date: 'Oct 2025', value: 115 },
        { date: 'Nov 2025', value: 110 },
        { date: 'Dec 2025', value: 105 },
        { date: 'Jan 2026', value: 98 },
        { date: 'Feb 2026', value: 90 },
      ]
    },
    { 
      id: 4, 
      name: 'Thyroid Stimulating Hormone', 
      category: 'Endocrinology', 
      date: 'Jan 20, 2026', 
      status: 'Normal', 
      value: '2.1', 
      unit: 'mIU/L',
      numericValue: 2.1,
      trend: 'stable', 
      doctor: 'Dr. Sarah Smith',
      description: 'A TSH test is a blood test that measures this hormone. TSH levels that are too high or too low can mean your thyroid isn\'t working correctly.',
      normalRange: '0.4 - 4.0 mIU/L',
      history: [
        { date: 'Aug 2025', value: 2.3 },
        { date: 'Oct 2025', value: 2.2 },
        { date: 'Jan 2026', value: 2.1 },
      ]
    },
    { 
      id: 5, 
      name: 'Vitamin D (25-OH)', 
      category: 'Nutrition', 
      date: 'Jan 20, 2026', 
      status: 'Critical', 
      value: '18', 
      unit: 'ng/mL',
      numericValue: 18,
      trend: 'down', 
      doctor: 'Dr. Sarah Smith',
      description: 'Vitamin D is a nutrient your body needs for building and maintaining healthy bones. This test measures the level of vitamin D in your blood.',
      normalRange: '30 - 100 ng/mL',
      history: [
        { date: 'Aug 2025', value: 32 },
        { date: 'Oct 2025', value: 28 },
        { date: 'Jan 2026', value: 18 },
      ]
    },
    { 
      id: 6, 
      name: 'Hemoglobin A1c', 
      category: 'Endocrinology', 
      date: 'Mar 10, 2026', 
      status: 'Normal', 
      value: '5.4', 
      unit: '%',
      numericValue: 5.4,
      trend: 'stable', 
      doctor: 'Dr. Sarah Smith',
      description: 'The hemoglobin A1c test measures your average blood sugar levels over the past 3 months. It\'s one of the commonly used tests to diagnose prediabetes and diabetes.',
      normalRange: '4.0 - 5.6 %',
      history: [
        { date: 'Sep 2025', value: 5.6 },
        { date: 'Dec 2025', value: 5.5 },
        { date: 'Mar 2026', value: 5.4 },
      ]
    },
    { 
      id: 7, 
      name: 'Creatinine', 
      category: 'Renal', 
      date: 'Mar 10, 2026', 
      status: 'Normal', 
      value: '0.9', 
      unit: 'mg/dL',
      numericValue: 0.9,
      trend: 'stable', 
      doctor: 'Dr. Sarah Smith',
      description: 'Creatinine is a waste product that comes from the normal wear and tear on muscles of the body. This test shows how well your kidneys are working.',
      normalRange: '0.7 - 1.3 mg/dL',
      history: [
        { date: 'Sep 2025', value: 0.8 },
        { date: 'Dec 2025', value: 0.9 },
        { date: 'Mar 2026', value: 0.9 },
      ]
    },
  ];

  const filteredLabs = labs.filter(lab => {
    const matchesSearch = lab.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || lab.status.toLowerCase() === activeFilter;
    return matchesSearch && matchesFilter;
  });

  if (selectedLab) {
    return (
      <div className="space-y-6 pb-10 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setSelectedLab(null)}
            className="flex items-center gap-2 text-gray-500 font-bold text-sm hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Reports
          </button>
          <button className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-colors">
            <Download className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-black/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-16 h-16 rounded-3xl flex items-center justify-center",
                selectedLab.status === 'Normal' ? "bg-emerald-50 text-emerald-600" :
                selectedLab.status === 'Attention' ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
              )}>
                <Beaker className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedLab.name}</h2>
                <div className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Last tested: {selectedLab.date}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-4xl font-black text-gray-900">
                {selectedLab.value} <span className="text-lg font-medium text-gray-400">{selectedLab.unit}</span>
              </div>
              <div className={cn(
                "mt-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider",
                selectedLab.status === 'Normal' ? "bg-emerald-100 text-emerald-700" :
                selectedLab.status === 'Attention' ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
              )}>
                {selectedLab.status}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Visualization */}
              <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Historical Trend
                  </h3>
                  <div className="text-xs font-bold text-blue-600">6 Month View</div>
                </div>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={selectedLab.history}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fill: '#9ca3af'}}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fill: '#9ca3af'}}
                        dx={-10}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontWeight: 'bold', color: '#1f2937' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  About this test
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {selectedLab.description}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Reference Range */}
              <div className="bg-blue-50/50 rounded-[2rem] p-6 border border-blue-100">
                <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-4">Reference Range</h3>
                <div className="text-2xl font-black text-blue-900 mb-1">{selectedLab.normalRange}</div>
                
                {/* Visual Range Indicator */}
                <div className="mt-4 relative h-4 bg-blue-100 rounded-full overflow-hidden">
                  <div className="absolute inset-y-0 left-[20%] right-[20%] bg-emerald-400/30 border-x border-emerald-400/50" />
                  <div 
                    className="absolute top-0 w-1 h-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)] transition-all duration-1000 ease-out"
                    style={{ left: `${Math.min(Math.max((selectedLab.numericValue / 20) * 100, 5), 95)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-[10px] font-bold text-blue-400 uppercase tracking-tighter">
                  <span>Low</span>
                  <span className="text-emerald-600">Normal Range</span>
                  <span>High</span>
                </div>
                
                <p className="mt-4 text-xs text-blue-600 opacity-70">Results within the green zone are typically considered normal for your demographic.</p>
              </div>

              {/* Doctor Info */}
              <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Ordering Physician</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">{selectedLab.doctor}</div>
                    <div className="text-[10px] text-gray-400">General Practitioner</div>
                  </div>
                </div>
                <button className="w-full mt-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:border-blue-200 hover:text-blue-600 transition-all">
                  Message Doctor
                </button>
              </div>

              {/* AI Insight */}
              <div className="bg-gray-900 rounded-[2rem] p-6 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-bold">AI Analysis</h3>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {selectedLab.status === 'Normal' 
                    ? "Your results are stable and within the optimal range. No immediate action is required."
                    : selectedLab.status === 'Attention'
                    ? "Your levels are slightly elevated. This may be due to recent dietary changes. Monitor and retest in 3 months."
                    : "Your levels are significantly below the target range. We recommend immediate consultation to discuss supplementation."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Beaker className="w-6 h-6 text-blue-600" />
          Extensive Lab Reports
        </h2>
        <button className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-colors">
          <Download className="w-5 h-5" />
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-black/5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          />
        </div>
        {['all', 'normal', 'attention', 'critical'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              "px-6 py-3 rounded-2xl text-sm font-bold capitalize whitespace-nowrap transition-all",
              activeFilter === filter 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                : "bg-white text-gray-500 border border-black/5 hover:bg-gray-50"
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Lab List */}
      <div className="space-y-4">
        {filteredLabs.map((lab) => (
          <div 
            key={lab.id}
            onClick={() => setSelectedLab(lab)}
            className="bg-white rounded-[2rem] p-6 shadow-sm border border-black/5 hover:border-blue-200 transition-all group cursor-pointer active:scale-[0.98]"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center",
                  lab.status === 'Normal' ? "bg-emerald-50 text-emerald-600" :
                  lab.status === 'Attention' ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                )}>
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{lab.name}</h3>
                  <div className="text-xs text-gray-400 mt-0.5">{lab.category} • {lab.date}</div>
                </div>
              </div>
              <div className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider",
                lab.status === 'Normal' ? "bg-emerald-100 text-emerald-700" :
                lab.status === 'Attention' ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
              )}>
                {lab.status}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-50">
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Result</div>
                <div className="text-sm font-black text-gray-900">{lab.value} <span className="text-[10px] font-medium text-gray-400">{lab.unit}</span></div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trend</div>
                <div className={cn(
                  "text-sm font-black flex items-center gap-1",
                  lab.trend === 'up' ? "text-amber-600" :
                  lab.trend === 'down' ? "text-blue-600" : "text-emerald-600"
                )}>
                  <Activity className="w-3 h-3" />
                  <span className="capitalize">{lab.trend}</span>
                </div>
              </div>
              <div className="text-right">
                <button className="p-2 bg-gray-50 text-gray-400 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredLabs.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No reports found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Insights Section */}
      <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold">AI Clinical Insights</h3>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            Your Vitamin D levels have dropped significantly since your last test in October. 
            This may be contributing to your reported fatigue. We recommend a daily supplement of 2000 IU.
          </p>
          <button className="mt-6 px-6 py-3 bg-white text-gray-900 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-colors">
            Discuss with Doctor
          </button>
        </div>
      </div>
    </div>
  );
}
