const validateCampaignInput = (data) => {
  const errors = [];

  if (!data.product || data.product.trim().length < 10) {
    errors.push('Product description must be at least 10 characters');
  }

  if (!data.audience || data.audience.trim().length < 10) {
    errors.push('Target audience must be at least 10 characters');
  }

  if (!data.platform) {
    errors.push('Platform is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const validatePitchInput = (data) => {
  const errors = [];

  if (!data.productName || data.productName.trim().length < 3) {
    errors.push('Product name must be at least 3 characters');
  }

  if (!data.persona || data.persona.trim().length < 10) {
    errors.push('Customer persona must be at least 10 characters');
  }

  if (!data.industry || data.industry.trim().length < 3) {
    errors.push('Industry must be at least 3 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const validateLeadInput = (data) => {
  const errors = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push('Lead name must be at least 2 characters');
  }

  if (!data.budget || data.budget.trim().length < 5) {
    errors.push('Budget details must be at least 5 characters');
  }

  if (!data.need || data.need.trim().length < 10) {
    errors.push('Business need must be at least 10 characters');
  }

  if (!data.urgency) {
    errors.push('Urgency level is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateCampaignInput,
  validatePitchInput,
  validateLeadInput,
};
