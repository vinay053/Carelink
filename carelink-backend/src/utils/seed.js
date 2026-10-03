const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {
  User,
  Patient,
  Referral,
  DiagnosticResult,
  Medication,
  Hospital,
  Alert,
  ChatMessage
} = require('../models');
require('dotenv').config();

const STAGE_NAMES = [
  'Referral Created',
  'Referral Accepted',
  'Appointment Booked',
  'Patient Arrived at Hospital',
  'Specialist Consulted',
  'Treatment Started',
  'Follow-up Completed',
  'Referral Closed'
];

async function seedDatabase() {
  console.log('====================================================');
  console.log('   CARELINK SEEDING ENGINE - MADHYA PRADESH DATASET  ');
  console.log('====================================================\n');

  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/carelink');
    console.log('✓ Connected to MongoDB');

    // 1. Wipe existing data
    await Promise.all([
      User.deleteMany({}),
      Patient.deleteMany({}),
      Referral.deleteMany({}),
      DiagnosticResult.deleteMany({}),
      Medication.deleteMany({}),
      Hospital.deleteMany({}),
      Alert.deleteMany({}),
      ChatMessage.deleteMany({})
    ]);
    console.log('✓ Cleared all existing collections');

    // 2. Create Hospitals
    const hospitals = await Hospital.create([
      {
        name: 'District Hospital Sagar',
        address: 'Civil Lines, Sagar',
        district: 'Sagar',
        state: 'Madhya Pradesh',
        coordinates: { lat: 23.8388, lng: 78.7378 },
        type: 'district',
        specialties: ['General Medicine', 'Orthopedics', 'Pediatrics', 'Obstetrics & Gynecology'],
        totalICUBeds: 12,
        availableICUBeds: 3,
        hasCT: true,
        hasMRI: false,
        hasBloodBank: true,
        bloodBankInventory: { 'A+': 14, 'B+': 22, 'O+': 30, 'AB+': 8, 'O-': 4 },
        specialists: [
          { name: 'Dr. R. K. Ahirwar', specialty: 'General Medicine', availableToday: true, nextAvailable: 'Today' },
          { name: 'Dr. Meena Saxena', specialty: 'Pediatrics', availableToday: true, nextAvailable: 'Today' }
        ],
        currentLoad: 82,
        estimatedWaitMinutes: 45
      },
      {
        name: 'Netaji Subhash Chandra Bose Medical College & Hospital',
        address: 'Garha Road, Jabalpur',
        district: 'Jabalpur',
        state: 'Madhya Pradesh',
        coordinates: { lat: 23.1815, lng: 79.9864 },
        type: 'tertiary',
        specialties: ['Cardiology', 'Cardiothoracic Surgery', 'Neurology', 'Nephrology', 'Oncology', 'General Surgery'],
        totalICUBeds: 36,
        availableICUBeds: 14,
        hasCT: true,
        hasMRI: true,
        hasBloodBank: true,
        bloodBankInventory: { 'A+': 45, 'B+': 60, 'O+': 80, 'AB+': 25, 'O-': 12, 'AB-': 6 },
        specialists: [
          { name: 'Dr. Sunita Patel', specialty: 'Cardiology', availableToday: true, nextAvailable: 'Today' },
          { name: 'Dr. Vivek Mishra', specialty: 'Nephrology', availableToday: true, nextAvailable: 'Today' },
          { name: 'Dr. Alok Sen', specialty: 'Neurology', availableToday: false, nextAvailable: 'Tomorrow 9:00 AM' }
        ],
        currentLoad: 68,
        estimatedWaitMinutes: 25
      },
      {
        name: 'AIIMS Bhopal',
        address: 'Saket Nagar, Bhopal',
        district: 'Bhopal',
        state: 'Madhya Pradesh',
        coordinates: { lat: 23.2057, lng: 77.4566 },
        type: 'tertiary',
        specialties: ['Cardiology', 'Cardiothoracic Surgery', 'Neurology', 'Neurosurgery', 'Oncology', 'Organ Transplant'],
        totalICUBeds: 50,
        availableICUBeds: 22,
        hasCT: true,
        hasMRI: true,
        hasBloodBank: true,
        bloodBankInventory: { 'A+': 90, 'B+': 110, 'O+': 140, 'AB+': 40, 'O-': 25, 'B-': 18 },
        specialists: [
          { name: 'Dr. Anil K. Gupta', specialty: 'Cardiology', availableToday: true, nextAvailable: 'Today' },
          { name: 'Dr. Pooja Nambiar', specialty: 'Oncology', availableToday: true, nextAvailable: 'Today' }
        ],
        currentLoad: 61,
        estimatedWaitMinutes: 20
      }
    ]);
    console.log(`✓ Seeded ${hospitals.length} healthcare facilities (Sagar, Jabalpur, Bhopal)`);

    // 3. Create Users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = await User.create([
      {
        name: 'Dr. Arvind Sharma (State Coordinator)',
        email: 'admin@carelink.in',
        password: hashedPassword,
        role: 'admin',
        hospitalId: hospitals[1]._id,
        phone: '9826011111'
      },
      {
        name: 'Dr. Rajesh Verma (PHC Sagar)',
        email: 'dr.verma@sagarphc.in',
        password: hashedPassword,
        role: 'doctor',
        hospitalId: hospitals[0]._id,
        phone: '9826022222'
      },
      {
        name: 'Dr. Sunita Patel (Cardiologist, Jabalpur MC)',
        email: 'dr.patel@jabalpurmc.in',
        password: hashedPassword,
        role: 'doctor',
        hospitalId: hospitals[1]._id,
        phone: '9826033333'
      },
      {
        name: 'Ramesh Shukla (Chief Pharmacist)',
        email: 'pharma.shukla@carelink.in',
        password: hashedPassword,
        role: 'pharmacist',
        hospitalId: hospitals[1]._id,
        phone: '9826044444'
      }
    ]);
    console.log(`✓ Seeded ${users.length} authenticated users across all clinical roles`);

    // 4. Create Patients
    const patients = await Patient.create([
      {
        abhaId: '23-4567-8901-2345',
        name: 'Suresh Kumar',
        dateOfBirth: new Date('1968-04-12'),
        gender: 'male',
        phone: '9425010001',
        address: { district: 'Sagar', state: 'Madhya Pradesh', pincode: '470002' },
        bloodGroup: 'B+',
        emergencyContact: { name: 'Kailash Kumar', phone: '9425010002', relation: 'Son' },
        conditions: ['Suspected Acute Coronary Syndrome', 'Essential Hypertension'],
        allergies: ['Penicillin'],
        assignedDoctorId: users[1]._id,
        hospitalId: hospitals[0]._id,
        currentMedications: [
          { drugName: 'Aspirin 75mg', dose: '75mg', frequency: 'Once daily', isActive: true },
          { drugName: 'Atorvastatin 40mg', dose: '40mg', frequency: 'At bedtime', isActive: true },
          { drugName: 'Clopidogrel 75mg', dose: '75mg', frequency: 'Once daily', isActive: true }
        ]
      },
      {
        abhaId: '23-8899-1234-5678',
        name: 'Anita Bai',
        dateOfBirth: new Date('1984-08-23'),
        gender: 'female',
        phone: '9425020001',
        address: { district: 'Damoh', state: 'Madhya Pradesh', pincode: '470661' },
        bloodGroup: 'O+',
        emergencyContact: { name: 'Devendra Bai', phone: '9425020002', relation: 'Spouse' },
        conditions: ['Type 2 Diabetes Mellitus', 'Diabetic Nephropathy Stage 3'],
        allergies: ['Sulfa drugs'],
        assignedDoctorId: users[1]._id,
        hospitalId: hospitals[0]._id,
        currentMedications: [
          { drugName: 'Metformin 500mg', dose: '500mg', frequency: 'Twice daily', isActive: true },
          { drugName: 'Ramipril 5mg', dose: '5mg', frequency: 'Once daily', isActive: true }
        ]
      },
      {
        abhaId: '23-7766-3456-7890',
        name: 'Mohanlal Lodhi',
        dateOfBirth: new Date('1960-11-05'),
        gender: 'male',
        phone: '9425030001',
        address: { district: 'Sagar', state: 'Madhya Pradesh', pincode: '470227' },
        bloodGroup: 'A+',
        emergencyContact: { name: 'Santosh Lodhi', phone: '9425030002', relation: 'Brother' },
        conditions: ['Severe Hypertension', 'Osteoarthritis'],
        allergies: [],
        assignedDoctorId: users[1]._id,
        hospitalId: hospitals[0]._id,
        currentMedications: [
          { drugName: 'Amlodipine 5mg', dose: '5mg', frequency: 'Once daily', isActive: true }
        ]
      },
      {
        abhaId: '23-3344-5566-7788',
        name: 'Priya Vishwakarma',
        dateOfBirth: new Date('1997-02-18'),
        gender: 'female',
        phone: '9425040001',
        address: { district: 'Jabalpur', state: 'Madhya Pradesh', pincode: '482001' },
        bloodGroup: 'AB+',
        emergencyContact: { name: 'Manoj Vishwakarma', phone: '9425040002', relation: 'Spouse' },
        conditions: ['High-Risk Pregnancy (Gestational Hypertension)'],
        allergies: [],
        assignedDoctorId: users[2]._id,
        hospitalId: hospitals[1]._id,
        currentMedications: [
          { drugName: 'Labetalol 100mg', dose: '100mg', frequency: 'Twice daily', isActive: true },
          { drugName: 'Folic Acid 5mg', dose: '5mg', frequency: 'Once daily', isActive: true }
        ]
      },
      {
        abhaId: '23-9988-7766-5544',
        name: 'Ramcharan Gond',
        dateOfBirth: new Date('1973-09-30'),
        gender: 'male',
        phone: '9425050001',
        address: { district: 'Chhindwara', state: 'Madhya Pradesh', pincode: '480001' },
        bloodGroup: 'O-',
        emergencyContact: { name: 'Sumitra Gond', phone: '9425050002', relation: 'Spouse' },
        conditions: ['Chronic Obstructive Pulmonary Disease (COPD)'],
        allergies: [],
        assignedDoctorId: users[2]._id,
        hospitalId: hospitals[1]._id,
        currentMedications: [
          { drugName: 'Salbutamol Inhaler', dose: '100mcg', frequency: 'As needed', isActive: true }
        ]
      }
    ]);
    console.log(`✓ Seeded ${patients.length} patients with verified ABHA IDs`);

    // 5. Create Referrals
    const referrals = await Referral.create([
      // Referral 1: Suresh Kumar - HIGH RISK, Stage 1 (Accepted), Delayed -> Active Care Gap Alert
      {
        patientId: patients[0]._id,
        referringDoctorId: users[1]._id,
        referringHospitalId: hospitals[0]._id,
        targetHospitalId: hospitals[1]._id,
        targetSpecialty: 'Cardiology',
        urgency: 'high',
        status: 'accepted',
        currentStage: 1,
        riskScore: 85,
        riskLevel: 'high',
        riskFactors: [
          { factor: 'Long travel distance (58 km > 50 km)', points: 20 },
          { factor: 'No confirmed appointment booked', points: 15 },
          { factor: 'High clinical urgency tier', points: 10 },
          { factor: 'No private transport recorded', points: 10 },
          { factor: 'Target facility congestion (68%)', points: 15 },
          { factor: 'History of missed appointments (1 recorded)', points: 15 }
        ],
        recommendedAction: 'Assign ASHA/Community health worker immediately; coordinate transport and dispatch SMS reminder 24h prior.',
        notes: 'Suspected unstable angina with ST changes on ECG. Needs urgent angiography.',
        stageTimestamps: [
          { stageIndex: 0, stageName: STAGE_NAMES[0], completedAt: new Date(Date.now() - 60 * 3600 * 1000), updatedBy: users[1]._id, notes: 'Initiated at PHC' },
          { stageIndex: 1, stageName: STAGE_NAMES[1], completedAt: new Date(Date.now() - 48 * 3600 * 1000), updatedBy: users[2]._id, notes: 'Accepted by Cardiology Unit' }
        ],
        expectedDurations: [
          { stageIndex: 0, hoursAllowed: 24 },
          { stageIndex: 1, hoursAllowed: 24 },
          { stageIndex: 2, hoursAllowed: 24 }
        ]
      },
      // Referral 2: Anita Bai - Medium Risk, Stage 3 (Patient Arrived)
      {
        patientId: patients[1]._id,
        referringDoctorId: users[1]._id,
        referringHospitalId: hospitals[0]._id,
        targetHospitalId: hospitals[1]._id,
        targetSpecialty: 'Nephrology',
        urgency: 'medium',
        status: 'patient_arrived',
        currentStage: 3,
        riskScore: 50,
        riskLevel: 'medium',
        riskFactors: [
          { factor: 'Long travel distance (72 km > 50 km)', points: 20 },
          { factor: 'No private transport recorded', points: 10 }
        ],
        recommendedAction: 'Schedule automated follow-up verification call within 48 hours.',
        notes: 'Progressive proteinuria with elevated serum creatinine.',
        stageTimestamps: [
          { stageIndex: 0, stageName: STAGE_NAMES[0], completedAt: new Date(Date.now() - 72 * 3600 * 1000), updatedBy: users[1]._id },
          { stageIndex: 1, stageName: STAGE_NAMES[1], completedAt: new Date(Date.now() - 48 * 3600 * 1000), updatedBy: users[2]._id },
          { stageIndex: 2, stageName: STAGE_NAMES[2], completedAt: new Date(Date.now() - 24 * 3600 * 1000), updatedBy: users[2]._id },
          { stageIndex: 3, stageName: STAGE_NAMES[3], completedAt: new Date(Date.now() - 6 * 3600 * 1000), updatedBy: users[2]._id }
        ]
      },
      // Referral 3: Mohanlal Lodhi - Completed Closed Loop (Follow-up Done)
      {
        patientId: patients[2]._id,
        referringDoctorId: users[1]._id,
        referringHospitalId: hospitals[0]._id,
        targetHospitalId: hospitals[0]._id,
        targetSpecialty: 'General Medicine',
        urgency: 'low',
        status: 'follow_up_done',
        currentStage: 6,
        riskScore: 15,
        riskLevel: 'low',
        riskFactors: [
          { factor: 'Local travel distance', points: 0 }
        ],
        recommendedAction: 'Standard monitoring of referral progress.',
        notes: 'Routine hypertension dosage titration and follow-up.',
        stageTimestamps: [
          { stageIndex: 0, stageName: STAGE_NAMES[0], completedAt: new Date(Date.now() - 14 * 24 * 3600 * 1000), updatedBy: users[1]._id },
          { stageIndex: 1, stageName: STAGE_NAMES[1], completedAt: new Date(Date.now() - 12 * 24 * 3600 * 1000), updatedBy: users[1]._id },
          { stageIndex: 2, stageName: STAGE_NAMES[2], completedAt: new Date(Date.now() - 10 * 24 * 3600 * 1000), updatedBy: users[1]._id },
          { stageIndex: 3, stageName: STAGE_NAMES[3], completedAt: new Date(Date.now() - 7 * 24 * 3600 * 1000), updatedBy: users[1]._id },
          { stageIndex: 4, stageName: STAGE_NAMES[4], completedAt: new Date(Date.now() - 7 * 24 * 3600 * 1000), updatedBy: users[1]._id },
          { stageIndex: 5, stageName: STAGE_NAMES[5], completedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000), updatedBy: users[1]._id },
          { stageIndex: 6, stageName: STAGE_NAMES[6], completedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000), updatedBy: users[1]._id, notes: 'Follow-up blood pressure controlled at 128/82 mmHg.' }
        ]
      },
      // Referral 4: Priya Vishwakarma - Stage 2 (Appt Booked)
      {
        patientId: patients[3]._id,
        referringDoctorId: users[2]._id,
        referringHospitalId: hospitals[1]._id,
        targetHospitalId: hospitals[2]._id,
        targetSpecialty: 'Cardiothoracic Surgery',
        urgency: 'high',
        status: 'appointment_booked',
        currentStage: 2,
        riskScore: 40,
        riskLevel: 'low',
        recommendedAction: 'Standard monitoring of referral progress.',
        notes: 'Pre-term fetal cardiac assessment at tertiary center.',
        stageTimestamps: [
          { stageIndex: 0, stageName: STAGE_NAMES[0], completedAt: new Date(Date.now() - 48 * 3600 * 1000), updatedBy: users[2]._id },
          { stageIndex: 1, stageName: STAGE_NAMES[1], completedAt: new Date(Date.now() - 36 * 3600 * 1000), updatedBy: users[2]._id },
          { stageIndex: 2, stageName: STAGE_NAMES[2], completedAt: new Date(Date.now() - 12 * 3600 * 1000), updatedBy: users[2]._id }
        ]
      },
      // Referral 5: Ramcharan Gond - Stage 0 (Created, High Urgency)
      {
        patientId: patients[4]._id,
        referringDoctorId: users[2]._id,
        referringHospitalId: hospitals[1]._id,
        targetHospitalId: hospitals[2]._id,
        targetSpecialty: 'Pulmonology',
        urgency: 'critical',
        status: 'created',
        currentStage: 0,
        riskScore: 78,
        riskLevel: 'high',
        riskFactors: [
          { factor: 'Critical clinical urgency tier', points: 20 },
          { factor: 'Long travel distance (135 km > 50 km)', points: 20 },
          { factor: 'No confirmed appointment booked', points: 15 },
          { factor: 'No private transport recorded', points: 10 }
        ],
        recommendedAction: 'Assign ASHA/Community health worker immediately; coordinate transport assistance.',
        notes: 'Severe respiratory distress with oxygen desaturation.',
        stageTimestamps: [
          { stageIndex: 0, stageName: STAGE_NAMES[0], completedAt: new Date(Date.now() - 14 * 3600 * 1000), updatedBy: users[2]._id }
        ]
      }
    ]);
    console.log(`✓ Seeded ${referrals.length} referrals representing all lifecycle stages and risk tiers`);

    // 6. Create Diagnostic Results (10 results, including 2 urgent unreviewed)
    const diagnostics = await DiagnosticResult.create([
      {
        patientId: patients[0]._id,
        testName: 'Troponin-T High Sensitivity',
        orderedBy: users[1]._id,
        orderedAt: new Date(Date.now() - 36 * 3600 * 1000),
        completedAt: new Date(Date.now() - 30 * 3600 * 1000),
        resultValue: '0.14 ng/mL',
        normalRange: '< 0.014 ng/mL',
        unit: 'ng/mL',
        status: 'completed',
        classification: 'urgent',
        classificationReason: 'Critical 10x elevation in Troponin-T indicates ongoing myocardial injury.',
        keyFindings: ['Significant myocardial necrosis biomarker', 'Requires immediate catheterization lab activation']
      },
      {
        patientId: patients[0]._id,
        testName: '12-Lead Electrocardiogram (ECG)',
        orderedBy: users[1]._id,
        orderedAt: new Date(Date.now() - 40 * 3600 * 1000),
        completedAt: new Date(Date.now() - 38 * 3600 * 1000),
        resultValue: 'ST depression V4-V6 with T-wave inversion',
        normalRange: 'Normal sinus rhythm',
        status: 'reviewed',
        classification: 'urgent',
        classificationReason: 'Ischemic ST segment changes in anterolateral leads.',
        reviewedBy: users[2]._id,
        reviewedAt: new Date(Date.now() - 35 * 3600 * 1000)
      },
      {
        patientId: patients[1]._id,
        testName: 'Serum Creatinine & eGFR',
        orderedBy: users[1]._id,
        orderedAt: new Date(Date.now() - 50 * 3600 * 1000),
        completedAt: new Date(Date.now() - 44 * 3600 * 1000),
        resultValue: '2.4 mg/dL (eGFR 28 mL/min/1.73m²)',
        normalRange: '0.6 - 1.1 mg/dL',
        unit: 'mg/dL',
        status: 'completed',
        classification: 'urgent',
        classificationReason: 'Serum creatinine elevated, placing patient in Stage 4 Chronic Kidney Disease.',
        keyFindings: ['Severe renal impairment', 'Review nephrotoxic medications']
      },
      {
        patientId: patients[1]._id,
        testName: 'HbA1c Glycated Hemoglobin',
        orderedBy: users[1]._id,
        orderedAt: new Date(Date.now() - 60 * 3600 * 1000),
        completedAt: new Date(Date.now() - 55 * 3600 * 1000),
        resultValue: '9.4%',
        normalRange: '< 5.7%',
        unit: '%',
        status: 'reviewed',
        classification: 'review_needed',
        classificationReason: 'Uncontrolled glycemic level.',
        reviewedBy: users[1]._id,
        reviewedAt: new Date(Date.now() - 50 * 3600 * 1000)
      },
      {
        patientId: patients[2]._id,
        testName: 'Complete Blood Count (CBC)',
        orderedBy: users[1]._id,
        orderedAt: new Date(Date.now() - 10 * 24 * 3600 * 1000),
        completedAt: new Date(Date.now() - 9 * 24 * 3600 * 1000),
        resultValue: 'Hb 13.8 g/dL, WBC 7,200/uL, Platelets 240,000/uL',
        normalRange: 'Within normal limits',
        status: 'reviewed',
        classification: 'normal',
        reviewedBy: users[1]._id,
        reviewedAt: new Date(Date.now() - 8 * 24 * 3600 * 1000)
      },
      {
        patientId: patients[2]._id,
        testName: 'Lipid Profile',
        orderedBy: users[1]._id,
        orderedAt: new Date(Date.now() - 10 * 24 * 3600 * 1000),
        completedAt: new Date(Date.now() - 9 * 24 * 3600 * 1000),
        resultValue: 'Total Cholesterol 185 mg/dL, LDL 102 mg/dL',
        normalRange: '< 200 mg/dL',
        status: 'action_taken',
        classification: 'normal',
        reviewedBy: users[1]._id,
        reviewedAt: new Date(Date.now() - 8 * 24 * 3600 * 1000),
        actionTakenAt: new Date(Date.now() - 7 * 24 * 3600 * 1000),
        actionNotes: 'Patient advised on dietary maintenance; lipid goals met.'
      },
      {
        patientId: patients[3]._id,
        testName: 'Obstetric Ultrasound (Level II Scan)',
        orderedBy: users[2]._id,
        orderedAt: new Date(Date.now() - 20 * 3600 * 1000),
        completedAt: new Date(Date.now() - 15 * 3600 * 1000),
        resultValue: 'Single live fetus 26 weeks, adequate liquor, normal umbilical Doppler',
        normalRange: 'Normal anatomical survey',
        status: 'reviewed',
        classification: 'normal',
        reviewedBy: users[2]._id,
        reviewedAt: new Date(Date.now() - 10 * 3600 * 1000)
      },
      {
        patientId: patients[4]._id,
        testName: 'Chest X-Ray PA View',
        orderedBy: users[2]._id,
        orderedAt: new Date(Date.now() - 12 * 3600 * 1000),
        completedAt: new Date(Date.now() - 8 * 3600 * 1000),
        resultValue: 'Hyperinflated lung fields, flattened diaphragms consistent with emphysema',
        normalRange: 'Clear lung parenchyma',
        status: 'reviewed',
        classification: 'review_needed',
        reviewedBy: users[2]._id,
        reviewedAt: new Date(Date.now() - 6 * 3600 * 1000)
      },
      {
        patientId: patients[4]._id,
        testName: 'Arterial Blood Gas (ABG)',
        orderedBy: users[2]._id,
        orderedAt: new Date(Date.now() - 4 * 3600 * 1000),
        completedAt: new Date(Date.now() - 2 * 3600 * 1000),
        resultValue: 'pH 7.32, pCO2 56 mmHg, pO2 62 mmHg, HCO3 28 mEq/L',
        normalRange: 'pH 7.35-7.45, pCO2 35-45',
        status: 'completed',
        classification: 'review_needed',
        classificationReason: 'Compensated respiratory acidosis with mild hypoxemia.'
      },
      {
        patientId: patients[0]._id,
        testName: 'Echocardiogram (2D Echo)',
        orderedBy: users[2]._id,
        orderedAt: new Date(Date.now() - 24 * 3600 * 1000),
        resultValue: 'Pending specialist appointment',
        normalRange: 'LVEF > 55%',
        status: 'ordered',
        classification: 'normal'
      }
    ]);
    console.log(`✓ Seeded ${diagnostics.length} diagnostic results (including 2 urgent unreviewed)`);

    // 7. Create Medications with Cross-Provider Conflicts
    const medications = await Medication.create([
      {
        patientId: patients[0]._id,
        prescriptions: [
          {
            prescribedBy: 'Dr. Rajesh Verma',
            prescribedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000),
            hospitalName: 'District Hospital Sagar',
            drugs: [
              { drugName: 'Aspirin', genericName: 'Acetylsalicylic acid', dose: '75mg', frequency: 'Once daily', duration: '30 days', isActive: true },
              { drugName: 'Atorvastatin', genericName: 'Atorvastatin calcium', dose: '40mg', frequency: 'Once daily', duration: '30 days', isActive: true }
            ]
          },
          {
            prescribedBy: 'Dr. Sunita Patel',
            prescribedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
            hospitalName: 'Jabalpur Medical College',
            drugs: [
              { drugName: 'Clopidogrel', genericName: 'Clopidogrel bisulfate', dose: '75mg', frequency: 'Once daily', duration: '14 days', isActive: true },
              { drugName: 'Warfarin', genericName: 'Warfarin sodium', dose: '2.5mg', frequency: 'Once daily', duration: '14 days', isActive: true }
            ]
          }
        ],
        conflicts: [
          {
            drug1: 'Aspirin',
            drug2: 'Warfarin',
            severity: 'high',
            explanation: 'Co-administration markedly increases the risk of serious gastrointestinal hemorrhage and bleeding events.',
            source: 'CareLink Deterministic Clinical Interaction Engine',
            status: 'unresolved',
            flaggedAt: new Date(Date.now() - 24 * 3600 * 1000)
          },
          {
            drug1: 'Aspirin',
            drug2: 'Clopidogrel',
            severity: 'medium',
            explanation: 'Dual antiplatelet therapy increases bleeding propensity; monitor platelet count and coagulation parameters.',
            source: 'CareLink Deterministic Clinical Interaction Engine',
            status: 'reviewed',
            resolvedBy: users[3]._id,
            resolvedAt: new Date(Date.now() - 12 * 3600 * 1000)
          }
        ],
        reconciliationStatus: 'pending'
      },
      {
        patientId: patients[1]._id,
        prescriptions: [
          {
            prescribedBy: 'Dr. Rajesh Verma',
            prescribedAt: new Date(Date.now() - 10 * 24 * 3600 * 1000),
            hospitalName: 'District Hospital Sagar',
            drugs: [
              { drugName: 'Metformin', genericName: 'Metformin hydrochloride', dose: '500mg', frequency: 'Twice daily', duration: '60 days', isActive: true }
            ]
          }
        ],
        conflicts: [],
        reconciliationStatus: 'resolved'
      }
    ]);
    console.log(`✓ Seeded ${medications.length} medication reconciliation logs with flagged drug conflicts`);

    // 8. Create Active Alerts
    const alerts = await Alert.create([
      {
        type: 'referral_gap',
        severity: 'critical',
        patientId: patients[0]._id,
        referralId: referrals[0]._id,
        message: `[CRITICAL ESCALATION] Referral Stage 1 (Accepted) for Suresh Kumar is overdue by 24 hours. No appointment confirmed.`,
        status: 'active',
        assignedTo: users[1]._id
      },
      {
        type: 'diagnostic_pending',
        severity: 'critical',
        patientId: patients[0]._id,
        message: `CRITICAL diagnostic result: Troponin-T High Sensitivity (0.14 ng/mL) for Suresh Kumar has not been acknowledged by clinician for 30 hours.`,
        status: 'active',
        assignedTo: users[2]._id
      },
      {
        type: 'drug_conflict',
        severity: 'high',
        patientId: patients[0]._id,
        message: `High severity medication conflict: Aspirin + Warfarin detected across Sagar DH and Jabalpur MC prescriptions. Pharmacist intervention needed.`,
        status: 'active',
        assignedTo: users[3]._id
      },
      {
        type: 'diagnostic_pending',
        severity: 'high',
        patientId: patients[1]._id,
        message: `Urgent diagnostic review needed: Serum Creatinine 2.4 mg/dL for Anita Bai indicates progressive nephropathy.`,
        status: 'active',
        assignedTo: users[1]._id
      },
      {
        type: 'risk_escalation',
        severity: 'high',
        patientId: patients[4]._id,
        referralId: referrals[4]._id,
        message: `High dropout risk (78/100) flagged for Ramcharan Gond: 135km distance to AIIMS Bhopal with acute respiratory distress.`,
        status: 'active',
        assignedTo: users[2]._id
      }
    ]);
    console.log(`✓ Seeded ${alerts.length} operational alerts covering referral gaps, lab reviews, and drug conflicts`);

    console.log('\n====================================================');
    console.log('   DEMO CREDENTIALS TABLE (PASSWORD: password123)   ');
    console.log('====================================================');
    console.table([
      { Role: 'Admin (State Coordinator)', Email: 'admin@carelink.in', Facility: 'Jabalpur MC' },
      { Role: 'Doctor (Referring PHC)', Email: 'dr.verma@sagarphc.in', Facility: 'Sagar DH' },
      { Role: 'Doctor (Cardiologist)', Email: 'dr.patel@jabalpurmc.in', Facility: 'Jabalpur MC' },
      { Role: 'Pharmacist', Email: 'pharma.shukla@carelink.in', Facility: 'Jabalpur MC' }
    ]);
    console.log('====================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error during database seeding:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
