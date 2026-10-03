const mongoose = require('mongoose');
const assert = require('assert');
const {
  User,
  Patient,
  Referral,
  DiagnosticResult,
  Medication,
  Hospital,
  Alert
} = require('../src/models');
const { createReferral, advanceReferralStage } = require('../src/controllers/referral.controller');
const { reconcileMedications } = require('../src/controllers/medication.controller');
const { getPatientTimeline } = require('../src/controllers/patient.controller');
require('dotenv').config();

async function runApiVerification() {
  console.log('--- [CareLink] Verifying Core Workflow REST API Logic ---');
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/carelink');

    // 1. Setup base records
    const doctor = await User.create({
      name: 'Dr. Workflow Tester',
      email: `workflow_doc_${Date.now()}@carelink.in`,
      password: 'password123',
      role: 'doctor'
    });

    const hospital = await Hospital.create({
      name: 'Workflow General Hospital',
      district: 'Jabalpur',
      state: 'Madhya Pradesh',
      specialties: ['Cardiology', 'General Medicine'],
      currentLoad: 60
    });

    const patient = await Patient.create({
      abhaId: `ABHA-WF-${Date.now()}`,
      name: 'Kailash Chand',
      gender: 'male',
      phone: '9822334455',
      address: { district: 'Jabalpur', state: 'Madhya Pradesh' },
      assignedDoctorId: doctor._id,
      hospitalId: hospital._id
    });
    console.log('✓ Base records (User, Hospital, Patient) seeded');

    // 2. Test Referral Creation with automatic risk scoring
    const mockRefReq = {
      user: doctor,
      body: {
        patientId: patient._id,
        referringDoctorId: doctor._id,
        referringHospitalId: hospital._id,
        targetHospitalId: hospital._id,
        targetSpecialty: 'Cardiology',
        urgency: 'high',
        distanceKm: 65,
        hasPrivateTransport: false,
        notes: 'Suspected unstable angina'
      }
    };

    let refResponseData = null;
    const mockRefRes = {
      status: (code) => ({
        json: (payload) => {
          assert.strictEqual(code, 201, 'Referral creation must return 201');
          refResponseData = payload.data;
        }
      })
    };

    await createReferral(mockRefReq, mockRefRes);
    assert(refResponseData, 'Referral data must be returned');
    assert.strictEqual(refResponseData.currentStage, 0);
    assert(refResponseData.riskScore > 0, 'Risk score must be computed automatically');
    console.log(`✓ Referral created with risk score ${refResponseData.riskScore} (${refResponseData.riskLevel})`);

    // 3. Simulate Care Gap Alert creation for this referral
    const gapAlert = await Alert.create({
      type: 'referral_gap',
      severity: 'high',
      patientId: patient._id,
      referralId: refResponseData._id,
      message: 'Referral Stage 0 has exceeded SLA window by 30 hours'
    });
    console.log('✓ Simulated active care gap alert created');

    // 4. Test Stage Advancement & Auto-Resolution of Care Gap Alert
    const mockStageReq = {
      user: doctor,
      params: { id: refResponseData._id.toString() },
      body: { stageIndex: 1, notes: 'Referral accepted by cardiology department' }
    };

    let stageResData = null;
    const mockStageRes = {
      status: (code) => ({
        json: (payload) => {
          assert.strictEqual(code, 200, 'Stage advance must return 200');
          stageResData = payload;
        }
      })
    };

    await advanceReferralStage(mockStageReq, mockStageRes);
    assert.strictEqual(stageResData.data.currentStage, 1);
    assert.strictEqual(stageResData.data.status, 'accepted');
    console.log('✓ Referral stage advanced to 1 (accepted)');

    // Verify alert is auto-resolved
    const checkedAlert = await Alert.findById(gapAlert._id);
    assert.strictEqual(checkedAlert.status, 'resolved', 'Referral gap alert must be marked resolved upon stage progress');
    console.log('✓ Stalled care gap alert verified AUTO-RESOLVED');

    // 5. Test Medication Reconciliation Logic
    const mockMedReq = {
      body: {
        prescriptions: [
          { drugs: [{ drugName: 'Aspirin 75mg' }] },
          { drugs: [{ drugName: 'Warfarin 5mg' }] }
        ]
      }
    };
    let medConflictData = null;
    const mockMedRes = {
      status: (code) => ({
        json: (payload) => {
          medConflictData = payload;
        }
      })
    };
    await reconcileMedications(mockMedReq, mockMedRes);
    assert(medConflictData.conflicts.length > 0, 'Should detect Aspirin + Warfarin conflict');
    assert.strictEqual(medConflictData.conflicts[0].severity, 'high');
    console.log('✓ Medication reconciliation flagged Aspirin + Warfarin bleeding risk');

    // 6. Test Patient Timeline Aggregation
    const mockTlReq = { params: { id: patient._id.toString() } };
    let tlData = null;
    const mockTlRes = {
      status: (code) => ({
        json: (payload) => {
          tlData = payload.data;
        }
      })
    };
    await getPatientTimeline(mockTlReq, mockTlRes);
    assert(tlData.timeline.length >= 2, 'Timeline must aggregate registration and referral events');
    console.log(`✓ Patient timeline aggregated ${tlData.timeline.length} sequential chronological events`);

    // Cleanup
    await User.findByIdAndDelete(doctor._id);
    await Hospital.findByIdAndDelete(hospital._id);
    await Patient.findByIdAndDelete(patient._id);
    await Referral.findByIdAndDelete(refResponseData._id);
    await Alert.findByIdAndDelete(gapAlert._id);
    console.log('✓ Cleanup complete');

    console.log('\n>>> CORE WORKFLOW REST APIS VERIFIED SUCCESSFULLY <<<');
    process.exit(0);
  } catch (error) {
    console.error('Error during API verification:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

runApiVerification();
