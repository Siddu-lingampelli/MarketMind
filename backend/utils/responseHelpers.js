const formatResponse = (success, data, message = null) => {
  const response = { success };
  
  if (data) {
    response.data = data;
  }
  
  if (message) {
    response.message = message;
  }
  
  return response;
};

const formatError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const sanitizeUser = (user) => {
  const { password, __v, ...sanitized } = user.toObject();
  return sanitized;
};

module.exports = {
  formatResponse,
  formatError,
  sanitizeUser,
};
