# SETUP_AND_INSTALLATION.md — Setup & Installation Guide

This guide describes how to set up the CareLink development environment on a clean machine.

---

## 1. Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended).
- **npm**: v9.0.0 or higher.
- **MongoDB**: Local MongoDB instance (or Docker running `mongo:7.0`).
- **Git**: Configured with user credentials.

---

## 2. Step-by-Step Installation

### Step 1: Clone Repository
```bash
git clone https://github.com/vinay053/Carelink.git
cd Carelink
```

### Step 2: Database Initialization (Docker Option)
If Docker is installed:
```bash
docker compose up -d
```
*Note: If Docker is unavailable, ensure local MongoDB service is running on default port `27017` (`brew services start mongodb/brew/mongodb-community`).*

### Step 3: Backend Setup
```bash
cd carelink-backend
cp .env.example .env
```
Ensure `.env` contains:
```env
PORT=5000
HOST=127.0.0.1
MONGODB_URI=mongodb://localhost:27017/carelink
JWT_SECRET=carelink_secret_key_2026
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```
Install dependencies and seed clinical data:
```bash
npm install
npm run seed
```

### Step 4: Frontend Setup
```bash
cd ../carelink-frontend
cp .env.example .env
```
Ensure `.env` contains:
```env
VITE_API_BASE_URL=http://127.0.0.1:5000
```
Install dependencies:
```bash
npm install
```

---

## 3. Verifying Installation

1. Verify backend health endpoint:
   ```bash
   curl http://127.0.0.1:5000/health
   # Expected response: {"status":"healthy","service":"carelink-backend",...}
   ```
2. Verify frontend compilation:
   ```bash
   npm run build
   # Expected output: built in ~7s with 0 errors
   ```
