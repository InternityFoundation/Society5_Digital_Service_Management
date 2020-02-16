const config = {};

config.databaseMicroService = {
  type: 'tcp',
  port: process.env.DB_MICROSERVICE_PORT || '3000',
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

config.dbDetails = {
  host: process.env.DB_HOST,
  DBName: process.env.DB_NAME || 'demo',
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME || 'demo',
  password: process.env.DB_PASSWORD || 'demo',
};

module.exports = config;
