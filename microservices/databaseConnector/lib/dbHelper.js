/* MONGOOSE SETUP */
require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const config = require('../config');
const logger = require('./logger');

logger.init();

// const connectionURL = `mongodb://${config.dbDetails.user}:${config.dbDetails.password}@${config.dbDetails.host}:${config.dbDetails.port}/${config.dbDetails.DBName}`;
const connectionURL = `mongodb://${config.dbDetails.host}:${config.dbDetails.port}/${config.dbDetails.DBName}`;

const connectionOptions = {
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 20, // Maintain up to 10 socket connections
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  // user: config.dbDetails.user,
  // pass: config.dbDetails.password,
};

mongoose.connect(connectionURL, connectionOptions);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', (err) => {
  logger.error(`Error in connecting to MongoDB: ${err}`);
});
db.once('open', () => {
  logger.info('Successfully connected to mongo db');
});
module.exports = db;
