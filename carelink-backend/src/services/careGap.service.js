const cron = require('node-cron');
const { Referral, Alert, Patient, User } = require('../models');

// Configurable stage SLA durations in hours based on referral urgency
const STAGE_SLA_HOURS = {
  critical: 12,
  high: 24,
  medium: 48,
  low: 72
};

function getStageSlaHours(urgency = 'medium') {
  return STAGE_SLA_HOURS[urgency.toLowerCase()] || 48;
}

/**
 * Scan all active referrals and identify stalled transitions
 */
async function checkReferralGaps() {
  const timestamp = new Date();
  console.log(`[CareGap Engine] Starting referral gap audit at ${timestamp.toISOString()}`);

  try {
    const activeReferrals = await Referral.find({
      status: { $nin: ['closed', 'follow_up_done'] }
    }).populate('patientId referringDoctorId');

    const createdAlerts = [];

    for (const referral of activeReferrals) {
      const urgency = referral.urgency || 'medium';
      const allowedHours = getStageSlaHours(urgency);
      const allowedMs = allowedHours * 60 * 60 * 1000;

      // Determine when the current stage began
      let stageStartTime = referral.createdAt;
      if (referral.stageTimestamps && referral.stageTimestamps.length > 0) {
        const lastStage = referral.stageTimestamps[referral.stageTimestamps.length - 1];
        if (lastStage && lastStage.completedAt) {
          stageStartTime = lastStage.completedAt;
        }
      }

      const elapsedMs = timestamp.getTime() - new Date(stageStartTime).getTime();
      const elapsedHours = elapsedMs / (60 * 60 * 1000);

      // Overdue gap detected
      if (elapsedMs > allowedMs) {
        const isSeverelyOverdue = elapsedMs > (allowedMs * 2);
        const severity = isSeverelyOverdue ? 'critical' : (urgency === 'critical' || urgency === 'high' ? 'high' : 'medium');
        const patientName = referral.patientId?.name || 'Patient';

        const alertMessage = `Referral stage ${referral.currentStage} for ${patientName} is overdue by ${Math.round(elapsedHours - allowedHours)} hours (SLA: ${allowedHours}h, Elapsed: ${Math.round(elapsedHours)}h).`;

        // Check if an active gap alert already exists for this referral
        const existingAlert = await Alert.findOne({
          referralId: referral._id,
          type: 'referral_gap',
          status: 'active'
        });

        if (!existingAlert) {
          const newAlert = await Alert.create({
            type: 'referral_gap',
            severity,
            patientId: referral.patientId?._id || referral.patientId,
            referralId: referral._id,
            message: alertMessage,
            status: 'active',
            assignedTo: referral.referringDoctorId?._id || referral.referringDoctorId
          });
          createdAlerts.push(newAlert);
          console.log(`[CareGap Engine] 🔴 Created new gap alert: ${newAlert._id} (severity: ${severity})`);
        } else if (isSeverelyOverdue && existingAlert.severity !== 'critical') {
          // Escalate existing alert to critical
          existingAlert.severity = 'critical';
          existingAlert.message = `[CRITICAL ESCALATION] ${alertMessage}`;
          await existingAlert.save();
          console.log(`[CareGap Engine] ⚠️ Escalated gap alert to CRITICAL: ${existingAlert._id}`);
        }
      }
    }

    console.log(`[CareGap Engine] Audit complete. ${createdAlerts.length} new care gaps flagged.`);
    return createdAlerts;
  } catch (error) {
    console.error(`[CareGap Engine] Error executing care gap check:`, error);
    throw error;
  }
}

/**
 * Initialize cron worker running every 4 hours
 */
function initCareGapCron() {
  console.log('[CareGap Engine] Initializing automated Care Gap cron schedule (every 4 hours: 0 */4 * * *)');
  cron.schedule('0 */4 * * *', async () => {
    try {
      await checkReferralGaps();
    } catch (err) {
      console.error('[CareGap Cron] Error during scheduled gap audit:', err);
    }
  });
}

module.exports = {
  STAGE_SLA_HOURS,
  getStageSlaHours,
  checkReferralGaps,
  initCareGapCron
};
