# CHANGELOG.md — CareLink Platform Version History

All notable changes to this project are documented in this file.

---

## [1.2.0] - October 2026

### Added
- **Production UI/UX Redesign**: Fully implemented the Skill Setu / Kawach executive healthcare design theme.
- **Custom UI Components**: Built `RiskScore` animated gauge, `StatCard`, `Badge`, `Modal`, `EmptyState`, `Skeleton`, and `Spinner`.
- **Route Protections**: Added robust `ProtectedRoute` and `PublicRoute` wrappers ensuring secure navigation.
- **Automated Proxy**: Added Vite proxy configuration routing `/api` requests to `127.0.0.1:5000` to prevent macOS AirPlay port 5000 conflicts.
- **Comprehensive Documentation Suite**: Added `AGENTS.md`, `PROJECT_STATUS.md`, `DEVELOPMENT_LOG.md`, and 17 dedicated guides in `/docs/`.

### Changed
- **Network Binding**: Express backend explicitly binds to `127.0.0.1` rather than wildcard `0.0.0.0`.
- **Database Fallback**: MongoDB connection utility now automatically catches placeholder connection strings and routes to local instances.
- **API URL Normalization**: Axios interceptor automatically guarantees `/api` route prefixing and removes duplicate slashes.

### Fixed
- **HTTP 403 Forbidden on macOS**: Resolved AirPlay receiver intercepting requests directed at `localhost:5000`.
- **Referral Directory & Settings Redesign**: Fixed styling and responsiveness across table views, filter bars, and configuration inputs.

---

## [1.1.0] - September 2026

### Added
- Integrated CareBot AI multi-model reasoning for clinical summaries and conversational triage.
- Added 6-stage clinical referral handoff workflow (`referred` -> `accepted` -> `transport` -> `arrived` -> `admitted` -> `discharged`).
- Integrated SMS dispatch hooks via Twilio for high-urgency referral alerts.

---

## [1.0.0] - Initial Release

- Initial MERN stack architecture for public health referral management.
- ABHA ID compliance and patient clinical record models.
- Diagnostic result tracking and medication reconciliation modules.
