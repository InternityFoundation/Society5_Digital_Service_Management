const cryptoJSON = require('crypto-json');
const utils = require('./utils');

const cipher = 'aes-256-cbc-hmac-sha1';
const encoding = 'hex';

const encrypt = (object, keys) => {
  const encrypted = cryptoJSON.encrypt(object, utils.keys.secretKeyForDB, {
    algorithm: cipher,
    encoding,
    keys,
  });
  return encrypted;
};

const decrypt = (encryptedObject, keys) => {
  const decrypted = cryptoJSON.decrypt(encryptedObject, utils.keys.secretKeyForDB, {
    algorithm: cipher,
    encoding,
    keys,
  });
  return decrypted;
};

const encryptAll = (array, keys) => {
  const encrypted = encrypt({ array }, ['array'].concat(keys)).array;
  return encrypted;
};

const decryptAll = (encryptedArray, keys) => {
  const decrypted = decrypt({ encryptedArray }, ['encryptedArray'].concat(keys)).encryptedArray;
  return decrypted;
};

module.exports = {
  encrypt,
  decrypt,
  encryptAll,
  decryptAll,
};
