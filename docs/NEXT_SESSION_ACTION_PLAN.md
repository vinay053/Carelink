# NEXT_SESSION_ACTION_PLAN.md — Action Plan for the Next Engineering Session

When beginning a new session or resuming after a machine restoration, follow this precise action plan:

---

## Step 1: Clone & Environment Verification
1. Clone the repository:
   ```bash
   git clone https://github.com/vinay053/Carelink.git
   cd Carelink
   ```
2. Verify branch:
   ```bash
   git checkout main
   git pull origin main
   ```
3. Set up environment files:
   - In `carelink-backend`: Copy `.env.example` to `.env` and verify `HOST=127.0.0.1`, `PORT=5000`.
   - In `carelink-frontend`: Copy `.env.example` to `.env` and verify `VITE_API_BASE_URL=http://127.0.0.1:5000`.

---

## Step 2: Service Launch & Smoke Test
1. Start MongoDB:
   ```bash
   docker compose up -d || brew services start mongodb/brew/mongodb-community
   ```
2. Launch Backend:
   ```bash
   cd carelink-backend
   npm install
   npm run seed
   npm run dev
   ```
3. Launch Frontend:
   ```bash
   cd ../carelink-frontend
   npm install
   npm run dev
   ```
4. Verify by opening `http://localhost:5173` and logging in as `dr.verma@sagarphc.in` / `password123`.

---

## Step 3: Immediate Engineering Tasks to Pick Up
1. Implement Socket.IO real-time event broadcasting between backend and frontend for referral stage changes.
2. Add dynamic code splitting (`React.lazy()`) in `AppRoutes.jsx` to optimize bundle size for `Analytics.jsx` and `HospitalMap.jsx`.
3. Add end-to-end Cypress or Playwright automated browser test suite for the 6-stage referral progression.
