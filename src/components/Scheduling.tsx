import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockApi } from '../services/mockApi';
import { strings } from '../i18n/strings';
import { cn, formatDate } from '../utils';
import { Search, Calendar, Clock, User, MapPin, CheckCircle2, XCircle } from 'lucide-react';
import { Provider, Patient } from '../types';

export default function Scheduling() {
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState('');
  const [selectedProvider, setSelectedProvider] = React.useState<Provider | null>(null);
  const [selectedSlot, setSelectedSlot] = React.useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = React.useState<string>('');
  const [reason, setReason] = React.useState('');

  const { data: providers = [] } = useQuery({
    queryKey: ['providers', search],
    queryFn: () => mockApi.getProviders(search)
  });

  const { data: patients = [] } = useQuery({
    queryKey: ['patients'],
    queryFn: () => mockApi.getPatients()
  });

  const { data: appointments = [] } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => mockApi.getAppointments()
  });

  const bookMutation = useMutation({
    mutationFn: (data: any) => mockApi.createAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setSelectedProvider(null);
      setSelectedSlot(null);
      setReason('');
      alert("Appointment booked successfully!");
    }
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => mockApi.updateAppointmentStatus(id, 'Cancelled'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appointments'] })
  });

  const handleBook = () => {
    if (!selectedProvider || !selectedSlot || !selectedPatient || !reason) return;
    bookMutation.mutate({
      patientId: selectedPatient,
      providerId: selectedProvider.id,
      start: selectedSlot,
      reason,
      channel: 'in_person'
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Search & Select Provider */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-emerald-600" />
              {strings.scheduling.title}
            </h3>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text"
                placeholder={strings.scheduling.searchProvider}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              />
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {providers.map(provider => (
                <button
                  key={provider.id}
                  onClick={() => {
                    setSelectedProvider(provider);
                    setSelectedSlot(null);
                  }}
                  className={cn(
                    "text-left p-4 rounded-2xl border transition-all",
                    selectedProvider?.id === provider.id 
                      ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500" 
                      : "border-gray-100 hover:border-emerald-200 hover:bg-gray-50"
                  )}
                >
                  <div className="font-bold text-gray-900">{provider.name}</div>
                  <div className="text-sm text-emerald-600 font-medium">{provider.specialty}</div>
                  <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" />
                    {provider.locations.join(', ')}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedProvider && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 animate-in fade-in slide-in-from-top-4">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                {strings.scheduling.selectSlot}
              </h3>
              <div className="flex flex-wrap gap-3">
                {selectedProvider.slots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={cn(
                      "px-4 py-2 rounded-xl border text-sm font-medium transition-all",
                      selectedSlot === slot 
                        ? "bg-emerald-600 text-white border-emerald-600" 
                        : "border-gray-200 text-gray-600 hover:border-emerald-500 hover:text-emerald-600"
                    )}
                  >
                    {new Date(slot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </button>
                ))}
              </div>

              <div className="mt-8 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Select Patient</label>
                    <select 
                      value={selectedPatient}
                      onChange={(e) => setSelectedPatient(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 outline-none"
                    >
                      <option value="">Choose a patient...</option>
                      {patients.map(p => (
                        <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">{strings.scheduling.reason}</label>
                    <input 
                      type="text"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="e.g. Annual checkup"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 outline-none"
                    />
                  </div>
                </div>
                <button
                  onClick={handleBook}
                  disabled={!selectedSlot || !selectedPatient || !reason}
                  className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg shadow-emerald-600/20"
                >
                  {strings.scheduling.book}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Upcoming Appointments */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 h-full">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              {strings.scheduling.upcoming}
            </h3>
            
            <div className="space-y-4">
              {appointments.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <Calendar className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p>{strings.scheduling.noAppointments}</p>
                </div>
              ) : (
                appointments.map(appt => {
                  const provider = providers.find(p => p.id === appt.providerId);
                  const patient = patients.find(p => p.id === appt.patientId);
                  return (
                    <div key={appt.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/30">
                      <div className="flex justify-between items-start mb-2">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          appt.status === 'Scheduled' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                        )}>
                          {appt.status}
                        </span>
                        <span className="text-xs text-gray-400">{formatDate(appt.start)}</span>
                      </div>
                      <div className="font-bold text-gray-900">{provider?.name || 'Unknown Provider'}</div>
                      <div className="text-sm text-gray-600">Patient: {patient?.firstName} {patient?.lastName}</div>
                      <div className="text-xs text-gray-500 mt-1 italic">"{appt.reason}"</div>
                      
                      {appt.status === 'Scheduled' && (
                        <div className="mt-4 flex gap-2">
                          <button 
                            onClick={() => cancelMutation.mutate(appt.id)}
                            className="flex-1 py-2 text-xs font-bold text-red-600 border border-red-100 rounded-xl hover:bg-red-50 transition-colors"
                          >
                            {strings.scheduling.cancel}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
