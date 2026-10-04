# CareLink: Master Technical Specification & Atomic Implementation Prompts

This document decomposes the complete **CareLink** platform into **13 atomic, sequential, self-verifying implementation prompts**. 

Each prompt is designed to be executed sequentially (e.g., using Antigravity `/goal` mode). Every prompt defines:
1. **Objective & Scope**
2. **Files to Create or Modify**
3. **Exact Code & Architecture Specifications**
4. **Automated Verification Step (Test Command & Expected Output)**

---

## Architecture & System Overview

- **Frontend:** React 18 + Vite, TailwindCSS, React Router v6, Axios, Recharts, Lucide React, Framer Motion, React Hot Toast.
- **Backend:** Node.js + Express.js, MongoDB + Mongoose, JWT + bcrypt, cors, morgan, express-validator, node-cron.
- **Services:** OpenAI API (CareBot & Summaries), OpenFDA / Deterministic Rules (Drug Interaction), Twilio (SMS Escalation).
- **Design Tokens:**
  - Background Primary: `#0D1B2A` (deep dark navy)
  - Card / Panel Background: `#1A2B3C`
  - Elevated / Inputs / Modals: `#243447`
  - Accent / Primary Action: `#00BFA6` (teal)
  - Semantic: Success `#2ED573`, Warning `#FFA502`, Danger `#FF4757`
  - Text: Primary `#F0F4F8`, Secondary `#8892A4`

---

## Table of Prompts

| # | Prompt Name | Area | Verification |
|---|-------------|------|--------------|
| **01** | Scaffolding & Environment Setup | Infra / Setup | Dev servers start, health endpoint responds |
| **02** | Database Connection & Mongoose Models | Backend Data | DB connects, schemas validate against test script |
| **03** | Core Services (Risk, Care Gap, Hospital Recommender) | Backend Logic | Service unit test script asserts exact math & outputs |
| **04** | Authentication & RBAC APIs | Backend Auth | JWT issuance, password hashing, role guard verification |
| **05** | Core Workflow REST APIs | Backend APIs | CRUD & state transition tests on referrals, patients, labs |
| **06** | CareBot AI Assistant & Streaming Service | Backend AI | Context injection & streaming response test |
| **07** | Comprehensive Demo Seed Script | Backend Data | `npm run seed` creates realistic MP demo dataset |
| **08** | Frontend Shell, Design System & Shared UI Kit | Frontend Base | Vite builds, theme variables & UI components render |
| **09** | Auth Flow, Protected Routing & Dashboard View | Frontend Core | Login redirect, StatCards & recent referrals table render |
| **10** | Referral Lifecycle (List, Multi-step Wizard & Stepper) | Frontend Module | Create referral with SVG gauge, advance stage, auto-resolve alerts |
| **11** | Diagnostics Tracker & Medication Reconciliation | Frontend Module | Review lab results, resolve cross-provider drug conflicts |
| **12** | CareBot Chat, Hospital Map & Analytics Visualizations | Frontend Module | Streaming chat interface, capacity search, Recharts graphs |
| **13** | Mobile Responsiveness, Micro-interactions & Documentation | Polish / Demo | 375px viewport check, README.md, full demo smoke test |

---

## PROMPT 01: Scaffolding & Environment Setup

### Objective
Initialize the repository root with two distinct subprojects: `carelink-backend` and `carelink-frontend`. Configure all dependencies, scripts, and environment variable templates.

### Files to Create
- `carelink-backend/package.json`
- `carelink-backend/.env.example`
- `carelink-backend/.env`
- `carelink-backend/src/app.js`
- `carelink-backend/src/server.js`
- `carelink-frontend/package.json`
- `carelink-frontend/vite.config.js`
- `carelink-frontend/tailwind.config.js`
- `carelink-frontend/postcss.config.js`
- `carelink-frontend/index.html`
- `carelink-frontend/src/main.jsx`
- `carelink-frontend/src/App.jsx`
- `carelink-frontend/src/index.css`
- `carelink-frontend/.env.example`
- `carelink-frontend/.env`

### Prompt Content
```text
TASK: Initialize the CareLink repository with two cleanly isolated projects:
1. carelink-backend:
   - Initialize package.json with dependencies: express, cors, dotenv, morgan, mongoose, jsonwebtoken, bcryptjs, express-validator, node-cron, axios.
   - Dev dependencies: nodemon.
   - Scripts: "start": "node src/server.js", "dev": "nodemon src/server.js", "seed": "node src/utils/seed.js".
   - Setup src/app.js with express app, cors middleware, morgan('dev'), express.json().
   - Add a GET /health route returning { status: 'healthy', service: 'carelink-backend', timestamp: new Date() }.
   - Setup src/server.js to read PORT (default 5000) and start listening.
   - Create .env and .env.example with: PORT=5000, MONGODB_URI=mongodb://localhost:27017/carelink, JWT_SECRET=carelink_dev_secret_key_2026, JWT_EXPIRES_IN=7d, OPENAI_API_KEY=, TWILIO_ACCOUNT_SID=, TWILIO_AUTH_TOKEN=, TWILIO_PHONE_NUMBER=, FRONTEND_URL=http://localhost:5173.

2. carelink-frontend:
   - Initialize Vite + React 18 project.
   - Dependencies: react, react-dom, react-router-dom, axios, lucide-react, recharts, framer-motion, react-hot-toast, date-fns.
   - Dev dependencies: vite, @vitejs/plugin-react, tailwindcss, postcss, autoprefixer.
   - Configure tailwind.config.js with colors:
     bgPrimary: '#0D1B2A',
     bgCard: '#1A2B3C',
     bgElevated: '#243447',
     accentTeal: '#00BFA6',
     textPrimary: '#F0F4F8',
     textSecondary: '#8892A4',
     danger: '#FF4757',
     warning: '#FFA502',
     success: '#2ED573'
   - Setup index.css with CSS custom variables for the dark palette, Inter font family, and custom slim scrollbars.
   - Setup src/App.jsx rendering a placeholder banner with CareLink title and dark theme background.
   - Create .env and .env.example with VITE_API_BASE_URL=http://localhost:5000/api.

Ensure npm install completes in both directories.
```

