require('dotenv').config({ path: '.env' });

let seneca = require('seneca');
const config = require('./config');
const logger = require('./lib/logger');

seneca = seneca({ timeout: config.databaseMicroService.timeout });
logger.init();
const role = require('./services/role');
const user = require('./services/user');

seneca.use(role);
seneca.use(user);
seneca.listen(config.databaseMicroService);
logger.info(`Started databaseConnector micro-service on port: ${config.databaseMicroService.port}`);
