# DECISIONS_AND_RATIONALE.md — Architectural Decision Records (ADRs)

## ADR-001: Explicit IPv4 Loopback Binding over Wildcard
- **Context**: macOS AirPlay uses port 5000 on IPv6 loopback (`::1:5000`), blocking Express when bound to `0.0.0.0` or accessed via `localhost`.
- **Decision**: Configure `HOST=127.0.0.1` and bind Express directly to IPv4 loopback.
- **Consequence**: Full cross-platform compatibility without requiring users to disable native macOS features.

---

## ADR-002: Vite Proxy for API Calls in Development
- **Context**: Browsers make cross-origin requests when frontend runs on `5173` and backend on `5000`, causing CORS preflight checks and port routing problems.
- **Decision**: Configure Vite's built-in dev proxy to route `/api/*` requests directly to `http://127.0.0.1:5000`.
- **Consequence**: Eliminates CORS friction in dev mode and matches production reverse proxy architectures (e.g. Nginx).

---

## ADR-003: Skill Setu / Kawach Dark Design System
- **Context**: Clinical software often suffers from bright, unstyled interfaces that cause eye fatigue during extended clinical monitoring.
- **Decision**: Adopt a standardized dark navy (`#0D1B2A`), high-contrast off-white (`#F0F4F8`), and vibrant actionable teal (`#00BFA6`) design system.
- **Consequence**: Professional, accessible, and high-contrast UI suitable for both hospital triage desks and emergency ambulances.

---

## ADR-004: Multi-Model AI Strategy with Safe Fallback
- **Context**: AI models in healthcare must provide helpful coordination assistance without attempting unauthorized diagnosis.
- **Decision**: Architect CareBot service to support Gemini 3.5 Flash-Lite as primary and OpenAI as fallback, with explicit prompt guardrails instructing the model to synthesize logistics and patient history without diagnosing.
- **Consequence**: High-speed, low-latency, cost-effective inference with strong safety boundaries.
