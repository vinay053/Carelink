const mongoose = require('mongoose');

const specialistScheduleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  availableToday: { type: Boolean, default: true },
  nextAvailable: { type: String, default: 'Today' }
}, { _id: false });

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hospital name is required'],
    trim: true
  },
  address: String,
  district: {
    type: String,
    required: [true, 'District is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  coordinates: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 }
  },
  type: {
    type: String,
    enum: ['PHC', 'district', 'tertiary', 'private'],
    default: 'district'
  },
  specialties: [{ type: String, trim: true }],
  totalICUBeds: {
    type: Number,
    default: 0
  },
  availableICUBeds: {
    type: Number,
    default: 0
  },
  hasCT: {
    type: Boolean,
    default: false
  },
  hasMRI: {
    type: Boolean,
    default: false
  },
  hasBloodBank: {
    type: Boolean,
    default: false
  },
  bloodBankInventory: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  specialists: [specialistScheduleSchema],
  currentLoad: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  estimatedWaitMinutes: {
    type: Number,
    default: 30
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Hospital', hospitalSchema);
