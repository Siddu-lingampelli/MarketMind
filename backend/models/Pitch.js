const mongoose = require('mongoose');

const pitchSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  persona: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
  companySize: String,
  budgetRange: String,
  result: {
    elevatorPitch: String,
    valueProposition: String,
    differentiators: [String],
    callToAction: String,
    rawResponse: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Pitch', pitchSchema);
