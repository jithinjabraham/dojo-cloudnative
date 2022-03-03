const winston = require('winston')

const options = {
    console: {
      level: 'info',
      handleExceptions: true,
      json: true,
      timestamp: true
    }
  }
  
  const logger = winston.createLogger({

    levels: winston.config.syslog.levels,
    transports: [
    new winston.transports.Console(options.console)
    ],
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    exitOnError: false
  })
  
  module.exports = logger;