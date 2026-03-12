import React from 'react';
import { Megaphone, Bell, Calendar, Info, ChevronRight } from 'lucide-react';
import { cn } from '../utils';

export default function Announcements() {
  const announcements = [
    {
      id: 1,
      title: 'New AI Model Update',
      content: 'We have updated the triage model to version 2.4, improving accuracy for pediatric cases.',
      date: 'Today, 09:30 AM',
      type: 'update',
      icon: Bell,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      id: 2,
      title: 'Hospital Staff Meeting',
      content: 'Monthly staff meeting scheduled for Friday at 4:00 PM in the main conference hall.',
      date: 'Yesterday',
      type: 'event',
      icon: Calendar,
      color: 'bg-purple-50 text-purple-600'
    },
    {
      id: 3,
      title: 'System Maintenance',
      content: 'The patient portal will be offline for scheduled maintenance this Sunday from 2 AM to 4 AM.',
      date: '2 days ago',
      type: 'info',
      icon: Info,
      color: 'bg-amber-50 text-amber-600'
    }
  ];

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center">
          <Megaphone className="text-cyan-600 w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Announcements</h2>
      </div>

      <div className="space-y-4">
        {announcements.map((item) => (
          <div key={item.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-black/5 relative overflow-hidden group">
            <div className={cn("absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-5 transition-transform group-hover:scale-110", item.color)} />
            
            <div className="flex items-start gap-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", item.color)}>
                <item.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-900">{item.title}</h3>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.date}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{item.content}</p>
                <button className="mt-4 text-xs font-bold text-emerald-600 flex items-center gap-1 hover:gap-2 transition-all">
                  Read More <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