### Automated Verification Step
```bash
# Backend verification:
cd carelink-backend && npm install && node -e "const app = require('./src/app'); const server = app.listen(5000, () => { console.log('Backend OK'); server.close(); process.exit(0); });"
# Frontend verification:
cd carelink-frontend && npm install && npm run build
```
*Expected Result:* Backend boots and logs "Backend OK". Frontend `npm run build` exits with code 0.

---

## PROMPT 02: Database Connection & Mongoose Schemas

### Objective
Establish the MongoDB connection handler with retry logic and build all 8 Mongoose models exactly conforming to the CareLink specification with strict enum validation.

### Files to Create
- `carelink-backend/src/utils/database.js`
- `carelink-backend/src/models/User.js`
- `carelink-backend/src/models/Patient.js`
- `carelink-backend/src/models/Referral.js`
- `carelink-backend/src/models/DiagnosticResult.js`
- `carelink-backend/src/models/Medication.js`
- `carelink-backend/src/models/Hospital.js`
- `carelink-backend/src/models/ChatMessage.js`
- `carelink-backend/src/models/Alert.js`
- `carelink-backend/src/models/index.js`
- `carelink-backend/tests/verifyModels.js`

### Prompt Content
```text
TASK: Implement the MongoDB connection and all 8 Mongoose data models for CareLink:

1. src/utils/database.js:
   - Export connectDB() function with mongoose.connect using process.env.MONGODB_URI.
   - Handle connection errors gracefully, logging clear guidance if MongoDB is local or cloud.

2. Build models exactly with these schemas:
   - User.js: name (String, required), email (String, unique, lowercase, required), password (String, required, select: false), role (String, enum: ['doctor', 'admin', 'pharmacist', 'patient'], default: 'doctor'), hospitalId (ObjectId ref 'Hospital'), phone (String), profilePicture (String), isVerified (Boolean, default: true).
   - Patient.js: abhaId (String, unique, required), name (String, required), dateOfBirth (Date), gender (String, enum: ['male', 'female', 'other']), phone (String), address: { district: String, state: String, pincode: String }, bloodGroup (String), emergencyContact: { name: String, phone: String, relation: String }, currentMedications: [{ drugName: String, dose: String, frequency: String, prescribedBy: String, startDate: Date, endDate: Date, isActive: Boolean }], allergies: [String], conditions: [String], assignedDoctorId: (ObjectId ref 'User'), hospitalId: (ObjectId ref 'Hospital').
   - Referral.js: patientId (ObjectId ref 'Patient', required), referringDoctorId (ObjectId ref 'User', required), referringHospitalId (ObjectId ref 'Hospital', required), targetHospitalId (ObjectId ref 'Hospital', required), targetSpecialty (String, required), urgency (String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium'), status (String, enum: ['created', 'accepted', 'appointment_booked', 'patient_arrived', 'specialist_consulted', 'treatment_started', 'follow_up_done', 'closed'], default: 'created'), currentStage (Number, min: 0, max: 7, default: 0), stageTimestamps: [{ stageIndex: Number, stageName: String, completedAt: Date, updatedBy: ObjectId ref 'User' }], expectedDurations: [{ stageIndex: Number, hoursAllowed: Number }], riskScore (Number, min: 0, max: 100, default: 0), riskFactors: [{ factor: String, points: Number }], riskLevel (String, enum: ['low', 'medium', 'high'], default: 'low'), recommendedAction (String), notes (String), alerts: [{ message: String, sentAt: Date, type: String }].
   - DiagnosticResult.js: patientId (ObjectId ref 'Patient', required), testName (String, required), orderedBy (ObjectId ref 'User'), orderedAt (Date, default: Date.now), completedAt (Date), resultValue (String), normalRange (String), unit (String), status (String, enum: ['ordered', 'completed', 'reviewed', 'patient_informed', 'action_taken'], default: 'ordered'), classification (String, enum: ['normal', 'review_needed', 'urgent'], default: 'normal'), classificationReason (String), keyFindings: [String], reviewedBy (ObjectId ref 'User'), reviewedAt (Date), patientInformedAt (Date), actionTakenAt (Date), actionNotes (String), flags: [String].
   - Medication.js: patientId (ObjectId ref 'Patient', required), prescriptions: [{ prescribedBy: String, prescribedAt: Date, hospitalName: String, drugs: [{ drugName: String, genericName: String, dose: String, frequency: String, duration: String, startDate: Date, endDate: Date, isActive: Boolean }] }], conflicts: [{ drug1: String, drug2: String, severity: { type: String, enum: ['low', 'medium', 'high'] }, explanation: String, source: String, flaggedAt: { type: Date, default: Date.now }, resolvedBy: ObjectId ref 'User', resolvedAt: Date, status: { type: String, enum: ['unresolved', 'reviewed', 'resolved'], default: 'unresolved' } }], reconciliationStatus (String, enum: ['pending', 'reviewed', 'resolved'], default: 'pending').
   - Hospital.js: name (String, required), address (String), district (String, required), state (String, required), coordinates: { lat: Number, lng: Number }, type (String, enum: ['PHC', 'district', 'tertiary', 'private']), specialties: [String], totalICUBeds (Number, default: 0), availableICUBeds (Number, default: 0), hasCT (Boolean, default: false), hasMRI (Boolean, default: false), hasBloodBank (Boolean, default: false), bloodBankInventory: mongoose.Schema.Types.Mixed, specialists: [{ name: String, specialty: String, availableToday: Boolean, nextAvailable: String }], currentLoad (Number, min: 0, max: 100, default: 50), estimatedWaitMinutes (Number, default: 30), isActive (Boolean, default: true), lastUpdated: { type: Date, default: Date.now }.
   - ChatMessage.js: sessionId (String, required), userId: (ObjectId ref 'User'), role (String, enum: ['user', 'assistant'], required), content (String, required), relatedPatientId: (ObjectId ref 'Patient'), timestamp: { type: Date, default: Date.now }.
   - Alert.js: type (String, enum: ['referral_gap', 'diagnostic_pending', 'drug_conflict', 'risk_escalation'], required), severity (String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium'), patientId: (ObjectId ref 'Patient'), referralId: (ObjectId ref 'Referral'), message: (String, required), status: (String, enum: ['active', 'acknowledged', 'resolved'], default: 'active'), assignedTo: (ObjectId ref 'User'), resolvedAt: Date.

3. Export all models from src/models/index.js.
4. Create tests/verifyModels.js that imports all models, instantiates schema objects in memory, checks validity, and logs validation passes.
```

