A minimal, usable web application demonstrating patient registration, appointment scheduling, and AI-assisted triage.

Features
Patient Registration: Comprehensive form with Zod validation and duplicate detection.
Appointment Scheduling: Search for providers by specialty, select available slots, and manage upcoming appointments.
AI Triage & Diagnostics: Deterministic AI assessment based on symptoms and vitals, providing urgency levels, differential diagnoses, and next steps.
Clinician Dashboard: High-level overview of today's appointments and recent triage outcomes.
Architecture Decisions
Framework: React with TypeScript for type safety.
State Management: React Query for efficient data fetching and caching of mock API data.
Forms: React Hook Form with Zod for robust validation.
Styling: Tailwind CSS for a modern, responsive "Clean Utility" design.
Mock API: A centralized service (mockApi.ts) that simulates network latency and deterministic AI responses. Data is persisted in localStorage.
How AI Mocks are Deterministic
The triage logic in src/services/mockApi.ts uses keyword matching and rule-based logic to return specific results:


Keywords like "chest pain" or "breath" trigger an Emergency triage.
Keywords like "fever" or "sore throat" trigger a Medium urgency triage.
Other inputs default to Low urgency.
Accessibility & Performance
A11y: Semantic HTML elements, proper labels for all form inputs, and high-contrast color palette.
Performance: Mobile-first design, optimized asset loading, and minimal re-renders using React Query.
Setup & Run
npm install
npm run dev
Note: This is a prototype using synthetic data only. Not for medical use.
