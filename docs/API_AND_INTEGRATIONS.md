# API_AND_INTEGRATIONS.md — REST API Endpoints & Third-Party Integrations

## 1. REST API Specification

All endpoints are mounted under `/api` and require a `Bearer <token>` in the `Authorization` header, except `/api/auth/login` and `/api/auth/register`.

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new clinical user.
- `POST /api/auth/login` — Authenticate and receive JWT token + user profile.
- `GET /api/auth/profile` — Get authenticated user details.
- `PUT /api/auth/profile` — Update user details.
- `PUT /api/auth/notifications` — Update notification preferences and SLA thresholds.
- `PUT /api/auth/password` — Change password.

### Referrals (`/api/referrals`)
- `GET /api/referrals` — Query referrals with filters (`status`, `urgency`, `specialty`, `search`, `limit`, `page`).
- `POST /api/referrals` — Initiate new referral (calculates risk score and dispatches notifications).
- `GET /api/referrals/:id` — Retrieve full referral details including clinical timeline and attachments.
- `PUT /api/referrals/:id/stage` — Advance referral stage (`referred` -> `accepted` -> `transport` -> `arrived` -> `admitted` -> `discharged`).

### Patients (`/api/patients`)
- `GET /api/patients` — Search patient registry by name or ABHA ID.
- `GET /api/patients/:id` — Patient profile.
- `GET /api/patients/:id/timeline` — Unified clinical journey combining referrals, labs, and medications.

### Diagnostics (`/api/diagnostics`)
- `GET /api/diagnostics` — List diagnostic results with urgency filters.
- `PUT /api/diagnostics/:id/review` — Mark diagnostic test as reviewed.

### Medications (`/api/medications`)
- `GET /api/medications` — Active prescriptions across facilities.
- `POST /api/medications/reconcile` — Execute pairwise drug-drug interaction analysis.
- `PUT /api/medications/:id/resolve` — Clinical pharmacist resolution of flagged conflict.

### Hospitals & Matching (`/api/hospitals`)
- `GET /api/hospitals` — List all facilities with live bed availability.
- `GET /api/hospitals/recommend` — Intelligent referral recommendation based on required specialty, ICU beds, and travel distance.

### Alerts (`/api/alerts`)
- `GET /api/alerts` — Active care gap alerts.
- `PUT /api/alerts/:id/acknowledge` — Acknowledge alert.
- `PUT /api/alerts/:id/resolve` — Mark alert resolved.

### Analytics (`/api/analytics`)
- `GET /api/analytics/overview` — High-level KPI metrics (total referrals, completion rate, care gaps).
- `GET /api/analytics/stage-breakdown` — Distribution of referrals across 6 stages.
- `GET /api/analytics/completion-trend` — Weekly completion rate trend data.
- `GET /api/analytics/risk-distribution` — Low/Medium/High risk cohort breakdown.

### CareBot AI (`/api/carebot`)
- `POST /api/carebot/chat` — Send message to clinical coordinator AI.
- `GET /api/carebot/history` — Fetch conversation history.

---

## 2. Third-Party Integrations

1. **Twilio SMS Service (`twilio.service.js`)**: Dispatches SMS alerts to clinicians and patients upon critical urgency referral creation or SLA escalation.
2. **OpenFDA Drug Interaction API (`openfda.service.js`)**: Queries the FDA adverse event and label databases for contraindications and drug interactions.
3. **Google Gemini / OpenAI AI Engine (`carebot.service.js`)**: Evaluates unstructured doctor notes and formulates structured referral recommendations without hallucinating diagnostic claims.
