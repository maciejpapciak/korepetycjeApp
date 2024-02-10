const morgan = require('morgan');
const Logger = require('./winston');
const config = require('./project.config');

const stream = {
  write: (message) => Logger.http(message),
};

const skip = () => {
  const env = config.appSettings.nodeEnv || 'development';
  return env !== 'development';
};

const morganMiddleware = morgan('combined', { stream, skip });

module.exports = morganMiddleware;
