const bcrypt = require('bcrypt');

const generateBcryptHash = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

const compareHash = (password, hash) => bcrypt.compareSync(password, hash);

const keys = {
  secretKeyForDB: process.env.SECRET_KEY_FOR_ENCRYPT,
};

const keysToEncrypt = {
  user: ['email'],
};

module.exports = {
  keys,
  keysToEncrypt,
  compareHash,
  generateBcryptHash,
};
