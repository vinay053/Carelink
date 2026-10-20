# RECOVERY_GUIDE.md — Complete Machine Restoration & Zero-Context Recovery

> **Audience:** Developers or AI Agents starting with a freshly imaged machine and zero local state.

---

## 1. Context & Purpose
This guide is designed to restore full operational understanding and local execution of CareLink from nothing other than the GitHub repository `https://github.com/vinay053/Carelink.git`.

---

## 2. Zero-Context Recovery Protocol

### Phase 1: Machine Setup
Ensure the following tools are installed:
- Node.js 18+ (`node -v`)
- npm 9+ (`npm -v`)
- Git (`git --version`)
- MongoDB or Docker

### Phase 2: Repository Clone & Workspace Configuration
```bash
git clone https://github.com/vinay053/Carelink.git
cd Carelink
```

### Phase 3: Backend Configuration
```bash
cd carelink-backend
cp .env.example .env
npm install
npm run seed
npm run dev
```
*Expected log output:*
```
[CareLink DB] MongoDB Connected: localhost
[CareLink Backend] Server listening on http://127.0.0.1:5000
[CareLink Backend] Health check available at http://127.0.0.1:5000/health
```

### Phase 4: Frontend Configuration
```bash
cd ../carelink-frontend
cp .env.example .env
npm install
npm run dev
```
*Expected log output:*
```
VITE v6.x.x ready in ~300 ms
➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Phase 5: Verification Checklist
1. Open `http://localhost:5173` in Chrome/Edge/Firefox.
2. Click **Demo Accounts** -> Select **Doctor (Referring PHC)**.
3. Observe successful authentication and redirection to `/dashboard`.
4. Inspect Dashboard: 4 StatCards, active care gap alert banner for Suresh Kumar, and recent referrals table.
5. Success! The system is fully operational.
