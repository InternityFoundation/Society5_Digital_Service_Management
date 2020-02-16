const seneca = require('seneca');
const config = require('../../config/index');

const ethereumSenecaClient = seneca({ timeout: config.blockchainMicroService.timeout })
  .client(config.blockchainMicroService);


const addMultiple = userDetails => new Promise((resolve, reject) => {
  ethereumSenecaClient.act({
    role: 'digital',
    cmd: 'addMultiple',
    userDetails,
  }, (err, res) => {
    if (err) {
      reject(err);
    } else {
      resolve(res);
    }
  });
});

module.exports = {
  addMultiple,
};
