# CareLink: Healthcare Continuity & Referral Intelligence Platform

> **Closing the gaps between healthcare handoffs.**

---

## 1. Problem Statement
Healthcare does not fail only inside hospitals — it can fail between them. Patients frequently move across Primary Health Centres (PHCs), district hospitals, laboratories, and specialized clinics, but digital health records only record isolated transactions without monitoring whether the complete journey is progressing. When a referral is delayed, an urgent lab result goes unreviewed, or conflicting medications are prescribed across facilities, patients fall through the cracks undetected. CareLink is the continuous orchestration and intelligence layer designed to track patient handoffs, predict dropout risks, and ensure closed-loop clinical follow-up.

---

## 2. System Architecture

```text
               HEALTHCARE EVENTS
     (Referrals • Labs • Prescriptions • Appointments)
                       │
                       ▼
            ┌─────────────────────┐
            │   CARELINK ENGINE   │
            └──────────┬──────────┘
                       │
       ┌───────────────┼───────────────┐
       ↓               ↓               ↓
   REFERRAL       CONTINUITY        CAREBOT
  INTELLIGENCE   INTELLIGENCE    ORCHESTRATION
  (SLA Stepper)  (Labs & Meds)   (AI Assistant)
       │               │               │
       └───────────────┼───────────────┘
                       ▼
             CARE GAP DETECTED
       (Overdue Stage • Conflict • Abnormal Lab)
                       │
                       ▼
              HUMAN-IN-THE-LOOP
     (Doctor / Pharmacist / ASHA Worker)
                       │
                       ▼
             CLOSED-LOOP ACTION
```

---

## 3. Technology Stack

| Layer | Technologies | Role / Responsibility |
|---|---|---|
| **Frontend** | React 18, Vite, TailwindCSS | Responsive dark-mode clinical dashboard (`#0D1B2A` & `#00BFA6`) |
| **Routing & State** | React Router v6, Context API | Protected route guards, session persistence, live alert context |
| **Visualizations** | Recharts, Framer Motion | Referral completion trends, stage donuts, animated risk gauges |
| **Icons & Notifications** | Lucide React, React Hot Toast | Clinical iconography and real-time toast feedback |
| **Backend API** | Node.js, Express.js | Modular REST endpoints with JWT authentication and role-based guards |
| **Database & ODM** | MongoDB (via Docker), Mongoose | 8 relational schemas tracking referrals, diagnostics, and medications |
| **Background Scheduler** | node-cron | Automated 4-hour SLA auditing detecting overdue referral stages |
| **AI Coordinator** | OpenAI API + Local Stream Engine | Ground-truth context injection and streaming Server-Sent Events (SSE) |
| **Drug Safety Engine** | OpenFDA + Deterministic Rules | Pairwise cross-facility drug interaction and conflict detection |
| **Containerization** | Docker, Docker Compose | Zero-friction local MongoDB container running on port `27017` |

---

## 4. Quickstart Guide (100% Local Execution)

### Step 1: Start the Local Database Container
```bash
docker compose up -d
```

### Step 2: Set Up & Seed Backend
```bash
cd carelink-backend
npm install
npm run seed     # Populates Madhya Pradesh facilities, patients, and referrals
npm run dev      # Starts server on http://127.0.0.1:5000 (binds to 127.0.0.1 to avoid macOS AirPlay conflicts)
```

