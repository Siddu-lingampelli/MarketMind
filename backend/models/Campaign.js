const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: String,
    required: true,
  },
  audience: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    required: true,
  },
  result: {
    objective: String,
    contentIdeas: [String],
    adCopies: [String],
    ctas: [String],
    rawResponse: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Campaign', campaignSchema);
