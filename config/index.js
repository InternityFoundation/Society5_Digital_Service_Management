require('dotenv').config({ path: '.env' });

const config = {};
config.sessionTimeoutTime = 1800;

config.databaseMicroService = {
  type: 'tcp',
  port: process.env.DB_MICROSERVICE_PORT,
  host: 'localhost',
  protocol: 'http',
  timeout: 180000,
};

config.blockchainMicroService = {
  type: 'tcp',
  port: process.env.BLOCKCHAIN_MICROSERVICE_PORT,
  host: 'localhost',
  protocol: 'http',
  timeout: 180000,
};

config.appUrl = `${process.env.APP_PROTOCOL}://${process.env.APP_HOST}:${process.env.APP_PORT}`;
module.exports = config;
