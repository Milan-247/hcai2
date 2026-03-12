import React from 'react';
import { motion } from 'motion/react';
import { 
  Home,
  Bell,
  MessageSquare,
  User as UserIcon,
  Activity,
  WifiOff,
  CloudCheck,
  Users,
  Calendar,
  ClipboardList
} from 'lucide-react';
import { cn } from '../utils';
import { strings } from '../i18n/strings';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: User;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  badge?: number;
  isAvatar?: boolean;
}

const PATIENT_NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'notifications', label: 'Notifications', icon: Bell, badge: 487 },
  { id: 'support', label: 'Support', icon: MessageSquare },
  { id: 'profile', label: 'My Profile', icon: UserIcon, isAvatar: true },
];

const CLINICIAN_NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Overview', icon: Home },
  { id: 'patients', label: 'Patients', icon: Users },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'triage', label: 'AI Triage', icon: ClipboardList },
  { id: 'profile', label: 'Profile', icon: UserIcon, isAvatar: true },
];

export default function Layout({ children, activeTab, onTabChange, user }: LayoutProps) {
  const [isOffline, setIsOffline] = React.useState(!navigator.onLine);

  const navItems = user.role === 'clinician' ? CLINICIAN_NAV_ITEMS : PATIENT_NAV_ITEMS;

  React.useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#fdfdfd] flex flex-col pb-20">
      {/* Offline Banner */}
      {isOffline && (
        <div className="bg-gray-900 text-white text-[10px] font-bold py-1 px-4 flex items-center justify-center gap-2 sticky top-0 z-[60]">
          <WifiOff className="w-3 h-3" />
          OFFLINE MODE • DATA SAVED LOCALLY
        </div>
      )}

      {/* Top Header */}
      <header className="bg-white border-b border-black/5 p-4 flex items-center justify-between sticky top-0 z-50 h-16">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border border-gray-100 rounded-full flex items-center justify-center overflow-hidden bg-white shadow-sm">
            <Activity className="text-emerald-600 w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-gray-800 tracking-tight leading-none">{strings.common.appName}</span>
            {!isOffline && (
              <div className="flex items-center gap-1 mt-0.5">
                <CloudCheck className="w-2.5 h-2.5 text-emerald-500" />
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Synced</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-y-auto">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          {children}
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-black/5 px-6 py-3 flex items-center justify-between z-50">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 transition-all relative",
              activeTab === item.id ? "text-gray-900" : "text-gray-400"
            )}
          >
            <div className="relative">
              {item.isAvatar ? (
                <div className="w-7 h-7 rounded-full overflow-hidden border border-gray-200">
                  <img 
                    src={user.avatar} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <item.icon className={cn("w-6 h-6", activeTab === item.id ? "fill-current" : "")} />
              )}
              {item.badge && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

