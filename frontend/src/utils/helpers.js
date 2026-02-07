export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getScoreColor = (score) => {
  if (score >= 80) return '#10b981'; // Green
  if (score >= 60) return '#f59e0b'; // Yellow
  if (score >= 40) return '#f97316'; // Orange
  return '#ef4444'; // Red
};

export const getCategoryColor = (category) => {
  const colors = {
    Hot: '#10b981',
    Warm: '#f59e0b',
    Lukewarm: '#f97316',
    Cold: '#ef4444',
  };
  return colors[category] || '#666';
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};
