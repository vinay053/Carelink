# AI_HANDOVER.md — Comprehensive Knowledge Transfer for Future AI Agents

> **Instructions for the Incoming AI Assistant:**
> You are reading this handover document because the developer has started a new conversation and requested your assistance on the **CareLink** project.
> Read this document completely before proposing or applying changes.

---

## 1. Project Identity & Architecture
- **Name:** CareLink (Healthcare Continuity & Referral Intelligence Platform).
- **Core Problem Solved:** Preventing patient dropouts and uncoordinated handoffs across primary, secondary, and tertiary public healthcare institutions.
- **Backend:** Node.js, Express, MongoDB (Mongoose), node-cron (care gap auditor), Twilio, Gemini 3.5 Flash-Lite / OpenAI.
- **Frontend:** React 18, Vite 6, Tailwind CSS, Lucide React, Recharts, React Hot Toast.
- **Design System:** Skill Setu / Kawach Theme (`#0D1B2A` base, `#1A2B3C` cards, `#00BFA6` teal actionable accent).

---

## 2. Inviolable Operational Rules

1. **macOS Port 5000 AirPlay Conflict:**
   - NEVER bind backend to wildcard `0.0.0.0` or direct client requests to `localhost:5000`. macOS AirPlay Receiver intercepts port 5000 on IPv6 loopback (`::1`), resulting in `HTTP 403 Forbidden`.
   - ALWAYS bind Express to `127.0.0.1:5000` (`HOST=127.0.0.1`).
   - ALWAYS use the Vite proxy or `127.0.0.1:5000` for frontend API requests.
2. **Design Tokens:**
   - NEVER use random hex codes for surfaces or colors in JSX components. ALWAYS use standard CSS variables (`var(--bg-primary)`, `var(--bg-card)`, `var(--accent-teal)`, `var(--text-primary)`, `var(--border-color)`).
3. **API Normalization:**
   - All REST endpoints are mounted under `/api`.
   - `src/utils/api.js` automatically prepends `/api` if missing and attaches the JWT `Authorization: Bearer <token>` header.
4. **Referral Stepper Determinism:**
   - Stages follow strict clinical progression: `referred` -> `accepted` -> `transport` -> `arrived` -> `admitted` -> `discharged`.
   - Stage progression automatically marks associated care-gap SLA alerts as `resolved`.

---

## 3. Seed Credentials & Test Data

The database seeder (`npm run seed` in `carelink-backend`) provisions:
- **Referring Doctor:** `dr.verma@sagarphc.in` / `password123`
- **Receiving Cardiologist:** `dr.patel@jabalpurmc.in` / `password123`
- **State Health Admin:** `admin@carelink.in` / `password123`
- **Lead Pharmacist:** `pharma.shukla@carelink.in` / `password123`

---

## 4. Key Documentation Index
- `AGENTS.md` — Agent and developer protocol
- `PROJECT_STATUS.md` — Current system health and module verification
- `DEVELOPMENT_LOG.md` — Chronological record of architectural decisions and fixes
- `docs/ARCHITECTURE.md` — System architecture and data flow diagrams
- `docs/BUSINESS_LOGIC.md` — Dropout risk algorithm and SLA escalation formulas
- `docs/RECOVERY_GUIDE.md` — Zero-context machine recovery instructions
