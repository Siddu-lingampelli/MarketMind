export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
};

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
  },
  CAMPAIGN: {
    GENERATE: '/campaign/generate',
    HISTORY: '/campaign/history',
    BY_ID: (id) => `/campaign/${id}`,
  },
  PITCH: {
    GENERATE: '/pitch/generate',
    HISTORY: '/pitch/history',
    BY_ID: (id) => `/pitch/${id}`,
  },
  LEAD: {
    SCORE: '/lead/score',
    HISTORY: '/lead/history',
    STATS: '/lead/stats',
    BY_ID: (id) => `/lead/${id}`,
  },
};

export const LEAD_CATEGORIES = {
  HOT: 'Hot',
  WARM: 'Warm',
  LUKEWARM: 'Lukewarm',
  COLD: 'Cold',
};

export const PLATFORMS = [
  'LinkedIn',
  'Instagram',
  'Facebook',
  'Twitter',
  'Email',
  'Google Ads',
  'TikTok',
  'YouTube',
];

export const COMPANY_SIZES = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1000+',
];

export const BUDGET_RANGES = [
  '< $10K',
  '$10K - $50K',
  '$50K - $100K',
  '$100K - $500K',
  '$500K+',
];

export const URGENCY_LEVELS = [
  'Immediate (within 1 month)',
  'Short-term (1-3 months)',
  'Medium-term (3-6 months)',
  'Long-term (6+ months)',
  'Exploring options',
];
