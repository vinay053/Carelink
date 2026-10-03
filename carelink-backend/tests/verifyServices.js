const assert = require('assert');
const { calculateRiskScore } = require('../src/services/riskScore.service');
const { getStageSlaHours } = require('../src/services/careGap.service');
const { rankHospitals } = require('../src/services/hospital.service');

function runServicesVerification() {
  console.log('--- [CareLink] Verifying Core Algorithmic Services ---');

  // 1. Test Risk Scoring
  console.log('Testing calculateRiskScore...');
  const highRiskResult = calculateRiskScore(
    { distanceKm: 58, urgency: 'high', status: 'created', currentStage: 0, hasPrivateTransport: false },
    { missedAppointmentsCount: 2 },
    { currentLoad: 85 }
  );

  console.log(`✓ High risk calculation: Score = ${highRiskResult.riskScore}, Level = ${highRiskResult.riskLevel}`);
  assert(highRiskResult.riskScore >= 71, 'High risk score should be >= 71');
  assert.strictEqual(highRiskResult.riskLevel, 'high');
  assert(highRiskResult.riskFactors.length >= 4, 'Should identify multiple risk factors');
  assert(highRiskResult.recommendedAction.includes('ASHA'), 'Should recommend ASHA worker intervention');

  const lowRiskResult = calculateRiskScore(
    { distanceKm: 12, urgency: 'low', status: 'appointment_booked', currentStage: 2, hasPrivateTransport: true },
    { missedAppointmentsCount: 0 },
    { currentLoad: 40 }
  );
  console.log(`✓ Low risk calculation: Score = ${lowRiskResult.riskScore}, Level = ${lowRiskResult.riskLevel}`);
  assert(lowRiskResult.riskScore <= 40, 'Low risk score should be <= 40');
  assert.strictEqual(lowRiskResult.riskLevel, 'low');

  // 2. Test CareGap SLAs
  console.log('Testing getStageSlaHours...');
  assert.strictEqual(getStageSlaHours('critical'), 12);
  assert.strictEqual(getStageSlaHours('high'), 24);
  assert.strictEqual(getStageSlaHours('medium'), 48);
  assert.strictEqual(getStageSlaHours('low'), 72);
  console.log('✓ Stage SLA lookups verified');

  // 3. Test Hospital Recommendation Ranking
  console.log('Testing rankHospitals...');
  const mockHospitals = [
    {
      _id: 'hosp_1',
      name: 'District Hospital Sagar',
      district: 'Sagar',
      coordinates: { lat: 23.8388, lng: 78.7378 },
      specialists: [{ name: 'Dr. Sharma', specialty: 'Cardiology', availableToday: false, nextAvailable: 'Tomorrow' }],
      totalICUBeds: 10,
      availableICUBeds: 2,
      currentLoad: 85,
      hasCT: true,
      hasMRI: false,
      hasBloodBank: true
    },
    {
      _id: 'hosp_2',
      name: 'Netaji Subhash Chandra Bose Medical College, Jabalpur',
      district: 'Jabalpur',
      coordinates: { lat: 23.1815, lng: 79.9864 },
      specialists: [{ name: 'Dr. Patel', specialty: 'Cardiology', availableToday: true, nextAvailable: 'Today' }],
      totalICUBeds: 30,
      availableICUBeds: 12,
      currentLoad: 65,
      hasCT: true,
      hasMRI: true,
      hasBloodBank: true
    }
  ];

  const ranked = rankHospitals({
    requiredSpecialty: 'Cardiology',
    patientLocation: { lat: 23.8388, lng: 78.7378 },
    urgency: 'high',
    hospitals: mockHospitals
  });

  console.log(`✓ Top ranked hospital: ${ranked[0].name} (Score: ${ranked[0].totalScore}/100)`);
  assert(ranked.length > 0, 'Should return ranked hospitals list');
  assert(ranked[0].totalScore > 0, 'Hospital should have non-zero score');

  console.log('\n>>> ALL CORE SERVICES VERIFIED SUCCESSFULLY <<<');
  process.exit(0);
}

runServicesVerification();
