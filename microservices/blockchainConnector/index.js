require('dotenv').config({ path: '.env' });

let seneca = require('seneca');
const config = require('./config/index');

seneca = seneca({ timeout: config.blockchainMicroService.timeout });
const logger = require('./lib/logger');
// const response = require('./services/response/index');
const digital = require('./services/digital/index');
// const keepDisasterRelFund = require('./services/citizen/keepDisasterReliefFund');


logger.init();
// seneca.use(response);
seneca.use(digital);
// seneca.use(keepDisasterRelFund);

seneca.listen(config.blockchainMicroService);
logger.info(`Started blockchainConnector micro-service on port: ${config.blockchainMicroService.port}`);
