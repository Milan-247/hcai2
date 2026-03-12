import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockApi } from '../services/mockApi';
import { 
  ArrowLeft, 
  Activity, 
  Calendar, 
  Clock, 
  FileText, 
  Heart, 
  Thermometer, 
  AlertCircle,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { cn } from '../utils';

interface PatientDetailProps {
  patientId: string;
  onBack: () => void;
}

export default function PatientDetail({ patientId, onBack }: PatientDetailProps) {
  const { data: patients = [] } = useQuery({
    queryKey: ['patients'],
    queryFn: () => mockApi.getPatients()
  });

  const patient = patients.find(p => p.id === patientId);

  if (!patient) return null;

  const medicalHistory = [
    { date: 'Jan 15, 2026', event: 'Annual Physical Exam', status: 'Completed', provider: 'Dr. Arjun K' },
    { date: 'Nov 10, 2025', event: 'Flu Vaccination', status: 'Completed', provider: 'Nurse Sarah' },
    { date: 'Aug 22, 2025', event: 'Sprained Ankle Treatment', status: 'Resolved', provider: 'Dr. Arjun K' },
  ];

  const currentVitals = [
    { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', status: 'normal' },
    { label: 'Heart Rate', value: '72', unit: 'bpm', status: 'normal' },
    { label: 'Temperature', value: '98.6', unit: '°F', status: 'normal' },
    { label: 'SpO2', value: '98', unit: '%', status: 'normal' },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 bg-white rounded-xl border border-black/5 shadow-sm hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Patient Profile</h2>
      </div>

      {/* Patient Overview Card */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-black/5 flex flex-col md:flex-row items-center gap-8">
        <div className="w-24 h-24 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 font-bold text-3xl shrink-0">
          {patient.firstName[0]}{patient.lastName[0]}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-2xl font-bold text-gray-900">{patient.firstName} {patient.lastName}</h3>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {patient.birthDate}</span>
            <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> ID: {patient.id.slice(0, 8)}</span>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">O+ Positive</span>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">Stable Status</span>
          </div>
        </div>
      </div>

      {/* Vitals Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {currentVitals.map((vital, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-black/5 text-center">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{vital.label}</div>
            <div className="text-xl font-black text-gray-900">{vital.value}</div>
            <div className="text-[10px] font-bold text-gray-400">{vital.unit}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Medical History */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-black/5">
          <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Medical History
          </h4>
          <div className="space-y-6">
            {medicalHistory.map((item, i) => (
              <div key={i} className="flex gap-4 relative">
                {i !== medicalHistory.length - 1 && (
                  <div className="absolute left-5 top-10 bottom-0 w-px bg-gray-100" />
                )}
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 z-10">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">{item.event}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{item.date} • {item.provider}</div>
                  <span className="inline-block mt-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-md">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Triage & Status */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-black/5">
          <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            Recent Triage
          </h4>
          <div className="p-6 rounded-3xl bg-emerald-50/50 border border-emerald-100">
            <div className="flex justify-between items-start mb-4">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-widest rounded-full">
                Low Urgency
              </span>
              <span className="text-[10px] font-bold text-gray-400">Mar 05, 2026</span>
            </div>
            <div className="font-bold text-gray-900">Mild Cough & Fatigue</div>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              Patient reported mild symptoms. Vitals were within normal range. Recommended rest and hydration.
            </p>
            <div className="mt-6 pt-6 border-t border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-200" />
                <div className="text-xs">
                  <div className="font-bold text-gray-900">Dr. Arjun K</div>
                  <div className="text-gray-500">Reviewing Physician</div>
                </div>
              </div>
              <button className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                Full Report <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between p-4 rounded-2xl border border-black/5">
              <span className="text-sm font-medium text-gray-600">Allergies</span>
              <span className={cn(
                "text-sm font-bold",
                patient.allergies.length > 0 ? "text-red-600" : "text-emerald-600"
              )}>
                {patient.allergies.length > 0 ? patient.allergies.join(', ') : 'None Reported'}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl border border-black/5">
              <span className="text-sm font-medium text-gray-600">Medications</span>
              <span className={cn(
                "text-sm font-bold",
                patient.medications.length > 0 ? "text-blue-600" : "text-gray-400"
              )}>
                {patient.medications.length > 0 ? `${patient.medications.length} Active` : 'None'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
