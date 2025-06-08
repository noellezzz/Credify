const fs = require('fs');
const path = require('path');

const logRequest = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent') || 'Unknown';

  const logEntry = `${timestamp} - ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}\n`;

  // Log to console
  console.log(`${timestamp} - ${method} ${url} - ${ip}`);

  // Log to file
  const logPath = path.join(__dirname, '../logs/access.log');
  fs.appendFile(logPath, logEntry, (err) => {
    if (err) console.error('Failed to write to log file:', err);
  });

  next();
};

module.exports = { logRequest };
