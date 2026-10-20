# ENVIRONMENT_CONFIGURATION.md — Environment Variables Specification

This document details all environment variables across backend and frontend configurations.

---

## 1. Backend (`carelink-backend/.env`)

| Variable | Required | Default / Recommended | Purpose |
|---|---|---|---|
| `PORT` | Yes | `5000` | Port for Express HTTP server |
| `HOST` | Yes | `127.0.0.1` | Must be `127.0.0.1` on macOS to bypass AirPlay port 5000 wildcard conflicts |
| `MONGODB_URI` | Yes | `mongodb://localhost:27017/carelink` | MongoDB connection URI. Can be MongoDB Atlas URI. |
| `JWT_SECRET` | Yes | `carelink_secret_key_2026` | Secret key used to sign and verify JWT authentication tokens |
| `JWT_EXPIRES_IN`| Yes | `7d` | Token validity period before re-login is required |
| `FRONTEND_URL` | Yes | `http://localhost:5173` | Allowed CORS origin for browser requests |
| `OPENAI_API_KEY`| Optional| `""` | Key for OpenAI GPT-4o-mini clinical extraction engine |
| `GEMINI_API_KEY`| Optional| `""` | Key for Google Gemini 3.5 Flash-Lite CareBot integration |
| `GEMINI_MODEL` | Optional| `gemini-3.5-flash-lite` | Target Gemini model identifier |
| `TWILIO_ACCOUNT_SID` | Optional | `""` | Twilio Account SID for SMS emergency alerts |
| `TWILIO_AUTH_TOKEN`  | Optional | `""` | Twilio Auth Token |
| `TWILIO_PHONE_NUMBER`| Optional | `""` | Twilio dispatch phone number |

---

## 2. Frontend (`carelink-frontend/.env`)

| Variable | Required | Default / Recommended | Purpose |
|---|---|---|---|
| `VITE_API_BASE_URL` | Yes | `http://127.0.0.1:5000` | Base URL for REST API. Normalizer in `api.js` ensures `/api` is prefixed. |

> **Security Note:** Never commit actual API keys or secrets to Git. Always use `.env.example` templates for repository commits.
