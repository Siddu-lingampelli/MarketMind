const generateToken = (user) => {
  // This is a placeholder - actual JWT generation happens on backend
  return `token_for_${user.email}`;
};

const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

const getAuthToken = () => {
  return localStorage.getItem('token');
};

module.exports = {
  generateToken,
  setAuthToken,
  getAuthToken,
};
