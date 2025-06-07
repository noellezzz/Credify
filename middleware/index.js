const { authenticateToken } = require('./auth');
const { logRequest } = require('./logger');

module.exports = {
  authenticateToken,
  logRequest
};