### Automated Verification Step
```bash
cd carelink-backend && node tests/verifyModels.js
```
*Expected Result:* Script confirms all 8 schemas initialize with valid fields, defaults, and enums without errors.

---

## PROMPT 03: Core Domain Services

### Objective
Implement the deterministic mathematical engines of CareLink:
1. `riskScore.service.js` (rule-based referral dropout risk scoring)
2. `careGap.service.js` (cron-based transition SLA tracker and alert generator)
3. `hospital.service.js` (weighted facility ranking algorithm)

### Files to Create
- `carelink-backend/src/services/riskScore.service.js`
- `carelink-backend/src/services/careGap.service.js`
- `carelink-backend/src/services/hospital.service.js`
- `carelink-backend/tests/verifyServices.js`

### Prompt Content
```text
TASK: Implement the 3 deterministic algorithmic services in carelink-backend/src/services/:

1. riskScore.service.js:
   - Export function calculateRiskScore(referralData, patientHistory, targetHospital):
     - Calculate point penalties:
       * Distance > 50km: +20 points (factor: 'Long travel distance (>50km)')
       * Patient previous missed appointments: +20 points per missed (up to 40 max) (factor: 'History of missed appointments')
       * No appointment booked yet (status === 'created' & currentStage === 0): +15 points (factor: 'No confirmed appointment')
       * Target hospital load > 80%: +15 points (factor: 'High facility congestion')
       * Urgency === 'high': +10 points (factor: 'High clinical urgency')
       * Urgency === 'critical': +20 points (factor: 'Critical clinical urgency')
       * Patient transport assistance needed / not recorded: +10 points (factor: 'No private transport recorded')
     - Clamp score between 0 and 100.
     - Determine riskLevel:
       * 0 to 40: 'low' -> recommendedAction: 'Standard monitoring of referral progress.'
       * 41 to 70: 'medium' -> recommendedAction: 'Schedule automated follow-up call within 48 hours.'
       * 71 to 100: 'high' -> recommendedAction: 'Assign ASHA/Community health worker immediately; coordinate transport and dispatch SMS alert.'
     - Return: { riskScore, riskLevel, riskFactors: [{ factor, points }], recommendedAction }.

2. careGap.service.js:
   - Configurable expected hours per stage based on urgency:
     * 'critical': 12 hours per stage
     * 'high': 24 hours per stage
     * 'medium': 48 hours per stage
     * 'low': 72 hours per stage
   - Export function checkReferralGaps():
     - Finds all Referrals where status !== 'closed' and status !== 'follow_up_done'.
     - For each, checks the timestamp of the last stage change against the SLA hours.
     - If current time > stageStartTime + allowedHours:
       * Creates an Alert with type 'referral_gap', severity based on delay.
       * If overdue by more than 2x allowedHours: escalate severity to 'critical'.
       * Avoid duplicate active alerts for the same referral and stage.
   - Export function initCareGapCron(): schedules checkReferralGaps to run every 4 hours using node-cron.

3. hospital.service.js:
   - Export function rankHospitals({ requiredSpecialty, patientLocation, urgency, maxDistance, hospitals }):
     - For each hospital, calculate a 0-100 composite score:
       * Specialist Available Today: 30 points (if specialist in requiredSpecialty has availableToday === true)
       * Proximity Score: 25 points max (formula: Math.max(0, 25 - (distanceKm / 4)))
       * ICU Bed Capacity: 15 points max (formula: (availableICUBeds / Math.max(totalICUBeds, 1)) * 15)
       * Facility Load: 15 points max (formula: ((100 - currentLoad) / 100) * 15)
       * Diagnostic Capability: 10 points (hasCT && hasMRI ? 10 : (hasCT || hasMRI ? 5 : 0))
       * Blood Bank: 5 points (hasBloodBank ? 5 : 0)
     - Sort hospitals descending by score and return top 3 with explanation of score breakdown.

4. Create tests/verifyServices.js to test all 3 services with sample inputs and assert expected scores and gap alerts.
```

