# TODO.md — CareLink Development Backlog & Next Steps

This document tracks prioritized future improvements, architectural enhancements, and scheduled maintenance for the CareLink platform.

---

## 🎯 Immediate Priority (Next Session)
- [ ] **Docker Compose Orchestration**: Add full-stack `docker-compose.yml` pre-configuring MongoDB, backend, and frontend containers for one-command startup.
- [ ] **Real-Time WebSocket Integration**: Replace 30-second polling on the Dashboard with Socket.IO for instant referral status updates.
- [ ] **ABDM Sandbox Integration**: Wire patient lookup directly to the official National Health Authority (NHA) ABDM M1/M2/M3 sandbox APIs.

---

## 🚀 Feature Enhancements
- [ ] **HL7 FHIR Export**: Support exporting patient referral summaries into standard FHIR R4 JSON bundles.
- [ ] **Offline-First PWA Mode**: Enable service workers and IndexedDB storage so PHC doctors in low-connectivity rural areas can draft referrals offline.
- [ ] **Ambulance Live GPS Tracking**: Integrate Leaflet / Mapbox geolocation streams into the `/referrals/:id` transport stage view.
- [ ] **AI Counter-Referral Generator**: Automatically synthesize discharge summaries and follow-up checklists for referring PHC doctors when a patient is discharged.

---

## 🛡️ Security & Hardening
- [ ] **Role-Based Access Control (RBAC) Hardening**: Fine-tune field-level permissions between Primary Doctors, Receiving Specialists, and State Coordinators.
- [ ] **Audit Trail Storage**: Log immutable read/write audit events for ABHA record lookups to meet national health data privacy regulations.
- [ ] **Rate Limiting**: Add `express-rate-limit` middleware on `/api/auth/login` and `/api/carebot/chat`.
