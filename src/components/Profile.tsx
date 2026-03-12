import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  LogOut, 
  Settings,
  ChevronRight,
  FileText,
  Heart,
  Activity,
  Database,
  CheckCircle2,
  Edit2,
  Save,
  X,
  Camera,
  Plus,
  Trash2
} from 'lucide-react';
import { cn } from '../utils';
import { User } from '../types';

interface ProfileProps {
  user: User;
  onUpdateUser: (user: User) => void;
  onLogout: () => void;
}

export default function Profile({ user, onUpdateUser, onLogout }: ProfileProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [activeSubView, setActiveSubView] = React.useState<string | null>(null);
  const [editedUser, setEditedUser] = React.useState<User>(user);
  const [newAllergy, setNewAllergy] = React.useState('');
  const [newMedication, setNewMedication] = React.useState('');
  const [feedback, setFeedback] = React.useState<{ title: string; subtitle: string } | null>(null);

  const showFeedback = (title: string, subtitle: string) => {
    setFeedback({ title, subtitle });
    setTimeout(() => setFeedback(null), 3000);
  };

  const profileItems = [
    { id: 'medical', icon: FileText, label: 'Medical Records', color: 'text-blue-600 bg-blue-50' },
    { id: 'privacy', icon: Shield, label: 'Privacy & Security', color: 'text-gray-600 bg-gray-50' },
    { id: 'settings', icon: Settings, label: 'App Settings', color: 'text-amber-600 bg-amber-50' },
  ];

  const handleSave = () => {
    onUpdateUser(editedUser);
    setIsEditing(false);
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setEditedUser({
        ...editedUser,
        allergies: [...(editedUser.allergies || []), newAllergy.trim()]
      });
      setNewAllergy('');
    }
  };

  const removeAllergy = (index: number) => {
    const allergies = [...(editedUser.allergies || [])];
    allergies.splice(index, 1);
    setEditedUser({ ...editedUser, allergies });
  };

  const addMedication = () => {
    if (newMedication.trim()) {
      setEditedUser({
        ...editedUser,
        medications: [...(editedUser.medications || []), newMedication.trim()]
      });
      setNewMedication('');
    }
  };

  const removeMedication = (index: number) => {
    const medications = [...(editedUser.medications || [])];
    medications.splice(index, 1);
    setEditedUser({ ...editedUser, medications });
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Feedback UI */}
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

      <AnimatePresence mode="wait">
        {!activeSubView ? (
          <motion.div
            key="main-profile"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Offline Mode Status */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-[2rem] p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <Database className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-emerald-900">Offline Ready</div>
                <p className="text-xs text-emerald-700 opacity-80">All data is encrypted and stored on your device.</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>

            {/* Profile Header */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-black/5 flex flex-col items-center text-center relative overflow-hidden">
              <button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={cn(
                  "absolute top-6 right-6 p-3 rounded-2xl transition-all",
                  isEditing ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "bg-gray-50 text-gray-400 hover:text-gray-600"
                )}
              >
                {isEditing ? <Save className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
              </button>

              {isEditing && (
                <button 
                  onClick={() => {
                    setIsEditing(false);
                    setEditedUser(user);
                  }}
                  className="absolute top-6 left-6 p-3 rounded-2xl bg-red-50 text-red-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-blue-50 p-1 mb-4 overflow-hidden">
                  <img 
                    src={editedUser.avatar} 
                    alt={editedUser.name} 
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                {isEditing && (
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="text-white w-8 h-8" />
                  </div>
                )}
              </div>

              {isEditing ? (
                <div className="w-full space-y-4">
                  <input 
                    type="text"
                    value={editedUser.name}
                    onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                    className="text-2xl font-bold text-gray-900 text-center w-full bg-gray-50 border border-gray-100 rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                  />
                  <div className="text-blue-600 font-medium text-sm">
                    {editedUser.role === 'patient' ? 'Patient ID: MED-2026-8842' : `Reg No: ${editedUser.registrationNumber}`}
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-blue-600 font-medium">
                    {user.role === 'patient' ? 'Patient ID: MED-2026-8842' : `Reg No: ${user.registrationNumber}`}
                  </p>
                </>
              )}
              
              <div className="grid grid-cols-2 gap-4 w-full mt-8">
                <div className="bg-gray-50 p-4 rounded-2xl">
                  {isEditing ? (
                    <input 
                      type="text"
                      value={editedUser.bloodGroup}
                      onChange={(e) => setEditedUser({ ...editedUser, bloodGroup: e.target.value })}
                      className="text-xl font-bold text-gray-900 text-center w-full bg-white border border-gray-100 rounded-lg py-1"
                    />
                  ) : (
                    <div className="text-xl font-bold text-gray-900">{user.bloodGroup}</div>
                  )}
                  <div className="text-xs text-gray-500">Blood Group</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl">
                  {isEditing ? (
                    <input 
                      type="text"
                      value={editedUser.weight}
                      onChange={(e) => setEditedUser({ ...editedUser, weight: e.target.value })}
                      className="text-xl font-bold text-gray-900 text-center w-full bg-white border border-gray-100 rounded-lg py-1"
                    />
                  ) : (
                    <div className="text-xl font-bold text-gray-900">{user.weight}</div>
                  )}
                  <div className="text-xs text-gray-500">Weight</div>
                </div>
              </div>
            </div>

            {/* User Profile Info Section */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-black/5 space-y-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-blue-600" />
                User Profile
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Last Triage Outcome</div>
                    <div className="text-sm font-bold text-blue-900">Mild Respiratory Infection</div>
                  </div>
                  <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase">Low Risk</div>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-white shadow-sm">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="Dr. Sarah" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Assigned Physician</div>
                    <div className="text-sm font-bold text-gray-900">Dr. Sarah Smith</div>
                  </div>
                  <button 
                    onClick={() => showFeedback("Connecting...", "Initiating secure chat with Dr. Sarah Smith")}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    Contact
                  </button>
                </div>
              </div>

              <button 
                onClick={() => showFeedback("Generating Report", "Compiling your full medical history...")}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-[0.98]"
              >
                <FileText className="w-5 h-5" />
                View Full Report
              </button>
            </div>

            {/* Health Summary */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-black/5">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Health Summary
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-medium text-gray-700">Last Triage</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">Stable</span>
                </div>

                <div className="space-y-3">
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider ml-1">Known Allergies</div>
                  <div className="flex flex-wrap gap-2">
                    <AnimatePresence>
                      {(isEditing ? editedUser.allergies : user.allergies)?.map((allergy, i) => (
                        <motion.div 
                          key={allergy}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="bg-red-50 text-red-600 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2"
                        >
                          {allergy}
                          {isEditing && (
                            <button onClick={() => removeAllergy(i)}>
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {isEditing && (
                      <div className="flex items-center gap-2 w-full mt-2">
                        <input 
                          type="text"
                          value={newAllergy}
                          onChange={(e) => setNewAllergy(e.target.value)}
                          placeholder="Add allergy..."
                          className="flex-1 text-xs bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600/20"
                          onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
                        />
                        <button onClick={addAllergy} className="p-2 bg-red-50 text-red-600 rounded-xl">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider ml-1">Ongoing Medications</div>
                  <div className="space-y-2">
                    <AnimatePresence>
                      {(isEditing ? editedUser.medications : user.medications)?.map((med, i) => (
                        <motion.div 
                          key={med}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="flex items-center justify-between p-3 rounded-xl bg-blue-50 text-blue-600"
                        >
                          <span className="text-xs font-bold">{med}</span>
                          {isEditing && (
                            <button onClick={() => removeMedication(i)}>
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {isEditing && (
                      <div className="flex items-center gap-2 w-full mt-2">
                        <input 
                          type="text"
                          value={newMedication}
                          onChange={(e) => setNewMedication(e.target.value)}
                          placeholder="Add medication..."
                          className="flex-1 text-xs bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                          onKeyPress={(e) => e.key === 'Enter' && addMedication()}
                        />
                        <button onClick={addMedication} className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-black/5 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Mail className="text-blue-600 w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-400">Email</div>
                  {isEditing ? (
                    <input 
                      type="email"
                      value={editedUser.email}
                      onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                      className="text-sm font-medium text-gray-900 w-full bg-transparent border-b border-gray-100 focus:outline-none focus:border-emerald-600"
                    />
                  ) : (
                    <div className="text-sm font-medium text-gray-900">{user.email}</div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <Phone className="text-emerald-600 w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-400">Phone</div>
                  {isEditing ? (
                    <input 
                      type="text"
                      value={editedUser.phone}
                      onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                      className="text-sm font-medium text-gray-900 w-full bg-transparent border-b border-gray-100 focus:outline-none focus:border-emerald-600"
                    />
                  ) : (
                    <div className="text-sm font-medium text-gray-900">{user.phone}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-black/5 space-y-2">
              {profileItems.map((item, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveSubView(item.id)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors group"
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", item.color)}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="flex-1 text-left font-medium text-gray-700">{item.label}</span>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
                </button>
              ))}
              <button 
                onClick={onLogout}
                className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-red-50 transition-colors group"
              >
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                  <LogOut className="text-red-600 w-5 h-5" />
                </div>
                <span className="flex-1 text-left font-medium text-red-600">Logout</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="sub-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <button 
              onClick={() => setActiveSubView(null)}
              className="flex items-center gap-2 text-gray-500 font-bold text-sm mb-4 hover:text-gray-900 transition-colors"
            >
              <X className="w-4 h-4" />
              Back to Profile
            </button>

            {activeSubView === 'medical' && (
              <div className="space-y-6">
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-black/5">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-blue-600" />
                    Medical Records
                  </h3>
                  
                  <div className="space-y-8">
                    {/* Lab Results Section */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">Lab Results (Extensive)</h4>
                        <button className="text-xs font-bold text-blue-600">Download All</button>
                      </div>
                      <div className="space-y-3">
                        {[
                          { name: 'Complete Blood Count (CBC)', date: 'Mar 10, 2026', status: 'Normal', value: '14.2 g/dL' },
                          { name: 'Metabolic Panel', date: 'Mar 10, 2026', status: 'Attention', value: 'Glucose: 105 mg/dL' },
                          { name: 'Lipid Profile', date: 'Feb 15, 2026', status: 'Normal', value: 'LDL: 90 mg/dL' },
                          { name: 'Thyroid Stimulating Hormone', date: 'Jan 20, 2026', status: 'Normal', value: '2.1 mIU/L' },
                          { name: 'Vitamin D (25-OH)', date: 'Jan 20, 2026', status: 'Low', value: '18 ng/mL' },
                        ].map((lab, i) => (
                          <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                            <div>
                              <div className="text-sm font-bold text-gray-900">{lab.name}</div>
                              <div className="text-[10px] text-gray-400">{lab.date} • {lab.value}</div>
                            </div>
                            <div className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-black uppercase",
                              lab.status === 'Normal' ? "bg-emerald-100 text-emerald-700" : 
                              lab.status === 'Attention' ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                            )}>
                              {lab.status}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Imaging Section */}
                    <div>
                      <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Imaging & Scans</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { name: 'Chest X-Ray', date: 'Mar 05, 2026' },
                          { name: 'Abdominal Ultrasound', date: 'Jan 12, 2026' },
                        ].map((scan, i) => (
                          <div key={i} className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl text-center">
                            <Activity className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                            <div className="text-xs font-bold text-blue-900">{scan.name}</div>
                            <div className="text-[10px] text-blue-400">{scan.date}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSubView === 'privacy' && (
              <div className="space-y-6">
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-black/5">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Shield className="w-6 h-6 text-gray-600" />
                    Privacy & Security
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-emerald-600" />
                        <div>
                          <div className="text-sm font-bold text-emerald-900">End-to-End Encryption</div>
                          <div className="text-[10px] text-emerald-600">Active for all medical data</div>
                        </div>
                      </div>
                      <div className="w-10 h-5 bg-emerald-600 rounded-full relative">
                        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Security Controls</h4>
                      {[
                        { label: 'Biometric Unlock (FaceID)', status: 'Enabled' },
                        { label: 'Two-Factor Authentication', status: 'Enabled' },
                        { label: 'Authorized Devices (2)', status: 'Manage' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                          <span className="text-sm font-medium text-gray-700">{item.label}</span>
                          <span className="text-xs font-bold text-blue-600">{item.status}</span>
                        </div>
                      ))}
                    </div>

                    <button className="w-full py-4 border-2 border-red-100 text-red-600 rounded-2xl font-bold text-sm hover:bg-red-50 transition-colors">
                      Delete My Data Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSubView === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-black/5">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Settings className="w-6 h-6 text-amber-600" />
                    App Settings
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Preferences</h4>
                      {[
                        { label: 'Push Notifications', value: 'On' },
                        { label: 'Theme Mode', value: 'System' },
                        { label: 'Language', value: 'English (US)' },
                        { label: 'Offline Storage Limit', value: '500 MB' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                          <span className="text-sm font-medium text-gray-700">{item.label}</span>
                          <span className="text-xs font-bold text-amber-600">{item.value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                      <div className="text-sm font-bold text-amber-900">Storage Management</div>
                      <div className="mt-2 h-2 bg-amber-200 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-600 w-[35%]" />
                      </div>
                      <div className="mt-2 text-[10px] text-amber-700">175 MB used of 500 MB</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

