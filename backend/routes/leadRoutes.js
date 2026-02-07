const express = require('express');
const router = express.Router();
const {
  scoreLead,
  getLeadHistory,
  getLeadById,
  getLeadStats,
} = require('../controllers/leadController');
const { protect } = require('../middleware/auth');
const { validateLead } = require('../middleware/validation');

router.post('/score', protect, validateLead, scoreLead);
router.get('/history', protect, getLeadHistory);
router.get('/stats', protect, getLeadStats);
router.get('/:id', protect, getLeadById);

module.exports = router;
