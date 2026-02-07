const Pitch = require('../models/Pitch');
const groqService = require('../services/groqService');

// @desc    Generate sales pitch
// @route   POST /api/pitch/generate
// @access  Private
const generatePitch = async (req, res) => {
  try {
    const { productName, persona, industry, companySize, budgetRange, pitchMode } = req.body;

    // Generate pitch using Groq AI
    const result = await groqService.generatePitch(
      productName,
      persona,
      industry,
      companySize,
      budgetRange,
      pitchMode
    );

    // Save to database
    const pitch = await Pitch.create({
      user: req.user._id,
      productName,
      persona,
      industry,
      companySize,
      budgetRange,
      result,
    });

    res.status(201).json({
      success: true,
      data: {
        id: pitch._id,
        elevatorPitch: result.elevatorPitch,
        valueProposition: result.valueProposition,
        differentiators: result.differentiators,
        callToAction: result.callToAction,
        formats: result.formats,
        createdAt: pitch.createdAt,
      },
    });
  } catch (error) {
    console.error('Pitch generation error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Failed to generate pitch' 
    });
  }
};

// @desc    Get user's pitch history
// @route   GET /api/pitch/history
// @access  Private
const getPitchHistory = async (req, res) => {
  try {
    const pitches = await Pitch.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('-result.rawResponse');

    res.json({
      success: true,
      count: pitches.length,
      data: pitches,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get pitch by ID
// @route   GET /api/pitch/:id
// @access  Private
const getPitchById = async (req, res) => {
  try {
    const pitch = await Pitch.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!pitch) {
      return res.status(404).json({ 
        success: false,
        message: 'Pitch not found' 
      });
    }

    res.json({
      success: true,
      data: pitch,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

module.exports = {
  generatePitch,
  getPitchHistory,
  getPitchById,
};
