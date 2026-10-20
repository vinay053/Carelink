# DEVELOPMENT_LOG.md — Chronological Engineering & Troubleshooting Log

This log documents all technical investigations, critical architectural decisions, troubleshooting resolutions, and developmental milestones for the **CareLink** platform.

---

## Session Record: October 2026

### 1. Initial State & Problem Analysis
- Cloned repository from `https://github.com/vinay053/Carelink.git`.
- Identified project structure:
  - `carelink-backend`: Node.js Express server with Mongoose ODM and SMS/email services.
  - `carelink-frontend`: React 18 single-page application built with Vite and Tailwind CSS.
- The original frontend contained incomplete views and inconsistent styling across clinical modules.

### 2. Resolution of macOS AirPlay Conflict (HTTP 403 Forbidden)
- **Symptom:** Chrome showed `Access to localhost was denied (HTTP ERROR 403)` when attempting to load API routes on port 5000.
- **Root Cause:** macOS Monterey/Ventura/Sonoma runs Apple's built-in AirPlay Receiver (`AirTunes`) inside the `ControlCenter` process, bound to wildcard `*:5000`. When web browsers resolve `localhost:5000` via IPv6 loopback (`::1:5000`), AirPlay returns `HTTP 403 Forbidden` or `Direct IP access is not allowed`.
- **Engineering Fix:**
  1. Updated `carelink-backend/src/server.js` to bind explicitly to `127.0.0.1` (`HOST=127.0.0.1`, `PORT=5000`).
  2. Updated `carelink-frontend/vite.config.js` with an automated proxy route forwarding `/api` calls directly to `http://127.0.0.1:5000`.
  3. Added hostname normalization in `carelink-frontend/src/utils/api.js` to rewrite any occurrences of `localhost:5000` to `127.0.0.1:5000`.

### 3. Database Resilience & Seeding
- **Symptom:** `MONGODB_URI` contained dummy placeholder `mongodb+srv://your-connection-string`, causing DNS query failures (`ECONNREFUSED _mongodb._tcp.your-connection-string`).
- **Engineering Fix:**
  - Enhanced `carelink-backend/src/utils/database.js` to detect placeholder strings and gracefully fall back to local MongoDB (`mongodb://localhost:27017/carelink`).
  - Executed clinical database seeder (`src/utils/seed.js`) generating realistic healthcare facilities (Sagar PHC, Jabalpur Medical College, Bhopal AIIMS), verified doctors, ABDM-compliant patients, and referrals with attached diagnostic records.

### 4. Complete Design System Overhaul (Theme: Skill Setu / Kawach)
- Standardized all design variables in `carelink-frontend/src/index.css`:
  - Deep Navy primary background (`#0D1B2A`).
  - Card background (`#1A2B3C`) with 12px border radius.
  - Accent Teal (`#00BFA6`) for high-priority CTA actions and highlights.
  - Clinical status colors: Red (`#FF4757`) for critical, Amber (`#FFA502`) for warning, Green (`#2ED573`) for completed stages.
- Created reusable components:
  - `src/components/ui/Button.jsx`: Variants (primary, secondary, danger, ghost), loading spinners, active scale effect.
  - `src/components/ui/Card.jsx`: Consistent elevation, padding props, subtle hover shadows.
  - `src/components/ui/Input.jsx`: Form inputs with integrated icon slots and floating labels.
  - `src/components/ui/Badge.jsx`: Pill badges for clinical statuses and urgency tiers.
  - `src/components/ui/StatCard.jsx`: Executive metric cards with trends and icons.
  - `src/components/ui/RiskScore.jsx`: Custom SVG semicircular gauge with smooth requestAnimationFrame animations.
  - `src/components/ui/Modal.jsx`, `Spinner.jsx`, `Skeleton.jsx`, `EmptyState.jsx`.

### 5. Frontend Pages Rebuild & Integration
- **`Landing.jsx`**: Complete overhaul with live metrics, quick demo logins, and features grid.
- **`Login.jsx` & `Register.jsx`**: Seamless authentication with pre-filled test personas.
- **`Dashboard.jsx`**: Real-time KPI statistics, active care gap alerts, and quick referral triage.
- **`Referrals.jsx`**: Comprehensive table directory with status/urgency filtering, search, pagination, and direct links to referral details.
- **`Settings.jsx`**: Facility configurations, notification thresholds, SLA configurations, and security settings.
- **`AppRoutes.jsx`**: Wrapped all routes in structured `ProtectedRoute` and `PublicRoute` handlers to prevent layout tearing.

### 6. Verification & Build Confirmation
- Executed `npm run build` in `carelink-frontend`: Vite production bundle created with 0 errors.
- Verified all client-side navigation paths, API request normalization, and demo persona logins.
