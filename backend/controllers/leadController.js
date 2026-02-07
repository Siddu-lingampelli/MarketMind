const Lead = require('../models/Lead');
const groqService = require('../services/groqService');

// Helper to map explainable scoring format to legacy format
const mapExplainableToLegacy = (explainable) => {
  return {
    score: explainable.leadScore,
    category: explainable.priorityLevel,
    conversionProbability: parseInt(explainable.conversionProbability) || 0,
    explanation: explainable.reasoning,
    explanationBreakdown: explainable.explanationBreakdown,
    nextAction: explainable.recommendedAction,
    nextActions: explainable.nextActions,
    confidenceScore: explainable.confidenceScore,
    confidenceReasoning: explainable.confidenceReasoning,
    risks: explainable.risks,
    rawResponse: explainable.rawResponse
  };
};

// @desc    Score and qualify lead
// @route   POST /api/lead/score
// @access  Private
const scoreLead = async (req, res) => {
  try {
    const { name, budget, need, urgency, authority, emailContext } = req.body;

    // Score lead using Groq AI (returns explainable format)
    const explainableResult = await groqService.scoreLead(
      name,
      budget,
      need,
      urgency,
      authority,
      emailContext
    );

    // Map to legacy format for database
    const result = mapExplainableToLegacy(explainableResult);

    // Save to database
    const lead = await Lead.create({
      user: req.user._id,
      name: name || explainableResult.leadName || 'Email Lead',
      budget: budget || 'Extracted from email',
      need: need || 'Extracted from email',
      urgency: urgency || 'Extracted from email',
      authority,
      emailContext,
      result,
    });

    res.status(201).json({
      success: true,
      data: {
        id: lead._id,
        name: lead.name,
        score: result.score,
        category: result.category,
        conversionProbability: result.conversionProbability,
        explanation: result.explanation,
        explanationBreakdown: result.explanationBreakdown,
        nextAction: result.nextAction,
        nextActions: result.nextActions,
        confidenceScore: result.confidenceScore,
        confidenceReasoning: result.confidenceReasoning,
        risks: result.risks,
        createdAt: lead.createdAt,
      },
    });
  } catch (error) {
    console.error('Lead scoring error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Failed to score lead' 
    });
  }
};

// @desc    Get user's lead history
// @route   GET /api/lead/history
// @access  Private
const getLeadHistory = async (req, res) => {
  try {
    const leads = await Lead.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('-result.rawResponse');

    res.json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get lead by ID
// @route   GET /api/lead/:id
// @access  Private
const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!lead) {
      return res.status(404).json({ 
        success: false,
        message: 'Lead not found' 
      });
    }

    res.json({
      success: true,
      data: lead,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get lead statistics
// @route   GET /api/lead/stats
// @access  Private
const getLeadStats = async (req, res) => {
  try {
    const leads = await Lead.find({ user: req.user._id });

    const stats = {
      total: leads.length,
      hot: leads.filter(l => l.result.category === 'Hot').length,
      warm: leads.filter(l => l.result.category === 'Warm').length,
      lukewarm: leads.filter(l => l.result.category === 'Lukewarm').length,
      cold: leads.filter(l => l.result.category === 'Cold').length,
      averageScore: leads.length > 0 
        ? (leads.reduce((sum, l) => sum + l.result.score, 0) / leads.length).toFixed(1)
        : 0,
      averageConversionProbability: leads.length > 0
        ? (leads.reduce((sum, l) => sum + l.result.conversionProbability, 0) / leads.length).toFixed(1)
        : 0,
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

module.exports = {
  scoreLead,
  getLeadHistory,
  getLeadById,
  getLeadStats,
};
