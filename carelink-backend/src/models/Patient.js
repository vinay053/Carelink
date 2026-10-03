const mongoose = require('mongoose');

const medicationItemSchema = new mongoose.Schema({
  drugName: { type: String, required: true },
  dose: String,
  frequency: String,
  prescribedBy: String,
  startDate: Date,
  endDate: Date,
  isActive: { type: Boolean, default: true }
}, { _id: false });

const patientSchema = new mongoose.Schema({
  abhaId: {
    type: String,
    required: [true, 'ABHA ID is required'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    default: 'male'
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    district: String,
    state: String,
    pincode: String
  },
  bloodGroup: {
    type: String,
    trim: true
  },
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },
  currentMedications: [medicationItemSchema],
  allergies: [{ type: String, trim: true }],
  conditions: [{ type: String, trim: true }],
  assignedDoctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Patient', patientSchema);
