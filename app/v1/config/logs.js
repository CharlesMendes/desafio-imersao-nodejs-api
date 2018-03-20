const winston = require('winston');
const logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      name: 'info-file',
      filename: 'logs/v1/debug.log',
      level: 'info',
    }),
    new winston.transports.File({
      name: 'error-file',
      filename: 'logs/v1/error.log',
      level: 'error',
    }),
  ],
});

module.exports = logger;
