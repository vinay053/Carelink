# BUSINESS_LOGIC.md — Clinical Rules, Algorithms & Workflows

## 1. Referral Dropout Risk Calculation Algorithm

Implemented in `carelink-backend/src/services/riskScore.service.js`.

The risk score $R \in [0, 100]$ predicts the probability that a patient will fail to complete their referral journey:

$$R = \min(100, W_{dist} + W_{trans} + W_{age} + W_{delay} + W_{urgency})$$

Where weights are derived from empirical public health studies in rural districts:
1. **Distance Weight ($W_{dist}$)**:
   - $< 15$ km: $+0$ points
   - $15 - 50$ km: $+15$ points
   - $> 50$ km: $+30$ points
2. **Transport Access ($W_{trans}$)**:
   - Ambulance provided: $+0$ points
   - Private vehicle: $+5$ points
   - Public bus/transit: $+25$ points
3. **Patient Age ($W_{age}$)**:
   - Age $> 65$ or $< 5$: $+15$ points
   - Age $5 - 65$: $+0$ points
4. **Time to Appointment ($W_{delay}$)**:
   - Same-day / next-day: $+0$ points
   - $2 - 5$ days: $+10$ points
   - $> 5$ days: $+25$ points
5. **Urgency Mismatch ($W_{urgency}$)**:
   - High clinical urgency coupled with delayed transit adds $+15$ points.

---

## 2. SLA Escalation & Care Gap Detection

The background auditor service (`careGap.service.js`) executes on a cron schedule:
- **Critical Referrals**: SLA window is **12 hours**. If stage has not progressed from `referred` or `accepted` within 12 hours, an automated `Alert` document is inserted and SMS notifications are triggered.
- **High Urgency**: SLA window is **24 hours**.
- **Moderate Urgency**: SLA window is **48 hours**.
- **Low Urgency**: SLA window is **72 hours**.

When a referral's stage advances, active SLA breach alerts associated with that referral are automatically marked `resolved`.

---

## 3. Hospital Referral Matching Engine

Implemented in `carelink-backend/src/services/hospital.service.js`:
Given a referral requirement:
1. Filters hospitals possessing the `requiredSpecialty`.
2. Validates capacity: `availableICUBeds > 0` (if urgency is `critical` or `high`).
3. Checks diagnostic equipment (e.g. requires `hasCT: true` if neuro/trauma case).
4. Computes composite matching score based on distance, bed availability ratio, and current facility load.