### Automated Verification Step
```bash
cd carelink-backend && node tests/verifyServices.js
```
*Expected Result:* Tests verify accurate risk score calculation (e.g. 58km + missed appointment = score 40+), SLA calculation, and top hospital ranking.

---

## PROMPT 04: Authentication & Role-Based Access Control

### Objective
Implement secure user registration, JWT login, authentication middleware with role guards, and profile retrieval.

### Files to Create
- `carelink-backend/src/middleware/auth.middleware.js`
- `carelink-backend/src/middleware/validate.middleware.js`
- `carelink-backend/src/controllers/auth.controller.js`
- `carelink-backend/src/routes/auth.routes.js`
- `carelink-backend/tests/verifyAuth.js`

### Prompt Content
```text
TASK: Implement JWT authentication and RBAC for CareLink:

1. src/middleware/auth.middleware.js:
   - protect: Extract Bearer token from Authorization header, verify using JWT_SECRET, attach user object (excluding password) to req.user. Return 401 if missing/invalid.
   - restrictTo(...roles): Check if req.user.role is included in allowed roles. Return 403 Forbidden with clear message if unauthorized.

2. src/middleware/validate.middleware.js:
   - Generic validation runner using express-validator validationResult. Return 400 with formatted error messages.

3. src/controllers/auth.controller.js:
   - register: Validate email, password (min 8 chars), name, role (doctor, admin, pharmacist, patient), hospitalId. Hash password with bcryptjs (salt 10). Create User. Return 201 with JWT and safe user object.
   - login: Find user by email with .select('+password'). Compare password with bcrypt. Return 200 with JWT and user object.
   - getMe: Return req.user.
   - updateProfile: Update name, phone, hospitalId, profilePicture for current user.

4. src/routes/auth.routes.js:
   - POST /register
   - POST /login
   - GET /me (protected)
   - PUT /profile (protected)
   Mount route at /api/auth in src/app.js.

5. tests/verifyAuth.js: Unit test registration, token signing, middleware rejection of invalid tokens, and role restrictions.
```

### Automated Verification Step
```bash
cd carelink-backend && node tests/verifyAuth.js
```
*Expected Result:* Password hashing, token generation, 401 unauthenticated protection, and 403 role-guard tests pass.

---

## PROMPT 05: Core Workflow REST APIs

### Objective
Implement the complete set of controllers and Express routes for Patients, Referrals (with stage progression & auto alert dismissal), Diagnostics, Medications, Hospitals, Alerts, and Analytics.

### Files to Create
- `carelink-backend/src/controllers/patient.controller.js`
- `carelink-backend/src/controllers/referral.controller.js`
- `carelink-backend/src/controllers/diagnostic.controller.js`
- `carelink-backend/src/controllers/medication.controller.js`
- `carelink-backend/src/controllers/hospital.controller.js`
- `carelink-backend/src/controllers/alert.controller.js`
- `carelink-backend/src/controllers/analytics.controller.js`
- `carelink-backend/src/routes/*.routes.js` (7 route files)
- `carelink-backend/tests/verifyApiRoutes.js`

### Prompt Content
```text
TASK: Implement the full REST API layer for all CareLink domains:

1. Patient Routes (/api/patients):
   - GET /: List patients with pagination, search by name/abhaId/phone.
   - POST /: Create new patient profile.
   - GET /:id: Get patient full details with current medications, referrals, and diagnostics.
   - PUT /:id: Update patient record.
   - GET /:id/timeline: Aggregate all chronological events (patient creation, referrals, diagnostic results, medication changes, alerts) sorted by date.

2. Referral Routes (/api/referrals):
   - GET /: List referrals with filters (status, urgency, riskLevel, referringHospitalId, targetHospitalId).
   - POST /: Create referral. Automatically run riskScore.service.js, save calculated riskScore, riskLevel, riskFactors. If riskLevel === 'high', automatically create an Alert.
   - GET /:id: Get referral with full stageTimestamps and related patient/hospital objects.
   - PUT /:id/stage: Advance referral stage. Accepts { stageIndex, notes }. Validates stage progression. Updates stageTimestamps. Auto-checks if any active 'referral_gap' alert exists for this referral and marks it resolved!
   - GET /at-risk: Returns all referrals where current stage duration has exceeded expectedDurations.

3. Diagnostic Routes (/api/diagnostics):
   - GET /: List diagnostics with filters (status, classification).
   - POST /: Create diagnostic order.
   - PUT /:id/status: Advance status ('ordered' -> 'completed' -> 'reviewed' -> 'patient_informed' -> 'action_taken') with timestamps and user logging.
   - GET /pending: Return unreviewed results older than 24 hours.

4. Medication Routes (/api/medications):
   - GET /:patientId: Get patient's medication history and active prescriptions.
   - POST /reconcile: Accept array of prescriptions. Check drug pairs against OpenFDA API (GET https://api.fda.gov/drug/event.json?search=patient.drug.medicinalproduct:...) or fallback deterministic drug rules. Return detected conflicts with severity and explanation.
   - PUT /conflicts/:id/resolve: Mark conflict as resolved with resolvedBy and timestamp.

5. Hospital Routes (/api/hospitals):
   - GET /: List hospitals with filters (specialty, district, hasCT, hasMRI).
   - GET /recommend: Run hospital.service.js ranking based on query parameters.
   - PUT /:id/capacity: Update live bed/load metrics.

6. Alert Routes (/api/alerts):
   - GET /: List active alerts sorted by severity (critical, high, medium, low).
   - PUT /:id/acknowledge: Set status = 'acknowledged'.
   - PUT /:id/resolve: Set status = 'resolved' with resolvedAt = new Date().
   - POST /send-sms: Send simulated or Twilio SMS alert for critical gaps.

7. Analytics Routes (/api/analytics):
   - GET /overview: Counts of total referrals, at-risk referrals, completed referrals, pending diagnostics, active alerts.
   - GET /stage-breakdown: Count of referrals in each stage (0 to 7).
   - GET /risk-distribution: Count by low, medium, high.
   - GET /completion-trend: Weekly referral completion rate.

Mount all routes in src/app.js.
```

