import { Patient, Provider, Appointment, TriageRequest, TriageResponse, DiagnosticRequest, DiagnosticResponse } from '../types';

// Initial Mock Data
const INITIAL_PROVIDERS: Provider[] = [
  {
    id: "prov_101",
    name: "Dr. Sarah Chen",
    specialty: "Cardiology",
    locations: ["Main Hospital", "Downtown Clinic"],
    slots: ["2026-03-08T10:00:00Z", "2026-03-08T11:00:00Z", "2026-03-09T09:00:00Z"]
  },
  {
    id: "prov_102",
    name: "Dr. Arjun K",
    specialty: "General Medicine",
    locations: ["Bengaluru"],
    slots: ["2026-03-08T06:00:00Z", "2026-03-08T06:30:00Z", "2026-03-09T14:00:00Z"]
  },
  {
    id: "prov_103",
    name: "Dr. Elena Rodriguez",
    specialty: "Pediatrics",
    locations: ["Westside Medical"],
    slots: ["2026-03-08T13:00:00Z", "2026-03-08T13:30:00Z"]
  }
];

class MockApiService {
  private patients: Patient[] = [];
  private appointments: Appointment[] = [];
  private providers: Provider[] = INITIAL_PROVIDERS;

  constructor() {
    // Load from localStorage if available
    const savedPatients = localStorage.getItem('mediflow_patients');
    const savedAppts = localStorage.getItem('mediflow_appointments');
    if (savedPatients) this.patients = JSON.parse(savedPatients);
    if (savedAppts) this.appointments = JSON.parse(savedAppts);
  }

  private persist() {
    localStorage.setItem('mediflow_patients', JSON.stringify(this.patients));
    localStorage.setItem('mediflow_appointments', JSON.stringify(this.appointments));
  }

  // Patients
  async getPatients() {
    return this.patients;
  }

  async createPatient(data: Omit<Patient, 'id' | 'createdAt'>): Promise<Patient> {
    // Duplicate detection
    const exists = this.patients.find(p => p.email === data.email || p.phone === data.phone);
    if (exists) {
      throw new Error("Duplicate patient detected");
    }

    const newPatient: Patient = {
      ...data,
      id: `pat_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    this.patients.push(newPatient);
    this.persist();
    return newPatient;
  }

  // Providers
  async getProviders(specialty?: string) {
    if (specialty) {
      return this.providers.filter(p => p.specialty.toLowerCase().includes(specialty.toLowerCase()));
    }
    return this.providers;
  }

  // Appointments
  async getAppointments() {
    return this.appointments;
  }

  async createAppointment(data: Omit<Appointment, 'id' | 'status' | 'createdAt'>): Promise<Appointment> {
    const newAppt: Appointment = {
      ...data,
      id: `appt_${Math.random().toString(36).substr(2, 9)}`,
      status: 'Scheduled',
      createdAt: new Date().toISOString()
    };
    this.appointments.push(newAppt);
    this.persist();
    return newAppt;
  }

  async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<Appointment> {
    const appt = this.appointments.find(a => a.id === id);
    if (!appt) throw new Error("Appointment not found");
    appt.status = status;
    this.persist();
    return appt;
  }

  // AI Triage (Deterministic Mock)
  async getTriage(data: TriageRequest): Promise<TriageResponse> {
    await new Promise(r => setTimeout(r, 1000)); // Simulate network
    
    const symptoms = data.symptoms.toLowerCase();
    
    if (symptoms.includes('chest pain') || symptoms.includes('breath')) {
      return {
        triage: { urgency: 'Emergency', confidence: 0.89 },
        differentials: [
          { condition: "Acute Coronary Syndrome", confidence: 0.75 },
          { condition: "Pulmonary Embolism", confidence: 0.15 }
        ],
        guidance: ["Call emergency services immediately", "Do not drive yourself", "Aspirin if not allergic"],
        explanation: "Severe symptoms indicating potential cardiac or pulmonary distress."
      };
    }

    if (symptoms.includes('fever') || symptoms.includes('sore throat')) {
      return {
        triage: { urgency: 'Medium', confidence: 0.74 },
        differentials: [
          { condition: "Viral pharyngitis", confidence: 0.68 },
          { condition: "Streptococcal pharyngitis", confidence: 0.22 }
        ],
        guidance: ["Hydration and rest", "Consider rapid strep test", "Monitor temperature"],
        explanation: "Fever + sore throat + myalgia with stable vitals → likely viral."
      };
    }

    return {
      triage: { urgency: 'Low', confidence: 0.65 },
      differentials: [
        { condition: "Common Cold", confidence: 0.80 },
        { condition: "Allergic Rhinitis", confidence: 0.10 }
      ],
      guidance: ["Over-the-counter decongestants", "Rest", "Follow up if symptoms persist > 7 days"],
      explanation: "Mild upper respiratory symptoms without signs of systemic distress."
    };
  }

  async getDiagnostics(data: DiagnosticRequest): Promise<DiagnosticResponse> {
    await new Promise(r => setTimeout(r, 2000));
    
    // Simulate different results based on a "random" factor or the data
    const isAbnormal = Math.random() > 0.7;

    if (isAbnormal) {
      return {
        summary: "Potential anomaly detected in the upper quadrant. Further investigation required.",
        confidence: 0.76,
        flags: ["Hyperdensity detected", "Irregular margins"],
        nextSteps: ["Schedule follow-up MRI", "Consult specialist", "Biopsy may be indicated"]
      };
    }

    return {
      summary: "Diagnostic analysis complete. No acute abnormalities or significant findings detected in the provided image.",
      confidence: 0.92,
      flags: [],
      nextSteps: ["Routine follow-up", "Maintain current treatment plan"]
    };
  }
}

export const mockApi = new MockApiService();
