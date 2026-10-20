# PROJECT_OVERVIEW.md — CareLink Executive Overview & Problem Context

## 1. Executive Summary
**CareLink** is an intelligent healthcare referral coordination and continuity platform designed to prevent patients from falling through the cracks during clinical handoffs. 

In emerging and public health ecosystems like India's ABDM (Ayushman Bharat Digital Mission), care delivery is split between Primary Health Centres (PHCs), Community Health Centres (CHCs), Sub-District Hospitals, and apex Tertiary Medical Colleges. While electronic health records (EHRs) capture isolated point-in-time transactions, no orchestrating intelligence tracks whether a referred patient actually arrives, whether critical diagnostic results are reviewed by the receiving clinician, or whether conflicting prescriptions are reconciled between facilities.

CareLink bridges this gap through continuous lifecycle tracking, automated care-gap alerting, and dropout risk prediction.

---

## 2. Core Pillars of the Platform

### Pillar 1: 6-Stage Referral Lifecycle Engine
Every patient referral transitions through a strict state machine:
- **Referred**: Referral initialized by the primary doctor.
- **Accepted**: Receiving hospital specialist confirms capacity and triages the case.
- **Transport**: In-transit status (ambulance assigned or patient self-transit).
- **Arrived**: Receiving facility triage check-in.
- **Admitted**: Inpatient or emergency admission confirmed.
- **Discharged**: Counter-referral summary dispatched back to the originating PHC.

### Pillar 2: Predictive Dropout Risk Scoring (0–100)
CareLink calculates an objective risk score for every referral using clinical and socioeconomic indicators:
- Travel distance to destination facility (km).
- Patient transport accessibility (private vs. public transport vs. ambulance).
- Age and clinical acuity score.
- Time delay between referral initiation and appointment scheduling.

### Pillar 3: Cross-Facility Medication Reconciliation & Drug Safety
Patients referred between doctors often receive overlapping or interacting medications. CareLink cross-references active prescriptions across institutions to flag:
- Duplicate therapy (e.g., dual ACE inhibitors).
- High-risk drug-drug interactions (e.g., Aspirin + Warfarin bleeding risk).

### Pillar 4: Diagnostic Follow-up Continuity
Ensures that critical lab or imaging results (e.g., elevated cardiac Troponin-T, malignant biopsy) are flagged and reviewed, preventing unaddressed critical findings.

### Pillar 5: CareBot Clinical AI Assistant
An AI coordinator trained with clinical guardrails to help doctors quickly draft referrals, synthesize cross-facility timelines, and identify open gaps.

---

## 3. Target User Personas & Clinical Roles

| Persona | Primary Needs & Actions |
|---|---|
| **Referring Doctor (PHC / CHC)** | Needs fast referral creation, real-time bed & specialist matching, tracking of dispatched patients. |
| **Receiving Specialist (District / Tertiary Hospital)** | Needs clinical summary handoffs, diagnostic attachments, pre-arrival heads-up for critical admissions. |
| **State / District Health Coordinator (Admin)** | Needs bird's-eye metrics, district-wide referral completion rates, average transfer latencies, SLA breaches. |
| **Clinical Pharmacist** | Needs cross-facility drug interaction checks and one-click reconciliation approval. |
