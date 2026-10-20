# KNOWN_ISSUES.md — Known Quirks, Workarounds & Mitigations

This document lists environmental quirks, known edge cases, and implemented workarounds.

---

## 1. macOS AirPlay Port 5000 Conflict (`HTTP 403 Forbidden`)

- **Description**: On macOS Monterey, Ventura, and Sonoma, Apple's `ControlCenter` runs AirPlay Receiver on port 5000 (`*:5000`). Browsers connecting to `http://localhost:5000` resolve over IPv6 (`::1:5000`), resulting in AirPlay returning `HTTP 403 Forbidden` or `Direct IP access is not allowed`.
- **Mitigation Implemented**:
  1. Backend server binds strictly to `127.0.0.1:5000` (`HOST=127.0.0.1`).
  2. Frontend Vite config proxies `/api` requests to `http://127.0.0.1:5000`.
  3. `carelink-frontend/src/utils/api.js` automatically rewrites `localhost:5000` to `127.0.0.1:5000`.
- **System-level Alternative**: The user can disable AirPlay Receiver in `System Settings -> General -> AirDrop & AirPlay -> AirPlay Receiver (Toggle Off)`.

---

## 2. MongoDB DNS Resolution with Placeholder URIs

- **Description**: If `.env` contains `MONGODB_URI=mongodb+srv://your-connection-string`, Node.js attempts DNS SRV resolution for `your-connection-string`, throwing `querySrv ECONNREFUSED`.
- **Mitigation Implemented**: `carelink-backend/src/utils/database.js` inspects `process.env.MONGODB_URI`. If it contains `your-connection-string` or is empty, it automatically routes to local MongoDB at `mongodb://localhost:27017/carelink`.

---

## 3. Large Frontend Chunk Warning on Build

- **Description**: Vite build flags `index-[hash].js` as ~858 kB (>500 kB limit) due to the bundling of `lucide-react`, `recharts`, and `d3`.
- **Status**: Non-blocking warning. Build succeeds cleanly. Future optimization can introduce dynamic `import()` for the Analytics and HospitalMap routes.
