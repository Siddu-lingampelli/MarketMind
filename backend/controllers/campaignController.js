const Campaign = require('../models/Campaign');
const groqService = require('../services/groqService');

// @desc    Generate marketing campaign
// @route   POST /api/campaign/generate
// @access  Private
const generateCampaign = async (req, res) => {
  try {
    const { product, audience, platform, campaignObjective, tone } = req.body;

    // Generate campaign using Groq AI
    const result = await groqService.generateCampaign(
      product,
      audience,
      platform,
      campaignObjective,
      tone
    );

    // Save to database
    const campaign = await Campaign.create({
      user: req.user._id,
      product,
      audience,
      platform,
      result,
    });

    res.status(201).json({
      success: true,
      data: {
        id: campaign._id,
        objective: result.objective,
        contentIdeas: result.contentIdeas,
        adCopies: result.adCopies,
        ctas: result.ctas,
        performancePrediction: result.performancePrediction,
        createdAt: campaign.createdAt,
      },
    });
  } catch (error) {
    console.error('Campaign generation error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Failed to generate campaign' 
    });
  }
};

// @desc    Get user's campaign history
// @route   GET /api/campaign/history
// @access  Private
const getCampaignHistory = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('-result.rawResponse');

    res.json({
      success: true,
      count: campaigns.length,
      data: campaigns,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get campaign by ID
// @route   GET /api/campaign/:id
// @access  Private
const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!campaign) {
      return res.status(404).json({ 
        success: false,
        message: 'Campaign not found' 
      });
    }

    res.json({
      success: true,
      data: campaign,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

module.exports = {
  generateCampaign,
  getCampaignHistory,
  getCampaignById,
};
