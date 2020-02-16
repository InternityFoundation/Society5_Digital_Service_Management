const fs = require('fs');
const path = require('path');
const config = {};

config.blockchainMicroService = {
  type: 'tcp',
  port: process.env.BLOCKCHAIN_MICROSERVICE_PORT || '4000',
  host: 'localhost',
  protocol: 'http',
  timeout: 180000,
};

config.databaseMicroService = {
  type: 'tcp',
  port: process.env.DB_MICROSERVICE_PORT || '3000',
  host: 'localhost',
  protocol: 'http',
  timeout: 180000,
};
config.contractAddressJsonFilePath = path.join(__dirname, './contractAddress.json');
config.contractAddress = JSON.parse(fs.readFileSync(config.contractAddressJsonFilePath));
config.extraGasPrice = 5000000000;

config.blockchainConnectionUrl = process.env.BLOCKCHAIN_CONNECTION_URL;

config.publicAddress = process.env.PUBLIC_ADDRESS;
config.privateKey = process.env.PRIVATE_KEY;
config.secretKeyToEncrypt = 'wedqfhbjaksmcklscmklcsahdunkfuaeikntklemsltk';
module.exports = config;