### Automated Verification Step
```bash
cd carelink-backend && node tests/verifyApiRoutes.js
```
*Expected Result:* API route handler tests pass for referral creation, stage progression, and alert resolution.

---

## PROMPT 06: CareBot AI Assistant & Streaming Service

### Objective
Build the AI Care Coordinator service using OpenAI API with streaming support, strict clinical safety guardrails, and patient journey context injection.

### Files to Create
- `carelink-backend/src/services/openai.service.js`
- `carelink-backend/src/controllers/carebot.controller.js`
- `carelink-backend/src/routes/carebot.routes.js`
- `carelink-backend/tests/verifyCareBot.js`

### Prompt Content
```text
TASK: Implement the CareBot AI Assistant service in carelink-backend:

1. src/services/openai.service.js:
   - System Prompt:
     "You are CareBot, an AI healthcare workflow coordinator for CareLink.
      Your role is to assist doctors, administrators, and health workers in tracking patient referrals, detecting diagnostic follow-up gaps, and maintaining continuity of care across facilities.
      SAFETY BOUNDARIES:
      - You NEVER diagnose medical conditions.
      - You NEVER prescribe medications or change treatment plans.
      - You explain care gaps, summarize timelines, and recommend workflow actions (e.g. contact patient, schedule visit, assign ASHA worker).
      - Always cite specific evidence and dates from the patient context when provided."
   - Implement streamCareBotResponse({ messages, patientContext, res }):
     - If patientContext is provided, format a concise summary of the patient's active referrals, recent lab results, current medications, and pending alerts, and prepend as a system message.
     - Call OpenAI chat completion with stream: true (model: gpt-4o-mini or gpt-3.5-turbo).
     - Stream Server-Sent Events (SSE) chunks directly to the response object res.
     - If OPENAI_API_KEY is not configured, provide a robust mock streaming fallback that returns realistic care-coordination responses so development and demo never fail.

2. src/controllers/carebot.controller.js:
   - POST /chat: Takes { message, patientId, sessionId }. Retrieves patient context if patientId provided. Streams response. Saves message history in ChatMessage collection.
   - GET /history/:sessionId: Returns message history for the session.

3. Mount routes at /api/carebot in src/app.js.
4. Create tests/verifyCareBot.js to verify prompt construction and mock streaming behavior.
```

### Automated Verification Step
```bash
cd carelink-backend && node tests/verifyCareBot.js
```
*Expected Result:* Streaming chat endpoint responds with valid SSE events and adheres to guardrail guidelines.

---

## PROMPT 07: Comprehensive Demo Seed Script

### Objective
Create a rich, realistic seed script featuring 3 Madhya Pradesh district hospitals, healthcare accounts, patients, multi-stage referrals, diagnostic results, and drug conflicts.

### Files to Create
- `carelink-backend/src/utils/seed.js`

### Prompt Content
```text
TASK: Create carelink-backend/src/utils/seed.js runnable with `npm run seed`:

1. Clean existing collections: User, Patient, Referral, DiagnosticResult, Medication, Hospital, Alert, ChatMessage.

2. Seed 3 Hospitals in Madhya Pradesh:
   - District Hospital Sagar: Tier 2, specialties: ['General Medicine', 'Orthopedics', 'Pediatrics'], ICU: 4/10 available, hasCT: true, hasMRI: false, currentLoad: 85%, waitTime: 45 min.
   - Netaji Subhash Chandra Bose Medical College, Jabalpur: Tertiary Care, specialties: ['Cardiology', 'Neurology', 'Oncology', 'Nephrology', 'General Surgery'], ICU: 12/30 available, hasCT: true, hasMRI: true, currentLoad: 72%, waitTime: 30 min.
   - AIIMS Bhopal: Apex Tertiary, specialties: ['Cardiology', 'Cardiothoracic Surgery', 'Neurology', 'Oncology', 'Pediatrics'], ICU: 18/40 available, hasCT: true, hasMRI: true, currentLoad: 60%, waitTime: 20 min.

3. Seed 4 Users (all password: "password123"):
   - admin@carelink.in (Role: admin, Name: "Dr. Arvind Sharma (State Coordinator)")
   - dr.verma@sagarphc.in (Role: doctor, Name: "Dr. Rajesh Verma (PHC Sagar)")
   - dr.patel@jabalpurmc.in (Role: doctor, Name: "Dr. Sunita Patel (Cardiologist, Jabalpur MC)")
   - pharma.shukla@carelink.in (Role: pharmacist, Name: "Ramesh Shukla (Chief Pharmacist)")

4. Seed 5 Patients with ABHA IDs (e.g., 23-4567-8901-2345):
   - Suresh Kumar (58, Male, Sagar, suspected cardiac ischemia)
   - Anita Bai (42, Female, Damoh, diabetic nephropathy)
   - Mohanlal Lodhi (65, Male, Rehli, severe hypertension)
   - Priya Vishwakarma (29, Female, Jabalpur, high-risk pregnancy)
   - Ramcharan Gond (51, Male, Chhindwara, chronic respiratory illness)

5. Seed 8 Referrals across stages (0 to 7):
   - Suresh Kumar: Sagar PHC -> Jabalpur MC (Cardiology), Stage 1 (Accepted), Risk: 85 (HIGH - 58km, no transport, 1 missed visit), active care gap alert.
   - Anita Bai: Damoh -> Jabalpur MC (Nephrology), Stage 3 (Patient Arrived), Risk: 45 (MEDIUM).
   - Mohanlal: Rehli -> Sagar DH (Medicine), Stage 6 (Follow-up Done), Risk: 20 (LOW), Closed.
   - Plus 5 more referrals covering all stages.

6. Seed 10 Diagnostic Results (including 2 urgent unreviewed: e.g. Suresh Kumar Troponin-T elevated).
7. Seed 3 Drug Conflicts (e.g. Aspirin + Clopidogrel + Warfarin dual antiplatelet/anticoagulant risk).
8. Seed 5 Active Alerts (referral_gap, diagnostic_pending, drug_conflict).
9. Output a clear formatted console table showing all login credentials and seeded statistics upon completion.
```

