const mongoose = require('mongoose');

const stageTimestampSchema = new mongoose.Schema({
  stageIndex: { type: Number, required: true },
  stageName: { type: String, required: true },
  completedAt: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: String
}, { _id: false });

const expectedDurationSchema = new mongoose.Schema({
  stageIndex: { type: Number, required: true },
  hoursAllowed: { type: Number, required: true }
}, { _id: false });

const riskFactorSchema = new mongoose.Schema({
  factor: { type: String, required: true },
  points: { type: Number, required: true }
}, { _id: false });

const referralAlertSchema = new mongoose.Schema({
  message: String,
  sentAt: { type: Date, default: Date.now },
  type: String
}, { _id: false });

const referralSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient ID is required']
  },
  referringDoctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Referring doctor ID is required']
  },
  referringHospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: [true, 'Referring hospital ID is required']
  },
  targetHospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: [true, 'Target hospital ID is required']
  },
  targetSpecialty: {
    type: String,
    required: [true, 'Target specialty is required'],
    trim: true
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: [
      'created',
      'accepted',
      'appointment_booked',
      'patient_arrived',
      'specialist_consulted',
      'treatment_started',
      'follow_up_done',
      'closed'
    ],
    default: 'created'
  },
  currentStage: {
    type: Number,
    min: 0,
    max: 7,
    default: 0
  },
  stageTimestamps: [stageTimestampSchema],
  expectedDurations: [expectedDurationSchema],
  riskScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  riskFactors: [riskFactorSchema],
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
  recommendedAction: {
    type: String,
    default: 'Monitor referral progress.'
  },
  notes: {
    type: String,
    default: ''
  },
  alerts: [referralAlertSchema]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Referral', referralSchema);
