import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockApi } from '../services/mockApi';
import { Search, User, Phone, Mail, ChevronRight, Filter } from 'lucide-react';
import { cn } from '../utils';

interface PatientsListProps {
  onSelectPatient: (id: string) => void;
}

export default function PatientsList({ onSelectPatient }: PatientsListProps) {
  const [search, setSearch] = React.useState('');
  const { data: patients = [] } = useQuery({
    queryKey: ['patients'],
    queryFn: () => mockApi.getPatients()
  });

  const filteredPatients = patients.filter(p => 
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Patient Manager</h2>
        <button className="p-2 bg-white rounded-xl border border-black/5 shadow-sm">
          <Filter className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-[2rem] border border-black/5 bg-white shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
        />
      </div>

      <div className="space-y-4">
        {filteredPatients.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-12 text-center border border-black/5">
            <User className="w-16 h-16 mx-auto mb-4 text-gray-100" />
            <p className="text-gray-500">No patients found matching your search.</p>
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <button 
              key={patient.id} 
              onClick={() => onSelectPatient(patient.id)}
              className="w-full bg-white rounded-[2.5rem] p-6 shadow-sm border border-black/5 flex items-center gap-4 group hover:border-emerald-200 transition-colors text-left"
            >
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 font-bold text-xl">
                {patient.firstName[0]}{patient.lastName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-900 truncate">{patient.firstName} {patient.lastName}</div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{patient.email}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Phone className="w-3 h-3" />
                    <span>{patient.phone}</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-500 transition-colors" />
            </button>
          ))
        )}
      </div>
    </div>
  );
}