### Automated Verification Step
```bash
cd carelink-backend && npm run seed
```
*Expected Result:* Terminal logs successful database population with formatted credential table.

---

## PROMPT 08: Frontend Shell, Design System & Reusable UI Kit

### Objective
Configure the Tailwind design tokens, typography, global CSS variables, responsive layout shell (`Sidebar`, `Header`), and the core reusable UI kit.

### Files to Create
- `carelink-frontend/src/index.css`
- `carelink-frontend/src/utils/constants.js`
- `carelink-frontend/src/utils/api.js`
- `carelink-frontend/src/context/AuthContext.jsx`
- `carelink-frontend/src/context/AppContext.jsx`
- `carelink-frontend/src/components/layout/Sidebar.jsx`
- `carelink-frontend/src/components/layout/Header.jsx`
- `carelink-frontend/src/components/layout/PageContainer.jsx`
- `carelink-frontend/src/components/ui/Button.jsx`
- `carelink-frontend/src/components/ui/Card.jsx`
- `carelink-frontend/src/components/ui/Badge.jsx`
- `carelink-frontend/src/components/ui/StatCard.jsx`
- `carelink-frontend/src/components/ui/RiskScore.jsx`
- `carelink-frontend/src/components/ui/Modal.jsx`
- `carelink-frontend/src/components/ui/Spinner.jsx`

### Prompt Content
```text
TASK: Build the core frontend design system and UI components for CareLink:

1. Styling & Constants:
   - index.css: Define exact variables: --bg-primary (#0D1B2A), --bg-card (#1A2B3C), --bg-elevated (#243447), --accent-teal (#00BFA6), --text-primary (#F0F4F8), --text-secondary (#8892A4), --border-color (#243447), --danger (#FF4757), --warning (#FFA502), --success (#2ED573).
   - Configure global smooth transitions, custom scrollbars, and Inter font.
   - src/utils/api.js: Create Axios instance with baseURL from import.meta.env.VITE_API_BASE_URL. Add request interceptor attaching Bearer token from localStorage, and response interceptor handling 401 unauth.

2. Contexts:
   - AuthContext: user, token, login(email, password), register(data), logout(), isAuthenticated, loading.
   - AppContext: activeAlerts, refreshAlerts(), unreadAlertCount.

3. Layout Components:
   - Sidebar.jsx: Fixed left 240px navy bar. Logo at top with teal pulse. Nav items with Lucide icons: Dashboard, Referrals, Patients, Diagnostics, Medications, Hospital Map, CareBot, Analytics, Settings. Active item has teal pill background. Collapses to 64px on mobile. Bottom user profile card with logout button.
   - Header.jsx: Top bar with breadcrumb/title, active alert bell icon with red count pill, search bar, and user avatar.
   - PageContainer.jsx: Standard padding (px-8 py-6), max-w-7xl, animated fade-in.

4. UI Components:
   - Button.jsx: Variants (primary teal, outline teal, danger red, ghost), sizes, loading state with spinner.
   - Card.jsx: --bg-card background, 1px border --border-color, 12px rounded, hover lift transition.
   - Badge.jsx: Variants (success, warning, danger, teal, info).
   - StatCard.jsx: Icon, label, large numeric metric, trend percentage indicator.
   - RiskScore.jsx: Semicircular SVG gauge animating from 0 to score, color-coded (green/amber/red), factor points table.
   - Modal.jsx: Backdrop blur, animated entrance, accessible close.
```

### Automated Verification Step
```bash
cd carelink-frontend && npm run build
```
*Expected Result:* Zero compiler or bundling errors; production bundle created cleanly.

---

## PROMPT 09: Auth Flow & Main Dashboard View

### Objective
Implement `Login.jsx`, `Register.jsx`, protected route wrapper, and the high-density clinical `Dashboard.jsx`.

### Files to Create
- `carelink-frontend/src/pages/Login.jsx`
- `carelink-frontend/src/pages/Register.jsx`
- `carelink-frontend/src/pages/Landing.jsx`
- `carelink-frontend/src/pages/Dashboard.jsx`
- `carelink-frontend/src/components/dashboard/RecentReferralsTable.jsx`
- `carelink-frontend/src/components/dashboard/ActiveAlertsPanel.jsx`
- `carelink-frontend/src/routes/AppRoutes.jsx`

