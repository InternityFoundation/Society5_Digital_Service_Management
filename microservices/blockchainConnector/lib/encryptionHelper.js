const cryptoJS = require('crypto-js');
const config = require('../config/index');

const cipher = 'aes-256-cbc-hmac-sha1';
const encoding = 'hex';

const encrypt = (object) => {
  try {
    const encrypted = cryptoJSON.encrypt(object, config.secretKeyToEncrypt, {
      algorithm: cipher,
      encoding,
      keys: ['data'],
    });
    return encrypted;
  }
  catch (e) {
    console.log(e);

  }
};

const decrypt = (encryptedObject, keys) => {
  const decrypted = cryptoJSON.decrypt(encryptedObject, config.secretKeyToEncrypt, {
    algorithm: cipher,
    encoding,
    keys,
  });
  return decrypted;
};


const toEncrypt = (str, key) => {
  try {
    if (typeof str === 'string') {
      return encodeURIComponent(cryptoJS.AES.encrypt(str, config.secretKeyToEncrypt));
      // return enc;
    }
    return encodeURIComponent(cryptoJS.AES.encrypt(JSON.stringify(str), key));
  } catch (e) {
    console.log(e);
  }
};

const toDecrypt = (str, key) => {
  if (typeof str === 'string') {
    const bytes = cryptoJS.AES.decrypt(decodeURIComponent(str).toString(), config.secretKeyToEncrypt);
    return bytes.toString(cryptoJS.enc.Utf8);
  }
  const bytes = cryptoJS.AES.decrypt(decodeURIComponent(str).toString(), key);
  return JSON.parse(bytes.toString(cryptoJS.enc.Utf8));
};

module.exports = {
  toEncrypt,
  toDecrypt,
};
