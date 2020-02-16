const log4js = require('log4js');
const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logger = log4js.getLogger('logFile');


const init = () => {
  log4js.configure({
    appenders: { logFile: { type: 'file', filename: 'log/access.log' } },
    categories: { default: { appenders: ['logFile'], level: 'debug' } },
  });
  const logDirectory = path.join(__dirname, '../log');

  // ensure log directory exists
  // eslint-disable-next-line no-unused-expressions
  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

  // create a rotating write stream
  const accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: logDirectory,
    maxFiles: 5,
  });
  accessLogStream.on('rotated', (filename) => {
    logger.info('rotated', filename);
    log4js.configure({
      appenders: { logFile: { type: 'file', filename: 'log/access.log' } },
      categories: { default: { appenders: ['logFile'], level: 'debug' } },
    });
  });
  logger.info('logger started successfully');
};

const info = (msg) => {
  logger.info(msg);
};

const error = (msg) => {
  logger.error(msg);
};

const debug = (msg) => {
  logger.debug(msg);
};


module.exports = {
  init,
  info,
  error,
  debug,
};
