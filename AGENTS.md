# AGENTS.md — Agent System & Development Protocol for CareLink

> **Context for Autonomous AI Agents & Developers:**
> CareLink is a full-stack Healthcare Referral Coordination & Patient Continuity Platform designed for the Indian public and private healthcare continuum (District Hospitals, Community Health Centers, and Primary Health Centers).

---

## 1. System Overview & Architecture Identity

- **Repository**: `vinay053/Carelink`
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Recharts, React Hot Toast.
- **Backend**: Node.js, Express, MongoDB/Mongoose, Node-cron, JWT, Bcrypt.
- **AI Engine**: CareBot AI multi-engine coordinator (Gemini 3.5 Flash-Lite / OpenAI fallback).
- **Public Health Framework**: ABDM (Ayushman Bharat Digital Mission) compliance, ABHA ID linkage, 6-stage clinical referral handoff workflow, and automated care-gap detection.

---

## 2. Environment & Network Routing Rules (CRITICAL)

### macOS AirPlay Port 5000 Intercept
- **Issue**: macOS `ControlCenter` binds to `*:5000` for Apple AirTunes / AirPlay Receiver. Direct web requests to `http://localhost:5000` via Chrome or browser resolve over IPv6 (`::1:5000`), yielding **`HTTP 403 Forbidden`**.
- **Rule for Backend**: Always bind Express explicitly to `127.0.0.1` (`HOST=127.0.0.1`, `PORT=5000`).
- **Rule for Frontend**:
  - `vite.config.js` must proxy `/api` requests to `http://127.0.0.1:5000`.
  - `src/utils/api.js` automatically rewrites any incoming `localhost:5000` to `127.0.0.1:5000` and normalizes paths to ensure `/api` prefixing.
  - Frontend development server runs on `http://localhost:5173`.

---

## 3. UI/UX Design System Specification (Theme: "Skill Setu / Kawach")

All components must strictly adhere to the designated color variables and design tokens in `src/index.css`:

```css
:root {
  --bg-primary: #0D1B2A;       /* Deep Navy background */
  --bg-card: #1A2B3C;          /* Card and panel background */
  --bg-elevated: #243447;      /* Hover states, dropdowns, inputs */
  --accent-teal: #00BFA6;      /* Primary actionable accent */
  --accent-teal-hover: #00A896;
  --accent-teal-dim: rgba(0, 191, 166, 0.08);
  --text-primary: #F0F4F8;     /* High-contrast crisp readable text */
  --text-secondary: #8892A4;   /* Labels, hints, timestamps */
  --text-teal: #00BFA6;
  --border-color: #243447;     /* 1px subtle structure borders */
  --danger: #FF4757;           /* High risk, critical SLAs */
  --danger-dim: rgba(255, 71, 87, 0.08);
  --warning: #FFA502;          /* Moderate risk, pending stages */
  --warning-dim: rgba(255, 165, 2, 0.08);
  --success: #2ED573;          /* Low risk, completed stages */
  --success-dim: rgba(46, 213, 115, 0.08);
  --shadow-card: 0 4px 24px rgba(0, 0, 0, 0.3);
  --shadow-hover: 0 8px 32px rgba(0, 0, 0, 0.4);
  --radius-card: 12px;
  --radius-btn: 8px;
}
```

### Component Guidelines
- **Typography**: Inter (Google Fonts), clean weights (400, 500, 600, 700).
- **Buttons (`src/components/ui/Button.jsx`)**:
  - `primary`: solid teal background, white text.
  - `secondary`: transparent with 1px teal border and teal text.
  - `danger`: solid `#FF4757` background with white text.
  - `ghost`: transparent, subtle text hover.
  - Active state: `transform: scale(0.97)`.
  - Loading state: SVG spinning indicator.
- **Card (`src/components/ui/Card.jsx`)**:
  - 1px border `var(--border-color)`, background `var(--bg-card)`, radius 12px.
- **Risk Score Gauge (`src/components/ui/RiskScore.jsx`)**:
  - Semicircular SVG gauge rendering 0–100 risk score with dynamic arc animation using `requestAnimationFrame`.
  - Color brackets: Low (0–39, `#2ED573`), Medium (40–69, `#FFA502`), High (70–100, `#FF4757`).

---

## 4. Referral Lifecycle & Business Logic

Referrals transition across 6 deterministic stages:
1. **`referred`**: Referral initiated by referring facility (PHC/CHC).
2. **`accepted`**: Target specialist hospital reviews and accepts the referral.
3. **`transport`**: Patient is in transit; ambulance / transport assigned.
4. **`arrived`**: Patient reaches receiving hospital; triage check-in.
5. **`admitted`**: Specialist consultation, inpatient admission, or procedure started.
6. **`discharged`**: Counter-referral or discharge summary published back to originating facility.

### Care Gap Detection
The backend cron (`careGap.service.js`) runs periodically and checks referrals against configured SLA escalation thresholds:
- Critical urgency: 12 hours SLA.
- High urgency: 24 hours SLA.
- Moderate urgency: 48 hours SLA.
- Stalled stages generate automated `Alert` documents and trigger SMS/Email notifications.

---

## 5. Standard Test Credentials

The database seed (`npm run seed`) provisions the following verified accounts:
- **Referring Doctor**: `dr.verma@sagarphc.in` / `password123` (Role: Doctor, Facility: Sagar PHC)
- **Specialist Cardiologist**: `dr.patel@jabalpurmc.in` / `password123` (Role: Doctor, Facility: Jabalpur Medical College)
- **State Health Admin**: `admin@carelink.in` / `password123` (Role: Admin, State Care Coordinator)
