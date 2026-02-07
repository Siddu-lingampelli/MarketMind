const express = require('express');
const router = express.Router();
const {
  generateCampaign,
  getCampaignHistory,
  getCampaignById,
} = require('../controllers/campaignController');
const { protect } = require('../middleware/auth');
const { validateCampaign } = require('../middleware/validation');

router.post('/generate', protect, validateCampaign, generateCampaign);
router.get('/history', protect, getCampaignHistory);
router.get('/:id', protect, getCampaignById);

module.exports = router;
