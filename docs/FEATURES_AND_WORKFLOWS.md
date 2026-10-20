# FEATURES_AND_WORKFLOWS.md — Feature Inventory & Detailed User Journeys

## 1. Feature Inventory

1. **Autonomous Care Gap Detection**: Background cron monitors referral deadlines, unreviewed critical diagnostic results, and uncoordinated discharges.
2. **Interactive 6-Stage Stepper**: Visual tracking of referral states with timestamped audit logs.
3. **Animated Dropout Risk Dial**: Real-time evaluation of patient default vulnerability.
4. **ABDM ABHA Patient Lookup**: Unified health account integration.
5. **Cross-Facility Prescription Safety**: Automated drug-drug interaction warning system.
6. **Live Hospital Capability Directory**: Bed census, ICU availability, and diagnostic equipment matrix.
7. **CareBot AI Coordinator**: Generative clinical summarization without hallucinated diagnostic claims.
8. **Executive Analytics Dashboard**: Longitudinal trend analytics for district health officers.

---

## 2. End-to-End User Journeys

### Journey 1: Initiating an Urgent Cardiac Referral
1. Primary Doctor logs in as `dr.verma@sagarphc.in`.
2. Navigates to `/referrals/new`.
3. Selects patient **Suresh Kumar** (ABHA-4910-8291-3001).
4. System automatically surfaces recent Troponin-T test result (0.14 ng/mL - Critical).
5. Doctor selects specialty: `Cardiology`, urgency: `critical`.
6. Matching engine highlights **NSCB Medical College, Jabalpur** (30 ICU beds, 24/7 cath lab).
7. Risk score computed as `85/100` (High Risk) due to 58km distance and delayed transit.
8. Referral dispatched; Twilio SMS queued to receiving cardiology unit.

### Journey 2: Receiving Hospital Triage & Admission
1. Cardiologist `dr.patel@jabalpurmc.in` logs in at receiving facility.
2. Sees high-priority incoming referral on `/dashboard`.
3. Clicks referral to open `/referrals/:id`.
4. Reviews attached ECG and Troponin results.
5. Advances stage: `referred` -> `accepted`.
6. When ambulance arrives, updates stage to `arrived`.
7. Patient triaged into cath lab; updates stage to `admitted`. Active care gap alert auto-resolves.

### Journey 3: Pharmacist Resolves Drug Interaction
1. Hospital Pharmacist accesses `/medications`.
2. Inspects active orders for Suresh Kumar.
3. System flags high-severity interaction: **Aspirin 75mg** (prescribed at Sagar DH) and **Warfarin 5mg** (prescribed at Jabalpur MC).
4. Pharmacist clicks **Resolve Conflict**, documents physician consultation notes, and updates Warfarin dosage.
