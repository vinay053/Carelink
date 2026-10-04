export const STAGE_NAMES = [
  'Referral Created',
  'Referral Accepted',
  'Appointment Booked',
  'Patient Arrived at Hospital',
  'Specialist Consulted',
  'Treatment Started',
  'Follow-up Completed',
  'Referral Closed'
];

export const STAGE_SHORT_NAMES = [
  'Created',
  'Accepted',
  'Booked',
  'Arrived',
  'Consulted',
  'Treatment',
  'Follow-up',
  'Closed'
];

export const ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  PHARMACIST: 'pharmacist',
  PATIENT: 'patient'
};

export const URGENCY_LEVELS = [
  { value: 'low', label: 'Low Urgency (Routine)', color: 'text-success bg-successDim border-success/30' },
  { value: 'medium', label: 'Medium Urgency', color: 'text-warning bg-warningDim border-warning/30' },
  { value: 'high', label: 'High Urgency (Urgent)', color: 'text-danger bg-dangerDim border-danger/30' },
  { value: 'critical', label: 'Critical Emergency', color: 'text-danger bg-danger/20 border-danger animate-pulse' }
];

export const SPECIALTIES = [
  'Cardiology',
  'Cardiothoracic Surgery',
  'Neurology',
  'Nephrology',
  'Oncology',
  'Pulmonology',
  'General Medicine',
  'Orthopedics',
  'Pediatrics',
  'Obstetrics & Gynecology'
];