### Prompt Content
```text
TASK: Implement authentication pages, public landing page, and the primary operations dashboard:

1. Landing.jsx:
   - Dark navy viewport. Nav with CareLink teal logo.
   - Hero: Headline "Healthcare does not fail only inside hospitals. It fails between them."
   - Subtext: "CareLink is the coordination layer that tracks patient journeys across providers and closes care gaps in real time."
   - Interactive preview card on right demonstrating live referral progress and care-gap flag.
   - Metrics strip: 40% referral dropout reduction, 8x faster result review, 100% drug conflicts surfaced.

2. Login.jsx & Register.jsx:
   - Centered dark elevated card, clean form inputs, show/hide password, role selector (Doctor, Admin, Pharmacist).
   - On submit, call AuthContext. Toast notifications on success/error. Redirect to /dashboard.

3. Dashboard.jsx:
   - Top grid: 4 StatCards (Active Referrals, At-Risk Referrals [highlighted red if >0], Pending Diagnostics, Medication Conflicts).
   - Left Column (60%): RecentReferralsTable showing last 10 referrals with Patient Name, ABHA ID, Target Specialty, Stage Progress Bar (0 to 7), Risk Badge (LOW/MED/HIGH), and View Detail action.
   - Right Column (40%): ActiveAlertsPanel showing live unresolved alerts sorted by severity (red/amber/blue borders) with inline "Acknowledge" and "Resolve" actions.
   - Bottom Bar: Quick CareBot question chip launcher.
```

### Automated Verification Step
```bash
cd carelink-frontend && npm run build
```
*Expected Result:* Build succeeds. Navigating to `/` displays landing, `/login` accepts credentials, and `/dashboard` displays populated stats and tables.

---

## PROMPT 10: Referral Management & Lifecycle Engine

### Objective
Implement the full referral workflow: filterable referrals list, 5-step create referral wizard with live risk dial, and referral detail page with real-time stage advancement.

### Files to Create
- `carelink-frontend/src/pages/Referrals.jsx`
- `carelink-frontend/src/pages/ReferralCreate.jsx`
- `carelink-frontend/src/pages/ReferralDetail.jsx`
- `carelink-frontend/src/components/referrals/StageTrackerStepper.jsx`
- `carelink-frontend/src/components/referrals/HospitalRecommendationCard.jsx`

### Prompt Content
```text
TASK: Implement the complete Referral Intelligence frontend module:

1. Referrals.jsx (/referrals):
   - Filter bar: status dropdown, risk level filter (all, high, medium, low), search by patient name.
   - "Create Referral" teal button linking to /referrals/new.
   - Data table with columns: Patient, Age/Gender, From -> To Hospital, Specialty, Stage Stepper, Risk Score, Days Open, Actions.
   - Click row to navigate to /referrals/:id.

2. ReferralCreate.jsx (/referrals/new):
   - 5-Step Wizard with progress bar:
     * Step 1: Patient Selection (search existing patient or quick-create modal).
     * Step 2: Referral Details (target specialty, clinical urgency dropdown, referral notes).
     * Step 3: Hospital Selection (calls /api/hospitals/recommend, displays top 3 cards with score, distance, ICU availability, doctor selected).
     * Step 4: Real-time Risk Assessment (displays animated RiskScore semicircular gauge, penalty breakdown table, risk level badge, recommended mitigation).
     * Step 5: Summary & Confirm. Submits to POST /api/referrals. Redirects to detail page.

3. ReferralDetail.jsx (/referrals/:id):
   - Header with patient name, ABHA ID, urgency badge, and high-risk subtle red glow.
   - StageTrackerStepper: Horizontal 7-stage stepper (Created -> Accepted -> Appointment Booked -> Arrived -> Consulted -> Treatment -> Follow-up).
   - "Advance Stage" button: opens confirmation modal with notes field. Advancing stage calls PUT /api/referrals/:id/stage, instantly updates stepper, and removes resolved care-gap alerts!
   - Risk Score panel on side with itemized factors.
   - Timeline of stage history with timestamps and user names.
   - "Send Twilio SMS" action button for urgent follow-up.
```

### Automated Verification Step
```bash
cd carelink-frontend && npm run build
```
*Expected Result:* Build succeeds; test creating a referral and advancing its stage from 0 to 1 without reload.

---

## PROMPT 11: Diagnostics Tracker & Medication Reconciliation

### Objective
Implement the Diagnostic Tracker with AI classification reasoning tooltips, and the Medication Reconciliation module with cross-provider conflict detection.

### Files to Create
- `carelink-frontend/src/pages/DiagnosticTracker.jsx`
- `carelink-frontend/src/pages/MedicationReconcile.jsx`
- `carelink-frontend/src/pages/PatientTimeline.jsx`
- `carelink-frontend/src/components/medications/ConflictCard.jsx`
- `carelink-frontend/src/components/diagnostics/ResultModal.jsx`

### Prompt Content
```text
TASK: Build Diagnostic Tracker, Medication Reconciliation, and Patient Timeline:

1. DiagnosticTracker.jsx (/diagnostics):
   - Stats summary: Total tests ordered, Awaiting review count (amber), Urgent unreviewed (red).
   - Filterable results table: Patient, Test Name, Ordered Date, Result Value & Normal Range, Classification Badge (Normal green, Review Needed amber, Urgent red), Action.
   - Hover on classification badge shows AI reasoning tooltip with key findings.
   - Action buttons: "Mark Reviewed", "Mark Patient Informed", "Mark Action Taken". Overdue results (>48h) highlighted with pulse.

2. MedicationReconcile.jsx (/medications):
   - Two-column layout:
     * Left Column: Patient selector and current active medications list by provider. "Add New Prescription" button.
     * Right Column: Reconciliation & Conflict Panel. Shows detected drug conflicts as cards with red borders. Each card displays: Drug A vs. Drug B, Severity badge, plain-English explanation, Source badge ("OpenFDA API" or "Clinical Rules"), and "Mark Resolved" button for pharmacists.

3. PatientTimeline.jsx (/patients/:id/timeline):
   - Patient header with demographic and clinical summary.
   - Chronological vertical timeline with color-coded nodes: teal for referral transitions, blue for lab results, purple for prescriptions, red for care-gap alerts.
   - Document upload simulator with instant structured information extraction.
   - "Query CareBot About This Patient" button that navigates to CareBot with patient context attached.
```

