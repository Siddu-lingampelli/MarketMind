const { body, validationResult } = require('express-validator');

const validateCampaign = [
  body('product').trim().notEmpty().withMessage('Product description is required'),
  body('audience').trim().notEmpty().withMessage('Target audience is required'),
  body('platform').trim().notEmpty().withMessage('Platform is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validatePitch = [
  body('productName').trim().notEmpty().withMessage('Product name is required'),
  body('persona').trim().notEmpty().withMessage('Customer persona is required'),
  body('industry').trim().notEmpty().withMessage('Industry is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateLead = [
  body('name').optional().trim(),
  body('budget').optional().trim(),
  body('need').optional().trim(),
  body('urgency').optional().trim(),
  body('emailContext').optional().trim(),
  (req, res, next) => {
    const { name, budget, need, urgency, emailContext } = req.body;
    
    // Allow either manual fields OR email context
    const hasManualFields = name && budget && need && urgency;
    const hasEmailContext = emailContext && emailContext.trim().length > 0;

    if (!hasManualFields && !hasEmailContext) {
      return res.status(400).json({
        success: false,
        message: 'Please provide lead details OR paste an email conversation',
      });
    }
    
    next();
  },
];

const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateCampaign,
  validatePitch,
  validateLead,
  validateRegister,
  validateLogin,
};
