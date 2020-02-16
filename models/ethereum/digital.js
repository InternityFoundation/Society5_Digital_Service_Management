const seneca = require('seneca');
const config = require('../../config/index');

const ethereumSenecaClient = seneca({ timeout: config.blockchainMicroService.timeout })
  .client(config.blockchainMicroService);


const addIdentity = data => new Promise((resolve, reject) => {
  ethereumSenecaClient.act({
    role: 'digital',
    cmd: 'addIdentity',
    data,
  }, (err, res) => {
    if (err) {
      reject(err);
    } else {
      resolve(res);
    }
  });
});


const getIdentity = data => new Promise((resolve, reject) => {
  ethereumSenecaClient.act({
    role: 'digital',
    cmd: 'getIdentity',
    data,
  }, (err, res) => {
    if (err) {
      reject(err);
    } else {
      resolve(res);
    }
  });
});

const verifyDigitalIdentity = data => new Promise((resolve, reject) => {
  ethereumSenecaClient.act({
    role: 'digital',
    cmd: 'verifyIdentity',
    data,
  }, (err, res) => {
    if (err) {
      reject(err);
    } else {
      resolve(res);
    }
  });
});
module.exports = {
  addIdentity,
  getIdentity,
  verifyDigitalIdentity,
};
