const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: false,
    default: 'Email Lead',
  },
  budget: {
    type: String,
    required: false,
  },
  need: {
    type: String,
    required: false,
  },
  urgency: {
    type: String,
    required: false,
  },
  authority: String,
  emailContext: String,
  result: {
    score: Number,
    category: String,
    conversionProbability: Number,
    explanation: String,
    nextAction: String,
    nextActions: [{
      action: String,
      priority: String,
      timeline: String
    }],
    rawResponse: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Lead', leadSchema);
