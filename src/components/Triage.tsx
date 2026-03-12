import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { mockApi } from '../services/mockApi';
import { strings } from '../i18n/strings';
import { cn } from '../utils';
import { 
  Stethoscope, 
  Activity, 
  Thermometer, 
  Heart, 
  Droplets, 
  Wind,
  AlertTriangle,
  ChevronRight,
  Info,
  Upload
} from 'lucide-react';
import { TriageRequest, TriageResponse } from '../types';

export default function Triage() {
  const [symptoms, setSymptoms] = React.useState('');
  const [temp, setTemp] = React.useState('37.0');
  const [hr, setHr] = React.useState('72');
  const [bp, setBp] = React.useState('120/80');
  const [spo2, setSpo2] = React.useState('98');
  const [onset, setOnset] = React.useState('1');
  const [age, setAge] = React.useState('30');
  const [sex, setSex] = React.useState('female');
  const [diagnosticImage, setDiagnosticImage] = React.useState<string | null>(null);

  const triageMutation = useMutation({
    mutationFn: (data: TriageRequest) => mockApi.getTriage(data)
  });

  const diagnosticMutation = useMutation({
    mutationFn: (data: { type: string, fileRef: string }) => mockApi.getDiagnostics(data)
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDiagnosticImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    triageMutation.mutate({
      symptoms,
      vitals: {
        tempC: parseFloat(temp),
        hr: parseInt(hr),
        bp,
        spo2: parseInt(spo2)
      },
      onsetDays: parseInt(onset),
      age: parseInt(age),
      sex
    });

    if (diagnosticImage) {
      diagnosticMutation.mutate({
        type: 'image',
        fileRef: 'uploaded_diagnostic_image'
      });
    }
  };

  const result = triageMutation.data;
  const diagnosticResult = diagnosticMutation.data;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Triage Form */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-black/5">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <Stethoscope className="text-emerald-600 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{strings.triage.title}</h2>
            <p className="text-sm text-gray-500">AI-assisted symptom assessment</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">{strings.triage.symptoms}</label>
            <textarea 
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. I have a persistent cough and mild fever for 2 days..."
              rows={4}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-orange-500" />
                {strings.triage.temp}
              </label>
              <input 
                type="number" step="0.1" value={temp} onChange={(e) => setTemp(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                {strings.triage.hr}
              </label>
              <input 
                type="number" value={hr} onChange={(e) => setHr(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-500" />
                {strings.triage.bp}
              </label>
              <input 
                type="text" value={bp} onChange={(e) => setBp(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Wind className="w-4 h-4 text-cyan-500" />
                {strings.triage.spo2}
              </label>
              <input 
                type="number" value={spo2} onChange={(e) => setSpo2(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">{strings.triage.onset}</label>
              <input 
                type="number" value={onset} onChange={(e) => setOnset(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Age</label>
              <input 
                type="number" value={age} onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Sex</label>
              <select 
                value={sex} onChange={(e) => setSex(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 outline-none"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-500" />
              Diagnostic Image (Optional)
            </label>
            <div className="flex items-center gap-4">
              <label className="flex-1 flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/30 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-xs text-gray-500">Upload X-ray, MRI, or skin photo</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
              {diagnosticImage && (
                <div className="w-32 h-32 rounded-2xl overflow-hidden border border-gray-200 relative group">
                  <img src={diagnosticImage} alt="Diagnostic" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => setDiagnosticImage(null)}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold transition-opacity"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={triageMutation.isPending || diagnosticMutation.isPending}
              className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
            >
              {triageMutation.isPending || diagnosticMutation.isPending ? (
                <>
                  <Activity className="w-5 h-5 animate-pulse" />
                  {diagnosticImage ? 'Analyzing Vitals & Image...' : 'Analyzing Vitals...'}
                </>
              ) : (
                <>
                  <Activity className="w-5 h-5" />
                  {diagnosticImage ? 'Run AI Triage & Diagnostic' : 'Run AI Triage'}
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
          <Info className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-xs text-amber-800 leading-relaxed">
            {strings.triage.disclaimer}
          </p>
        </div>
      </div>

      {/* Triage Results */}
      <div className="space-y-6">
        {!result ? (
          <div className="h-full bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-12 text-center text-gray-400">
            <Activity className="w-16 h-16 mb-4 opacity-10" />
            <p className="text-lg font-medium">Submit the form to see AI analysis</p>
            <p className="text-sm">Our model will evaluate urgency and potential causes.</p>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            {/* Urgency Card */}
            <div className={cn(
              "p-8 rounded-3xl border shadow-sm",
              result.triage.urgency === 'Emergency' ? "bg-red-50 border-red-100" :
              result.triage.urgency === 'High' ? "bg-orange-50 border-orange-100" :
              result.triage.urgency === 'Medium' ? "bg-blue-50 border-blue-100" :
              "bg-emerald-50 border-emerald-100"
            )}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest opacity-60">Triage Urgency</span>
                  <h3 className={cn(
                    "text-3xl font-black mt-1",
                    result.triage.urgency === 'Emergency' ? "text-red-700" :
                    result.triage.urgency === 'High' ? "text-orange-700" :
                    result.triage.urgency === 'Medium' ? "text-blue-700" :
                    "text-emerald-700"
                  )}>
                    {result.triage.urgency}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-60">Confidence</span>
                  <div className="text-xl font-bold mt-1">{(result.triage.confidence * 100).toFixed(0)}%</div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{result.explanation}</p>
            </div>

            {/* Differentials */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-black/5">
              <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">{strings.triage.differentials}</h4>
              <div className="space-y-4">
                {result.differentials.map((diff, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-bold text-gray-900">{diff.condition}</span>
                        <span className="text-xs font-medium text-gray-500">{(diff.confidence * 100).toFixed(0)}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                          style={{ width: `${diff.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnostic Results */}
            {diagnosticResult && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-black/5 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Activity className="text-blue-600 w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">AI Image Analysis</h4>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                    <div className="text-xs font-bold text-blue-600 uppercase mb-1">AI Summary</div>
                    <p className="text-sm text-gray-800 leading-relaxed font-medium">{diagnosticResult.summary}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-gray-50 border border-black/5">
                      <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Confidence</div>
                      <div className="text-lg font-black text-gray-900">{(diagnosticResult.confidence * 100).toFixed(0)}%</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50 border border-black/5">
                      <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Anomalies</div>
                      <div className="text-lg font-black text-gray-900">{diagnosticResult.flags.length || 'None'}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-bold text-gray-400 uppercase px-1">Recommended Next Steps</div>
                    {diagnosticResult.nextSteps.map((step, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-black/5">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span className="text-xs font-medium text-gray-700">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Guidance */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-black/5">
              <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">{strings.triage.guidance}</h4>
              <div className="space-y-3">
                {result.guidance.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50">
                    <ChevronRight className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-gray-700">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
