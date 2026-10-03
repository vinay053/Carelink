const mongoose = require('mongoose');

const prescribedDrugSchema = new mongoose.Schema({
  drugName: { type: String, required: true },
  genericName: String,
  dose: String,
  frequency: String,
  duration: String,
  startDate: Date,
  endDate: Date,
  isActive: { type: Boolean, default: true }
}, { _id: false });

const prescriptionGroupSchema = new mongoose.Schema({
  prescribedBy: String,
  prescribedAt: { type: Date, default: Date.now },
  hospitalName: String,
  drugs: [prescribedDrugSchema]
}, { _id: true });

const drugConflictSchema = new mongoose.Schema({
  drug1: { type: String, required: true },
  drug2: { type: String, required: true },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  explanation: { type: String, required: true },
  source: { type: String, default: 'OpenFDA API / Heuristic Safety Engine' },
  flaggedAt: { type: Date, default: Date.now },
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolvedAt: Date,
  status: {
    type: String,
    enum: ['unresolved', 'reviewed', 'resolved'],
    default: 'unresolved'
  }
}, { _id: true });

const medicationSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient ID is required']
  },
  prescriptions: [prescriptionGroupSchema],
  conflicts: [drugConflictSchema],
  reconciliationStatus: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved'],
    default: 'pending'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Medication', medicationSchema);
