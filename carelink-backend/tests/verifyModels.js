const mongoose = require('mongoose');
const {
  User,
  Patient,
  Referral,
  DiagnosticResult,
  Medication,
  Hospital,
  ChatMessage,
  Alert
} = require('../src/models');
require('dotenv').config();

async function runModelVerification() {
  console.log('--- [CareLink] Verifying Mongoose Models ---');
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/carelink');
    console.log('✓ Successfully connected to MongoDB for test');

    // 1. User
    const testUser = new User({
      name: 'Dr. Test Verma',
      email: `test_${Date.now()}@carelink.in`,
      password: 'testPassword123',
      role: 'doctor',
      phone: '9876543210'
    });
    const savedUser = await testUser.save();
    console.log('✓ User model verified');

    // 2. Hospital
    const testHospital = new Hospital({
      name: 'Test Civil Hospital',
      district: 'Sagar',
      state: 'Madhya Pradesh',
      type: 'district',
      specialties: ['Cardiology', 'General Medicine'],
      totalICUBeds: 10,
      availableICUBeds: 4,
      hasCT: true,
      hasMRI: false,
      currentLoad: 60
    });
    const savedHospital = await testHospital.save();
    console.log('✓ Hospital model verified');

    // 3. Patient
    const testPatient = new Patient({
      abhaId: `ABHA-${Date.now()}`,
      name: 'Ramesh Patel',
      gender: 'male',
      dateOfBirth: new Date('1975-06-15'),
      phone: '9876500000',
      address: { district: 'Sagar', state: 'Madhya Pradesh', pincode: '470001' },
      bloodGroup: 'B+',
      conditions: ['Hypertension', 'Type 2 Diabetes'],
      assignedDoctorId: savedUser._id,
      hospitalId: savedHospital._id
    });
    const savedPatient = await testPatient.save();
    console.log('✓ Patient model verified');

    // 4. Referral
    const testReferral = new Referral({
      patientId: savedPatient._id,
      referringDoctorId: savedUser._id,
      referringHospitalId: savedHospital._id,
      targetHospitalId: savedHospital._id,
      targetSpecialty: 'Cardiology',
      urgency: 'high',
      status: 'created',
      currentStage: 0,
      riskScore: 65,
      riskLevel: 'medium',
      recommendedAction: 'Coordinate appointment within 48h'
    });
    const savedReferral = await testReferral.save();
    console.log('✓ Referral model verified');

    // 5. DiagnosticResult
    const testDiagnostic = new DiagnosticResult({
      patientId: savedPatient._id,
      testName: 'Troponin-T',
      resultValue: '0.08 ng/mL',
      normalRange: '< 0.01 ng/mL',
      unit: 'ng/mL',
      status: 'ordered',
      classification: 'urgent',
      keyFindings: ['Elevated cardiac biomarkers indicative of ischemia']
    });
    const savedDiagnostic = await testDiagnostic.save();
    console.log('✓ DiagnosticResult model verified');

    // 6. Medication
    const testMedication = new Medication({
      patientId: savedPatient._id,
      prescriptions: [{
        prescribedBy: 'Dr. Verma',
        hospitalName: 'Sagar Civil Hospital',
        drugs: [{
          drugName: 'Aspirin',
          genericName: 'Acetylsalicylic acid',
          dose: '75mg',
          frequency: 'Once daily',
          isActive: true
        }]
      }],
      conflicts: [{
        drug1: 'Aspirin',
        drug2: 'Warfarin',
        severity: 'high',
        explanation: 'Co-administration increases risk of major gastrointestinal hemorrhage.'
      }]
    });
    const savedMedication = await testMedication.save();
    console.log('✓ Medication model verified');

    // 7. ChatMessage
    const testChat = new ChatMessage({
      sessionId: `session_${Date.now()}`,
      userId: savedUser._id,
      role: 'user',
      content: 'Summarize Ramesh Patel referral risk',
      relatedPatientId: savedPatient._id
    });
    const savedChat = await testChat.save();
    console.log('✓ ChatMessage model verified');

    // 8. Alert
    const testAlert = new Alert({
      type: 'referral_gap',
      severity: 'high',
      patientId: savedPatient._id,
      referralId: savedReferral._id,
      message: 'Referral stage 0 overdue by 36 hours'
    });
    const savedAlert = await testAlert.save();
    console.log('✓ Alert model verified');

    // Cleanup test artifacts
    await User.findByIdAndDelete(savedUser._id);
    await Hospital.findByIdAndDelete(savedHospital._id);
    await Patient.findByIdAndDelete(savedPatient._id);
    await Referral.findByIdAndDelete(savedReferral._id);
    await DiagnosticResult.findByIdAndDelete(savedDiagnostic._id);
    await Medication.findByIdAndDelete(savedMedication._id);
    await ChatMessage.findByIdAndDelete(savedChat._id);
    await Alert.findByIdAndDelete(savedAlert._id);
    console.log('✓ Cleanup complete');

    console.log('\n>>> ALL 8 MONGOOSE MODELS VALIDATED SUCCESSFULLY <<<');
    process.exit(0);
  } catch (err) {
    console.error('Error during model verification:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

runModelVerification();