### Step 3: Set Up & Launch Frontend
```bash
cd carelink-frontend
npm install
npm run dev      # Starts UI on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## 4.1 Comprehensive Documentation & Handover Suite

| Category | File | Description |
|---|---|---|
| **AI & Continuity** | [AGENTS.md](file:///Users/shivamrai/.gemini/antigravity/scratch/Carelink/AGENTS.md) | Agent system instructions, design tokens, & developer protocol |
| **AI Handover** | [docs/AI_HANDOVER.md](file:///Users/shivamrai/.gemini/antigravity/scratch/Carelink/docs/AI_HANDOVER.md) | Zero-loss knowledge transfer protocol for future AI chats |
| **Recovery Guide** | [docs/RECOVERY_GUIDE.md](file:///Users/shivamrai/.gemini/antigravity/scratch/Carelink/docs/RECOVERY_GUIDE.md) | Clean-slate machine restoration and instant setup |
| **Operational Health**| [PROJECT_STATUS.md](file:///Users/shivamrai/.gemini/antigravity/scratch/Carelink/PROJECT_STATUS.md) | Real-time subsystem health & module verification matrix |
| **Engineering Log** | [DEVELOPMENT_LOG.md](file:///Users/shivamrai/.gemini/antigravity/scratch/Carelink/DEVELOPMENT_LOG.md) | Chronological record of technical fixes & AirPlay resolution |
| **Architecture** | [docs/ARCHITECTURE.md](file:///Users/shivamrai/.gemini/antigravity/scratch/Carelink/docs/ARCHITECTURE.md) | High-level system architecture & data flow diagrams |
| **File Structure** | [docs/FILE_STRUCTURE.md](file:///Users/shivamrai/.gemini/antigravity/scratch/Carelink/docs/FILE_STRUCTURE.md) | Complete directory tree and file manifest |
| **Setup Guide** | [docs/SETUP_AND_INSTALLATION.md](file:///Users/shivamrai/.gemini/antigravity/scratch/Carelink/docs/SETUP_AND_INSTALLATION.md) | Prerequisites and step-by-step local installation |
| **Run & Build** | [docs/RUN_AND_BUILD.md](file:///Users/shivamrai/.gemini/antigravity/scratch/Carelink/docs/RUN_AND_BUILD.md) | Dev server execution and production bundling |
| **Environment** | [docs/ENVIRONMENT_CONFIGURATION.md](file:///Users/shivamrai/.gemini/antigravity/scratch/Carelink/docs/ENVIRONMENT_CONFIGURATION.md) | All backend and frontend environment variables |
| **Database & Models**| [docs/DATABASE_AND_DATA.md](file:///Users/shivamrai/.gemini/antigravity/scratch/Carelink/docs/DATABASE_AND_DATA.md) | Mongoose schemas and clinical cohort seeding details |
| **REST API** | [docs/API_AND_INTEGRATIONS.md](file:///Users/shivamrai/.gemini/antigravity/scratch/Carelink/docs/API_AND_INTEGRATIONS.md) | Full endpoint reference and external integrations |
| **Design System** | [docs/UI_AND_DESIGN_GUIDE.md](file:///Users/shivamrai/.gemini/antigravity/scratch/Carelink/docs/UI_AND_DESIGN_GUIDE.md) | Skill Setu / Kawach theme tokens & UI components |
| **Business Logic** | [docs/BUSINESS_LOGIC.md](file:///Users/shivamrai/.gemini/antigravity/scratch/Carelink/docs/BUSINESS_LOGIC.md) | Dropout risk scoring algorithm and SLA auditor rules |
| **Workflows** | [docs/FEATURES_AND_WORKFLOWS.md](file:///Users/shivamrai/.gemini/antigravity/scratch/Carelink/docs/FEATURES_AND_WORKFLOWS.md) | Clinical user journeys and referral handoff steps |
| **Testing & QA** | [docs/TESTING_AND_VALIDATION.md](file:///Users/shivamrai/.gemini/antigravity/scratch/Carelink/docs/TESTING_AND_VALIDATION.md) | Model, auth, and route verification test suite |
| **Known Quirks** | [docs/KNOWN_ISSUES.md](file:///Users/shivamrai/.gemini/antigravity/scratch/Carelink/docs/KNOWN_ISSUES.md) | AirPlay 403 mitigation and database connection fallbacks |
| **Decisions (ADRs)**| [docs/DECISIONS_AND_RATIONALE.md](file:///Users/shivamrai/.gemini/antigravity/scratch/Carelink/docs/DECISIONS_AND_RATIONALE.md) | Architectural decision records |
| **Roadmap** | [docs/FUTURE_ROADMAP.md](file:///Users/shivamrai/.gemini/antigravity/scratch/Carelink/docs/FUTURE_ROADMAP.md) | Multiphase product roadmap (WebSockets, ABDM, PWA) |
| **Next Actions** | [docs/NEXT_SESSION_ACTION_PLAN.md](file:///Users/shivamrai/.gemini/antigravity/scratch/Carelink/docs/NEXT_SESSION_ACTION_PLAN.md) | Priority backlog for the next development session |
| **Changelog & Tasks**| [CHANGELOG.md](file:///Users/shivamrai/.gemini/antigravity/scratch/Carelink/CHANGELOG.md) & [TODO.md](file:///Users/shivamrai/.gemini/antigravity/scratch/Carelink/TODO.md) | Version history and upcoming tasks |

---

## 5. Demo Credentials (Madhya Pradesh Clinical Cohort)

All accounts share the default development password: **`password123`**

| Role | Email | Facility / Location | Primary Capability |
|---|---|---|---|
| **State Coordinator (Admin)** | `admin@carelink.in` | NSCB Medical College, Jabalpur | System overview, capacity metrics, district KPIs |
| **Referring Doctor (PHC)** | `dr.verma@sagarphc.in` | District Hospital Sagar | Referral initiation, patient registry, risk dial |
| **Specialist (Cardiologist)** | `dr.patel@jabalpurmc.in` | NSCB Medical College, Jabalpur | Stage progression, lab review, consult notes |
| **Chief Pharmacist** | `pharma.shukla@carelink.in` | Regional Care Network | Cross-provider medication conflict resolution |

---

## 6. Step-by-Step 5-Minute Hackathon Demo Flow

1. **The Broken Handoff (Landing & Login):**
   - Open `/` and review the thesis: *"Healthcare fails between hospitals."*
   - Sign in as **Dr. Verma** (`dr.verma@sagarphc.in`).
2. **Clinical Dashboard & Live Care Gaps (`/dashboard`):**
   - Point out the 4 StatCards: note the **At-Risk Referrals** and **Active Care Gaps**.
   - Note the red alert banner for patient **Suresh Kumar** (Stage 1 overdue by >24 hours).
3. **Dropout Risk Scoring & Referral Detail (`/referrals/:id`):**
   - Open Suresh Kumar's referral.
   - Show the **animated SVG risk dial (85/100 HIGH RISK)** and itemized factors: 58km travel distance, lack of private vehicle, and delayed appointment.
   - Advance the stage to **Appointment Booked**: observe the stepper turn teal and watch the care-gap alert **automatically resolve** in real time!
4. **Diagnostic Follow-up Tracking (`/diagnostics`):**
   - Switch to the Diagnostics Tracker.
   - Review Suresh Kumar's urgent **Troponin-T** result (0.14 ng/mL). Hover on the AI badge to show the clinical reasoning tooltip. Click **Mark Action Taken** to close the diagnostic gap.
5. **Cross-Provider Medication Reconciliation (`/medications`):**
   - View Suresh Kumar's medications across two different facilities (Sagar DH & Jabalpur MC).
   - Show the flagged high-severity discrepancy: **Aspirin + Warfarin** bleeding hazard.
   - Click **Resolve Conflict** to demonstrate clinical pharmacist sign-off.
6. **Unified Patient Journey (`/patients/:id/timeline`):**
   - Open Suresh Kumar's chronological timeline.
   - Show the single vertical journey combining registration, referral handoff, lab test, and prescription reconciliation.
7. **Ask CareBot AI (`/carebot`):**
   - Click *"Summarize patient Suresh Kumar journey"*.
   - Watch CareBot stream an evidence-backed summary citing specific dates and risk scores without diagnosing.
8. **Executive Analytics (`/analytics`):**
   - Show the Recharts trend: 8-week referral completion rate climbing from 42% to 89% and export the JSON report.
