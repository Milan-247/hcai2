import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { strings } from '../i18n/strings';
import { mockApi } from '../services/mockApi';
import { cn } from '../utils';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const patientSchema = z.object({
  firstName: z.string().min(2, "Required"),
  lastName: z.string().min(2, "Required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Invalid phone"),
  sex: z.enum(['male', 'female', 'other']),
  birthDate: z.string(),
  address: z.string().min(5, "Required"),
  allergies: z.string().optional(),
  conditions: z.string().optional(),
  medications: z.string().optional(),
});

type FormData = z.infer<typeof patientSchema>;

export default function RegistrationForm() {
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = React.useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      sex: 'male'
    }
  });

  const onSubmit = async (data: FormData) => {
    setStatus('loading');
    try {
      await mockApi.createPatient({
        ...data,
        allergies: data.allergies ? data.allergies.split(',').map(s => s.trim()) : [],
        conditions: data.conditions ? data.conditions.split(',').map(s => s.trim()) : [],
        medications: data.medications ? data.medications.split(',').map(s => s.trim()) : [],
      });
      setStatus('success');
      reset();
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || strings.registration.duplicateError);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
      <div className="p-8 border-b border-black/5">
        <h2 className="text-2xl font-bold text-gray-900">{strings.registration.title}</h2>
        <p className="text-gray-500 mt-1">Register a new patient to the system.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">{strings.registration.firstName}</label>
            <input 
              {...register('firstName')}
              className={cn("w-full px-4 py-3 rounded-xl border bg-gray-50/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all", 
                errors.firstName ? "border-red-300" : "border-gray-200")}
            />
            {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">{strings.registration.lastName}</label>
            <input 
              {...register('lastName')}
              className={cn("w-full px-4 py-3 rounded-xl border bg-gray-50/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all", 
                errors.lastName ? "border-red-300" : "border-gray-200")}
            />
            {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">{strings.registration.email}</label>
            <input 
              {...register('email')}
              type="email"
              className={cn("w-full px-4 py-3 rounded-xl border bg-gray-50/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all", 
                errors.email ? "border-red-300" : "border-gray-200")}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">{strings.registration.phone}</label>
            <input 
              {...register('phone')}
              className={cn("w-full px-4 py-3 rounded-xl border bg-gray-50/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all", 
                errors.phone ? "border-red-300" : "border-gray-200")}
            />
            {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">{strings.registration.dob}</label>
            <input 
              {...register('birthDate')}
              type="date"
              className={cn("w-full px-4 py-3 rounded-xl border bg-gray-50/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all", 
                errors.birthDate ? "border-red-300" : "border-gray-200")}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">{strings.registration.sex}</label>
            <select 
              {...register('sex')}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">{strings.registration.address}</label>
          <textarea 
            {...register('address')}
            rows={2}
            className={cn("w-full px-4 py-3 rounded-xl border bg-gray-50/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all", 
              errors.address ? "border-red-300" : "border-gray-200")}
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">{strings.registration.allergies}</label>
            <input 
              {...register('allergies')}
              placeholder="e.g. Penicillin, Peanuts"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">{strings.registration.conditions}</label>
            <input 
              {...register('conditions')}
              placeholder="e.g. Hypertension, Diabetes"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
            />
          </div>
        </div>

        <div className="pt-4 flex items-center gap-4">
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg shadow-emerald-600/20"
          >
            {status === 'loading' ? strings.common.loading : strings.common.submit}
          </button>

          {status === 'success' && (
            <div className="flex items-center gap-2 text-emerald-600 font-medium">
              <CheckCircle2 className="w-5 h-5" />
              <span>{strings.registration.success}</span>
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-center gap-2 text-red-600 font-medium">
              <AlertCircle className="w-5 h-5" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
