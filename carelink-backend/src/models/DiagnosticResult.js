const mongoose = require('mongoose');

const diagnosticResultSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient ID is required']
  },
  testName: {
    type: String,
    required: [true, 'Test name is required'],
    trim: true
  },
  orderedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  orderedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  resultValue: {
    type: String,
    default: ''
  },
  normalRange: {
    type: String,
    default: ''
  },
  unit: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['ordered', 'completed', 'reviewed', 'patient_informed', 'action_taken'],
    default: 'ordered'
  },
  classification: {
    type: String,
    enum: ['normal', 'review_needed', 'urgent'],
    default: 'normal'
  },
  classificationReason: {
    type: String,
    default: ''
  },
  keyFindings: [{ type: String }],
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  patientInformedAt: {
    type: Date
  },
  actionTakenAt: {
    type: Date
  },
  actionNotes: {
    type: String,
    default: ''
  },
  flags: [{ type: String }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('DiagnosticResult', diagnosticResultSchema);
