/**
 * CareLink Deterministic Referral Risk Scoring Engine
 * Rule-based, explainable scoring algorithm evaluating dropout risk
 */

function calculateRiskScore(referralData = {}, patientHistory = {}, targetHospital = {}) {
  const riskFactors = [];
  let score = 0;

  // 1. Distance factor (> 50 km)
  const distanceKm = referralData.distanceKm !== undefined
    ? Number(referralData.distanceKm)
    : (patientHistory.distanceKm !== undefined ? Number(patientHistory.distanceKm) : 0);

  if (distanceKm > 50) {
    const points = 20;
    score += points;
    riskFactors.push({
      factor: `Long travel distance (${Math.round(distanceKm)} km > 50 km)`,
      points
    });
  }

  // 2. Patient previous missed appointments (+20 pts each, capped at 40)
  const missedCount = Number(patientHistory.missedAppointmentsCount || 0);
  if (missedCount > 0) {
    const points = Math.min(missedCount * 20, 40);
    score += points;
    riskFactors.push({
      factor: `History of missed appointments (${missedCount} recorded)`,
      points
    });
  }

  // 3. No confirmed appointment yet
  const isPendingBooking = (referralData.status === 'created' || referralData.currentStage === 0);
  if (isPendingBooking) {
    const points = 15;
    score += points;
    riskFactors.push({
      factor: 'No confirmed appointment booked',
      points
    });
  }

  // 4. Target hospital congestion (> 80% current load)
  const hospitalLoad = Number(targetHospital.currentLoad || 0);
  if (hospitalLoad > 80) {
    const points = 15;
    score += points;
    riskFactors.push({
      factor: `High target facility congestion (${hospitalLoad}% capacity)`,
      points
    });
  }

  // 5. Clinical urgency level
  const urgency = (referralData.urgency || 'medium').toLowerCase();
  if (urgency === 'critical') {
    const points = 20;
    score += points;
    riskFactors.push({
      factor: 'Critical clinical urgency tier',
      points
    });
  } else if (urgency === 'high') {
    const points = 10;
    score += points;
    riskFactors.push({
      factor: 'High clinical urgency tier',
      points
    });
  }

  // 6. Transport availability
  const hasTransport = referralData.hasPrivateTransport !== undefined
    ? Boolean(referralData.hasPrivateTransport)
    : (patientHistory.hasPrivateTransport !== undefined ? Boolean(patientHistory.hasPrivateTransport) : false);

  if (!hasTransport) {
    const points = 10;
    score += points;
    riskFactors.push({
      factor: 'No private transport recorded',
      points
    });
  }

  // Clamp final score 0 to 100
  const riskScore = Math.min(100, Math.max(0, score));

  // Determine risk level & actionable recommendation
  let riskLevel = 'low';
  let recommendedAction = 'Standard monitoring of referral progress.';

  if (riskScore >= 71) {
    riskLevel = 'high';
    recommendedAction = 'Assign ASHA/Community health worker immediately; coordinate transport assistance and dispatch SMS reminder 24h prior.';
  } else if (riskScore >= 41) {
    riskLevel = 'medium';
    recommendedAction = 'Schedule automated follow-up verification call within 48 hours.';
  }

  return {
    riskScore,
    riskLevel,
    riskFactors,
    recommendedAction
  };
}

module.exports = {
  calculateRiskScore
};
