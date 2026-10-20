# RUN_AND_BUILD.md — Execution, Dev Servers, & Production Build Guide

## 1. Running in Development Mode

CareLink runs as two synchronized services: the Express backend and the Vite frontend.

### Terminal 1: Backend Server
```bash
cd carelink-backend
npm run dev
```
- Starts `nodemon src/server.js`.
- Binds to `http://127.0.0.1:5000`.
- Health check: `http://127.0.0.1:5000/health`.
- Starts the background care-gap auditor cron.

### Terminal 2: Frontend Web Application
```bash
cd carelink-frontend
npm run dev
```
- Starts Vite development server at `http://localhost:5173`.
- Hot Module Replacement (HMR) enabled.
- Proxies `/api` requests to backend at `http://127.0.0.1:5000`.

---

## 2. Production Build & Deployment

### Building the Frontend
```bash
cd carelink-frontend
npm run build
```
- Compiles React JSX and Tailwind CSS into optimized static assets in `carelink-frontend/dist/`.
- Bundled assets:
  - `dist/index.html` (~1.1 kB)
  - `dist/assets/index-[hash].css` (~34 kB / gzip 6.7 kB)
  - `dist/assets/index-[hash].js` (~858 kB / gzip 238 kB)

### Serving the Production Frontend
To preview the production bundle locally:
```bash
npm run preview
```

### Running Backend in Production Mode
```bash
cd carelink-backend
npm start
```
Starts server with `NODE_ENV=production`.