### Automated Verification Step
```bash
cd carelink-frontend && npm run build
```
*Expected Result:* Clean build. Diagnostic actions update state and medication conflicts render with severity badges.

---

## PROMPT 12: CareBot Chat, Hospital Map & Analytics Visualizations

### Objective
Implement the full-page streaming CareBot chat interface, the interactive Hospital Capacity Map, and the executive Analytics dashboard.

### Files to Create
- `carelink-frontend/src/pages/CareBot.jsx`
- `carelink-frontend/src/pages/HospitalMap.jsx`
- `carelink-frontend/src/pages/Analytics.jsx`
- `carelink-frontend/src/pages/Settings.jsx`
- `carelink-frontend/src/components/carebot/ChatMessageItem.jsx`

### Prompt Content
```text
TASK: Implement CareBot, Hospital Directory & Analytics:

1. CareBot.jsx (/carebot):
   - Chat interface with left session history sidebar and main chat window.
   - Markdown rendering for assistant messages (bullet points, bold text, citations).
   - Bottom input bar with full-width text input, send button, and "Attach Patient" context chip.
   - Suggested prompt chips: "Which referrals are at risk right now?", "Show pending urgent lab results", "Is there an available ICU bed in Jabalpur?".
   - Streaming SSE implementation: renders tokens word-by-word in real time.

2. HospitalMap.jsx (/hospitals):
   - Left panel (35%): Specialty filter, District selector, CT/MRI checkboxes, max distance slider.
   - Right panel (65%): Grid of hospital cards showing capacity metrics, specialist schedule today, and ICU bed availability progress bars.
   - "Test Recommendation" tool: enter clinical parameters to see dynamic hospital scoring.

3. Analytics.jsx (/analytics):
   - Recharts visual dashboard:
     * Chart 1: Line Chart - Referral Completion Rate over last 8 weeks.
     * Chart 2: Pie / Donut Chart - Current Referrals by Stage (0 to 7).
     * Chart 3: Bar Chart - Risk Score Distribution (Low, Medium, High).
     * Chart 4: Horizontal Bar Chart - Referrals by Hospital volume.
     * Chart 5: Line Chart - Average diagnostic review delay in hours.
   - Top KPI cards: Completion % this month, Average care-gap duration, Drug conflicts resolved.
   - Export CSV button.

4. Settings.jsx (/settings):
   - Profile management, hospital capacity editor (admin only), and SMS notification threshold settings.
```

### Automated Verification Step
```bash
cd carelink-frontend && npm run build
```
*Expected Result:* Clean build. Charts render without SVG errors and CareBot handles streaming text tokens.

---

## PROMPT 13: Responsiveness, End-to-End Polish & Documentation

### Objective
Finalize mobile responsiveness (375px width), micro-interactions, empty states, root README.md documentation, and an automated end-to-end smoke test script.

### Files to Create or Modify
- `carelink-frontend/src/components/layout/MobileNav.jsx`
- `carelink-frontend/src/components/ui/SkeletonLoader.jsx`
- `carelink-frontend/src/components/ui/EmptyState.jsx`
- `README.md`
- `tests/e2eSmokeTest.sh`

### Prompt Content
```text
TASK: Finalize CareLink with mobile responsiveness, UI polish, and comprehensive documentation:

1. Mobile Responsiveness:
   - Add MobileNav.jsx: bottom navigation bar with icons (Home, Referrals, Patients, CareBot, More).
   - Test layout at 375px: tables scroll horizontally inside cards, grids stack to 1 column.
   - Stepper wraps smoothly on smaller screens.

2. Polish & Micro-interactions:
   - Add Framer Motion page transitions (opacity 0.2s ease-in).
   - Add SkeletonLoader.jsx for all loading states.
   - Add EmptyState.jsx with geometric SVG illustration for empty searches and completed queues.

3. Documentation (README.md):
   - Project Name, Tagline: "Closing the gaps between healthcare handoffs."
   - 3-sentence Problem Statement & System Architecture Diagram.
   - Complete Tech Stack table.
   - Quickstart guide:
     1. npm install (in both folders)
     2. Configure .env
     3. npm run seed
     4. npm run dev
   - Demo Credentials Table (admin, doctor, pharmacist).
   - Step-by-step 5-minute hackathon demo walkthrough based on Section 21 of Roadmap.md.

4. tests/e2eSmokeTest.sh:
   - Script that executes: backend health check -> seed database -> login API call -> create referral API -> advance stage API -> verify alert resolution.
```

### Automated Verification Step
```bash
bash tests/e2eSmokeTest.sh
```
*Expected Result:* All smoke tests pass, verifying the full end-to-end flow from seeding to referral lifecycle completion.

---

## Recommended Execution Flow

To build the entire prototype autonomously in Antigravity:
1. Open this file and invoke the `/goal` command:
   ```text
   /goal Execute Technical.md from Prompt 01 to Prompt 13 sequentially. Check and verify each step with its automated verification command before advancing to the next.
   ```
2. The agent will execute each atomic prompt, run tests, verify functionality, and confirm completion at every milestone.
