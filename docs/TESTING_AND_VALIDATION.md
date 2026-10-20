# TESTING_AND_VALIDATION.md — Quality Assurance & Test Verification

## 1. Test Architecture

The CareLink test suite validates data models, authentication flows, business logic services, and API routing.

### Backend Verification Scripts (`carelink-backend/tests/`)
1. **`verifyModels.js`**: Validates Mongoose schema constraints, default values, required fields, and index constraints.
2. **`verifyAuth.js`**: Tests registration, duplicate email rejection, bcrypt password hashing, JWT generation, and token expiration logic.
3. **`verifyServices.js`**: Unit tests for `riskScore.service.js`, `drugSafety.service.js`, and `hospital.service.js`.
4. **`verifyApiRoutes.js`**: Comprehensive route integration tests for `/api/referrals`, `/api/patients`, `/api/hospitals`, and `/api/alerts`.

---

## 2. Running Backend Tests

```bash
cd carelink-backend
npm test
```
*Note: Ensure local MongoDB is running (`mongodb://localhost:27017/carelink`) before running integration tests.*

---

## 3. Frontend Quality & Production Build Validation

### Production Compilation
```bash
cd carelink-frontend
npm run build
```
Validates:
- Strict JSX syntax and React 18 component rendering.
- Tailwind CSS purging and custom CSS variable resolution.
- Module resolution across Lucide React, Recharts, and React Hot Toast.
- Zero unresolved imports or type errors.

---

## 4. End-to-End Smoke Test Checklist

- [x] Login with demo accounts (`dr.verma@sagarphc.in`, `dr.patel@jabalpurmc.in`, `admin@carelink.in`).
- [x] Dashboard loads 4 StatCards, Active Care Gap banners, and Referral table.
- [x] RiskScore gauge renders smoothly with animated SVG stroke.
- [x] Referral detail allows one-click stage progression and updates timeline.
- [x] Diagnostics tracker filters by urgency and records review status.
- [x] Medication reconciliation surfaces Aspirin + Warfarin conflict.
- [x] CareBot AI responds to queries and respects clinical boundaries.
