const userModel = require('../../models/user');

// eslint-disable-next-line func-names
module.exports = function () {
  const seneca = this;
  seneca.add({ role: 'user', cmd: 'addMultiple' }, userModel.addMultiple);
  seneca.add({ role: 'user', cmd: 'find' }, userModel.find);
  };
