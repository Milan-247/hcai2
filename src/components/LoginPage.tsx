import React from 'react';
import { motion } from 'motion/react';
import { Activity, User as UserIcon, Stethoscope, Award, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '../utils';
import { UserRole, User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [role, setRole] = React.useState<UserRole>('patient');
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [regNumber, setRegNumber] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login
    setTimeout(() => {
      const user: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: name || (role === 'patient' ? 'Milan Pullapalli' : 'Dr. Sarah Smith'),
        email: email || 'user@example.com',
        role,
        registrationNumber: role !== 'patient' ? regNumber : undefined,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name || 'Milan'}`,
        phone: '+91 98765 43210',
        bloodGroup: 'O+',
        weight: '72kg',
        allergies: ['Penicillin', 'Peanuts'],
        medications: ['Lisinopril (10mg)'],
      };
      onLogin(user);
      setIsLoading(false);
    }, 1500);
  };

  const roles: { id: UserRole; label: string; icon: any; description: string }[] = [
    { 
      id: 'patient', 
      label: 'Patient', 
      icon: UserIcon, 
      description: 'Access your health records and AI triage.' 
    },
    { 
      id: 'clinician', 
      label: 'Physician/Expert', 
      icon: Stethoscope, 
      description: 'Manage patients and clinical workflows.' 
    },
  ];

  return (
    <div className="min-h-screen bg-[#fdfdfd] flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        {/* Logo */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-16 h-16 bg-emerald-600 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-emerald-600/20">
            <Activity className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">HealthCore AI</h1>
          <p className="text-gray-500 font-medium">Next-generation clinical intelligence</p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-black/5 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-sm text-gray-500">Please select your role and sign in</p>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all",
                  role === r.id 
                    ? "border-emerald-600 bg-emerald-50 text-emerald-600 shadow-sm" 
                    : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200"
                )}
              >
                <r.icon className="w-6 h-6" />
                <span className="text-[10px] font-bold uppercase tracking-wider">{r.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@hospital.com"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all text-sm"
              />
            </div>

            {role !== 'patient' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-1.5"
              >
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Registration Number</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                    placeholder="Unique License ID"
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all text-sm"
                  />
                  <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                </div>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-emerald-600/20"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400">
          By signing in, you agree to our <span className="text-emerald-600 font-bold">Terms of Service</span> and <span className="text-emerald-600 font-bold">Privacy Policy</span>.
        </p>
      </motion.div>
    </div>
  );
}
