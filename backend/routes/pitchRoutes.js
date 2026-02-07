const express = require('express');
const router = express.Router();
const {
  generatePitch,
  getPitchHistory,
  getPitchById,
} = require('../controllers/pitchController');
const { protect } = require('../middleware/auth');
const { validatePitch } = require('../middleware/validation');

router.post('/generate', protect, validatePitch, generatePitch);
router.get('/history', protect, getPitchHistory);
router.get('/:id', protect, getPitchById);

module.exports = router;
