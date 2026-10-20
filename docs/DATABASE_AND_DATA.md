# DATABASE_AND_DATA.md — Database Schema, Models & Clinical Seeding

## 1. Mongoose Data Models

CareLink defines 8 schemas in `carelink-backend/src/models/`:

### 1. User (`User.js`)
- `name`: String, required.
- `email`: String, required, unique, lowercase.
- `password`: String (hashed using bcrypt with salt rounds 10).
- `role`: Enum `['doctor', 'specialist', 'admin', 'pharmacist', 'nurse']`.
- `hospital`: ObjectId ref `Hospital`.
- `phone`: String.
- `notificationPreferences`: Object `{ sms: Boolean, email: Boolean, browser: Boolean }`.

### 2. Hospital (`Hospital.js`)
- `name`: String, required.
- `district`, `state`: Geographic location.
- `type`: Enum `['phc', 'chc', 'district', 'tertiary', 'private']`.
- `specialties`: Array of Strings (e.g. `['Cardiology', 'Neurology', 'Orthopedics']`).
- `totalICUBeds`, `availableICUBeds`: Number.
- `totalOxygenBeds`, `availableOxygenBeds`: Number.
- `hasCT`, `hasMRI`: Boolean indicators for diagnostic matching.
- `currentLoad`: Number (0–100%).

### 3. Patient (`Patient.js`)
- `abhaId`: String, required, unique (e.g., `ABHA-9821-4432-1109`).
- `name`, `age`, `gender`, `phone`: Demographics.
- `address`, `district`, `state`: Geographic location.
- `emergencyContact`: Object `{ name, relation, phone }`.
- `medicalHistory`: Array of Strings.
- `allergies`: Array of Strings.

### 4. Referral (`Referral.js`)
- `patient`: ObjectId ref `Patient`.
- `referringHospital`: ObjectId ref `Hospital`.
- `receivingHospital`: ObjectId ref `Hospital`.
- `referringDoctor`: ObjectId ref `User`.
- `urgency`: Enum `['critical', 'high', 'moderate', 'low']`.
- `status`: Enum `['referred', 'accepted', 'transport', 'arrived', 'admitted', 'discharged', 'cancelled']`.
- `reason`: String (clinical rationale).
- `requiredSpecialty`: String.
- `riskScore`: Number (0–100 calculated dropout risk).
- `riskFactors`: Array of Strings.
- `timeline`: Array of `{ stage, timestamp, updatedBy, notes }`.
- `transport`: `{ mode, ambulanceId, driverPhone, departureTime, arrivalTime }`.
- `stageSLA`: `{ stage, deadline, isBreached }`.

### 5. DiagnosticResult (`DiagnosticResult.js`)
- `patient`: ObjectId ref `Patient`.
- `testName`: String (e.g. `Troponin-T`, `Complete Blood Count`, `Chest X-Ray`).
- `category`: Enum `['laboratory', 'radiology', 'pathology', 'cardiology']`.
- `resultValue`, `unit`, `referenceRange`: String.
- `urgency`: Enum `['normal', 'abnormal', 'critical']`.
- `isReviewed`: Boolean.
- `clinicalNotes`: String.

### 6. Medication (`Medication.js`)
- `patient`: ObjectId ref `Patient`.
- `drugName`, `dosage`, `frequency`, `route`: String.
- `prescribedByHospital`: ObjectId ref `Hospital`.
- `startDate`, `endDate`: Date.
- `status`: Enum `['active', 'discontinued', 'completed', 'flagged']`.
- `conflictFlag`: `{ hasConflict, severity, interactingDrug, recommendation }`.

### 7. Alert (`Alert.js`)
- `referral`: ObjectId ref `Referral`.
- `patient`: ObjectId ref `Patient`.
- `type`: Enum `['sla_breach', 'critical_lab', 'drug_conflict', 'dropout_risk']`.
- `severity`: Enum `['critical', 'warning', 'info']`.
- `message`: String.
- `status`: Enum `['active', 'acknowledged', 'resolved']`.

### 8. ChatMessage (`ChatMessage.js`)
- `user`: ObjectId ref `User`.
- `role`: Enum `['user', 'assistant', 'system']`.
- `content`: String.
- `metadata`: Object.

---

## 2. Clinical Seeder (`npm run seed`)

The seed script creates the **Madhya Pradesh Clinical Cohort**:
1. **Facilities**:
   - `District Hospital Sagar` (District tier, 10 ICU beds, CT scanner, Cardiology)
   - `NSCB Medical College, Jabalpur` (Tertiary apex, 30 ICU beds, CT + MRI, all specialties)
   - `Sagar Primary Health Centre` (PHC tier, feeder facility)
2. **Users**:
   - Dr. Ramesh Verma (`dr.verma@sagarphc.in`)
   - Dr. Ananya Patel (`dr.patel@jabalpurmc.in`)
   - Administrator Rajesh Sharma (`admin@carelink.in`)
   - Pharmacist Sunil Shukla (`pharma.shukla@carelink.in`)
3. **Patients**:
   - Suresh Kumar (ABHA-4910-8291-3001) — Acute Coronary Syndrome referral with elevated Troponin-T.
   - Sunita Bai (ABHA-1823-9912-4012) — High-risk obstetric referral.
   - Additional pediatric and geriatric clinical profiles.
