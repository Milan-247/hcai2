import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockApi } from '../services/mockApi';
import { strings } from '../i18n/strings';
import { cn } from '../utils';
import { 
  UserPlus, 
  Calendar, 
  Stethoscope, 
  Users,
  Clock,
  Megaphone,
  CreditCard,
  ChevronRight,
  CheckCircle2,
  Loader2,
  AlertCircle,
  TrendingUp,
  Heart,
  Activity,
  ClipboardList
} from 'lucide-react';

import { User } from '../types';

interface DashboardProps {
  onTabChange: (tab: string) => void;
  user: User;
}

export default function Dashboard({ onTabChange, user }: DashboardProps) {
  const [isPaying, setIsPaying] = React.useState(false);
  const [paymentSuccess, setPaymentSuccess] = React.useState(false);
  const [feedback, setFeedback] = React.useState<{ title: string; subtitle: string } | null>(null);

  const showFeedback = (title: string, subtitle: string) => {
    setFeedback({ title, subtitle });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleAction = (id: string) => {
    if (id === 'billing') {
      setIsPaying(true);
      setTimeout(() => {
        setIsPaying(false);
        setPaymentSuccess(true);
        setTimeout(() => setPaymentSuccess(false), 3000);
      }, 2000);
    } else if (id === 'diagnostics' || id === 'lab') {
      onTabChange('diagnostics');
    } else if (id === 'support') {
      onTabChange('support');
    } else {
      onTabChange(id);
    }
  };

  const { data: appointments = [] } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => mockApi.getAppointments()
  });

  const { data: patients = [] } = useQuery({
    queryKey: ['patients'],
    queryFn: () => mockApi.getPatients()
  });

  const isClinician = user.role === 'clinician';

  const clinicianActions = [
    { id: 'patients', label: 'Patient Records', icon: Users, color: 'bg-blue-50 text-blue-600' },
    { id: 'triage', label: 'AI Triage', icon: Stethoscope, color: 'bg-emerald-50 text-emerald-600' },
    { id: 'schedule', label: 'Clinical Schedule', icon: Calendar, color: 'bg-purple-50 text-purple-600' },
    { id: 'diagnostics', label: 'Lab Results', icon: Activity, color: 'bg-amber-50 text-amber-600' },
  ];

  const patientActions = [
    { id: 'triage', label: 'Check Symptoms', icon: Stethoscope, color: 'bg-emerald-50 text-emerald-600' },
    { id: 'scheduling', label: 'Book Visit', icon: Calendar, color: 'bg-purple-50 text-purple-600' },
    { id: 'billing', label: 'Pay Bills', icon: CreditCard, color: 'bg-amber-50 text-amber-600' },
    { id: 'support', label: 'Get Help', icon: Megaphone, color: 'bg-blue-50 text-blue-600' },
  ];

  const quickActions = isClinician ? clinicianActions : patientActions;

  return (
    <div className="space-y-8 pb-10">
      {/* Greeting */}
      <div className="mt-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-gray-800">
            Welcome Back, <span className="text-blue-600 font-bold">{user.name}</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isClinician ? "Here's what's happening in your clinic today." : "Manage your health and upcoming visits."}
          </p>
        </div>
      </div>

      {/* Payment & Feedback UI */}
      {isPaying && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-xs text-center space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Processing Payment</h3>
            <p className="text-sm text-gray-500 italic">Connecting to secure gateway...</p>
          </div>
        </div>
      )}

      {paymentSuccess && (
        <div className="fixed bottom-24 left-4 right-4 z-[100] animate-in slide-in-from-bottom-10 duration-500">
          <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-xl flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6" />
            <div className="flex-1">
              <div className="font-bold">Payment Successful</div>
              <div className="text-xs opacity-90">Transaction ID: #TXN-9942-A</div>
            </div>
          </div>
        </div>
      )}

      {feedback && (
        <div className="fixed bottom-24 left-4 right-4 z-[100] animate-in slide-in-from-bottom-10 duration-500">
          <div className="bg-gray-900 text-white p-4 rounded-2xl shadow-xl flex items-center gap-3">
            <Activity className="w-6 h-6 text-emerald-400" />
            <div className="flex-1">
              <div className="font-bold">{feedback.title}</div>
              <div className="text-xs opacity-90">{feedback.subtitle}</div>
            </div>
          </div>
        </div>
      )}

      {/* Urgent Alerts / Priority Section */}
      {isClinician ? (
        <section className="bg-red-50 border border-red-100 rounded-[2rem] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-red-900 uppercase tracking-wider flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Urgent Triage (2)
            </h3>
            <button 
              onClick={() => onTabChange('triage')}
              className="text-[10px] font-bold text-red-600 uppercase"
            >
              View All
            </button>
          </div>
          <div className="space-y-2">
            <button 
              onClick={() => onTabChange('triage')}
              className="w-full bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-red-100 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600 font-bold">JD</div>
                <div>
                  <div className="text-sm font-bold text-gray-900">John Doe</div>
                  <div className="text-[10px] text-red-500 font-medium">Chest Pain • 15m ago</div>
                </div>
              </div>
              <div className="px-4 py-2 bg-red-600 text-white text-[10px] font-black rounded-xl uppercase">Review</div>
            </button>
          </div>
        </section>
      ) : (
        <button 
          onClick={() => onTabChange('scheduling')}
          className="w-full bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-lg shadow-blue-600/20 relative overflow-hidden text-left group"
        >
          <div className="relative z-10">
            <div className="text-sm opacity-80 font-medium">Upcoming Appointment</div>
            <div className="mt-2 flex items-end justify-between">
              <div>
                <div className="text-3xl font-black">Tomorrow, 10:30 AM</div>
                <div className="text-sm opacity-90 mt-1">Dr. Sarah Smith • General Checkup</div>
              </div>
              <div className="bg-white/20 p-3 rounded-full group-hover:bg-white/30 transition-colors">
                <ChevronRight className="w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <Calendar className="w-32 h-32" />
          </div>
        </button>
      )}

      {/* Quick Actions Card */}
      <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-black/5">
        <h2 className="text-xl font-bold text-gray-900 mb-8">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleAction(action.id)}
              className="flex flex-col items-center gap-3 group"
            >
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-active:scale-95",
                action.color
              )}>
                <action.icon className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-bold text-gray-500 text-center leading-tight uppercase tracking-wider">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Stats / Secondary Info */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => showFeedback(isClinician ? "Appointment Insights" : "Health Score Analysis", "Generating detailed report...")}
          className="bg-emerald-50 border border-emerald-100 rounded-[2rem] p-6 text-left active:scale-[0.98] transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <Heart className="w-5 h-5 text-emerald-600" />
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-900">{isClinician ? appointments.length : "98"}</div>
          <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
            {isClinician ? "Total Visits" : "Health Score"}
          </div>
        </button>
        <button 
          onClick={() => showFeedback(isClinician ? "Efficiency Metrics" : "Medication Tracker", "Opening detailed view...")}
          className="bg-purple-50 border border-purple-100 rounded-[2rem] p-6 text-left active:scale-[0.98] transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-900">{isClinician ? "4.2h" : "2"}</div>
          <div className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">
            {isClinician ? "Avg Wait Time" : "Active Meds"}
          </div>
        </button>
      </div>

      {/* Recent Activity Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-bold text-gray-900">
            {isClinician ? "Clinical Tasks" : "Recent Activity"}
          </h2>
          <button 
            onClick={() => onTabChange(isClinician ? 'patients' : 'notifications')}
            className="text-sm font-bold text-blue-600"
          >
            {isClinician ? "View All" : "View All"}
          </button>
        </div>
        <div className="space-y-3">
          {isClinician ? (
            <>
              <div className="bg-white p-4 rounded-2xl border border-black/5 flex items-center gap-4 hover:border-blue-200 transition-colors">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                  <ClipboardList className="text-amber-600 w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900 text-sm">Review Lab Results</div>
                  <div className="text-[10px] text-gray-400">Patient: John Doe • Critical Flag</div>
                </div>
                <button onClick={() => onTabChange('diagnostics')} className="text-xs font-bold text-blue-600">Review</button>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-black/5 flex items-center gap-4 hover:border-blue-200 transition-colors">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                  <Clock className="text-purple-600 w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900 text-sm">Follow-up Call</div>
                  <div className="text-[10px] text-gray-400">Patient: Sarah Smith • Scheduled for 2:00 PM</div>
                </div>
                <button 
                  onClick={() => showFeedback("Initiating Call", "Connecting to Sarah Smith...")}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Call
                </button>
              </div>
            </>
          ) : (
            <div className="bg-white p-4 rounded-2xl border border-black/5 flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="text-emerald-600 w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-900 text-sm">Triage Completed</div>
                <div className="text-[10px] text-gray-400">Result: Low Risk • 2 hours ago</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Recent Patients Section (Clinician Only) */}
      {isClinician && (
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-gray-900">Recent Patients</h2>
            <button 
              onClick={() => onTabChange('patients')}
              className="text-sm font-bold text-blue-600"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {patients.slice(0, 3).map((patient) => (
              <button 
                key={patient.id}
                onClick={() => onTabChange(`patient:${patient.id}`)}
                className="w-full bg-white p-4 rounded-2xl border border-black/5 flex items-center gap-4 hover:border-blue-200 transition-colors text-left"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold text-sm">
                  {patient.firstName[0]}{patient.lastName[0]}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900 text-sm">{patient.firstName} {patient.lastName}</div>
                  <div className="text-[10px] text-gray-400">Last visit: 2 days ago</div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

