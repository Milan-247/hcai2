export type UserRole = 'patient' | 'clinician';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  registrationNumber?: string;
  avatar?: string;
  phone?: string;
  bloodGroup?: string;
  weight?: string;
  allergies?: string[];
  medications?: string[];
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  sex: 'male' | 'female' | 'other';
  birthDate: string;
  phone: string;
  email: string;
  address: string;
  allergies: string[];
  conditions: string[];
  medications: string[];
  createdAt: string;
}

export interface Provider {
  id: string;
  name: string;
  specialty: string;
  locations: string[];
  slots: string[];
}

export interface Appointment {
  id: string;
  patientId: string;
  providerId: string;
  start: string;
  reason: string;
  channel: 'in_person' | 'video' | 'phone';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface TriageRequest {
  symptoms: string;
  vitals: {
    tempC: number;
    hr: number;
    bp: string;
    spo2: number;
  };
  onsetDays: number;
  age: number;
  sex: string;
}

export interface TriageResponse {
  triage: {
    urgency: 'Low' | 'Medium' | 'High' | 'Emergency';
    confidence: number;
  };
  differentials: {
    condition: string;
    confidence: number;
  }[];
  guidance: string[];
  explanation: string;
}

export interface DiagnosticRequest {
  type: string;
  fileRef: string;
}

export interface DiagnosticResponse {
  summary: string;
  confidence: number;
  flags: string[];
  nextSteps: string[];
}
