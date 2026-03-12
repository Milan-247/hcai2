/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MessageSquare, Activity } from 'lucide-react';
import Layout from './components/Layout';
import RegistrationForm from './components/RegistrationForm';
import Scheduling from './components/Scheduling';
import Triage from './components/Triage';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import PatientsList from './components/PatientsList';
import Announcements from './components/Announcements';
import PatientDetail from './components/PatientDetail';
import LabResults from './components/LabResults';
import LoginPage from './components/LoginPage';
import { User } from './types';

const queryClient = new QueryClient();

export default function App() {
  const [user, setUser] = React.useState<User | null>(null);
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [selectedPatientId, setSelectedPatientId] = React.useState<string | null>(null);

  if (!user) {
    return (
      <QueryClientProvider client={queryClient}>
        <LoginPage onLogin={setUser} />
      </QueryClientProvider>
    );
  }

  const renderContent = () => {
    if (selectedPatientId && activeTab === 'patients') {
      return <PatientDetail patientId={selectedPatientId} onBack={() => setSelectedPatientId(null)} />;
    }

    switch (activeTab) {
      case 'registration':
        return <RegistrationForm />;
      case 'scheduling':
      case 'schedule':
        return <Scheduling />;
      case 'triage':
        return <Triage />;
      case 'diagnostics':
        return <LabResults />;
      case 'dashboard':
        return <Dashboard onTabChange={handleTabChange} user={user} />;
      case 'profile':
        return <Profile user={user} onUpdateUser={setUser} onLogout={() => setUser(null)} />;
      case 'patients':
        return <PatientsList onSelectPatient={setSelectedPatientId} />;
      case 'announcements':
      case 'notifications':
        return <Announcements />;
      case 'support':
        return (
          <div className="bg-white rounded-[2.5rem] p-12 text-center border border-black/5">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-emerald-100" />
            <h2 className="text-xl font-bold text-gray-900">Support Center</h2>
            <p className="text-gray-500 mt-2">Our team is here to help you 24/7.</p>
            <button className="mt-8 px-8 py-3 bg-emerald-600 text-white font-bold rounded-2xl">Start Chat</button>
          </div>
        );
      default:
        return <Dashboard onTabChange={handleTabChange} user={user} />;
    }
  };

  const handleTabChange = (tab: string) => {
    if (tab.startsWith('patient:')) {
      const id = tab.split(':')[1];
      setSelectedPatientId(id);
      setActiveTab('patients');
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Layout activeTab={activeTab} onTabChange={handleTabChange} user={user}>
        {renderContent()}
      </Layout>
    </QueryClientProvider>
  );
}

